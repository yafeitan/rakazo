import { describe, expect, it } from "vitest";
import {
  assess,
  completeOrder,
  confirmReceived,
  createOrder,
  disputeOrder,
  draftFromProfile,
  emptyDraft,
  ledger,
  listOrders,
  markPaid,
  presentOrder,
  searchProfiles,
  setRole,
  simulateTimeout,
  templateBio,
} from "./domain.js";
import { PRIVATE_MARKERS, seedState } from "./seed.js";

const contactMarkers = PRIVATE_MARKERS.filter(
  (marker) => !marker.startsWith("payid") && !marker.startsWith("bank"),
);

function visible(value: unknown): string {
  return JSON.stringify(value);
}

describe("missbunny profiles", () => {
  it("publishes two models and keeps the unfinished one private", () => {
    const state = seedState();
    const listed = searchProfiles(state, "");
    expect(listed.map((profile) => profile.stageName).sort()).toEqual(["晚棠", "澄月"]);
    expect(visible(listed)).not.toContain("wx-");
    for (const marker of PRIVATE_MARKERS) expect(visible(listed)).not.toContain(marker);
  });

  it("searches by city without returning contacts", () => {
    const found = searchProfiles(seedState(), "悉尼");
    expect(found).toHaveLength(1);
    expect(found[0]?.stageName).toBe("澄月");
    expect(visible(found)).not.toContain("wx-chengyue-private");
  });

  it("scores readiness and names the missing steps", () => {
    const state = seedState();
    const ali = state.profiles.find((profile) => profile.id === "ali");
    if (!ali) throw new Error("missing seed");
    const result = assess(draftFromProfile(ali));
    expect(result.ready).toBe(false);
    expect(result.score).toBeLessThan(100);
    expect(result.gaps.map((gap) => gap.suggestion)).toEqual(
      expect.arrayContaining(["再添加 2 张照片", "至少设置一种收款方式", "填写可约时间"]),
    );
    const ready = assess(draftFromProfile(state.profiles[0]!));
    expect(ready).toMatchObject({ ready: true, score: 100, gaps: [] });
  });

  it("writes a discreet template and refuses the banned word", () => {
    const bio = templateBio({
      ...emptyDraft(),
      stageName: "晚棠",
      city: "墨尔本",
      services: "私人晚宴陪同。",
      availability: "傍晚",
    });
    expect(bio).toContain("墨尔本");
    expect(bio).not.toContain("援交");
  });
});

describe("missbunny orders", () => {
  it("hides contacts until the model confirms, then shows them to the guest", () => {
    const state = seedState();
    const pending = state.orders.find((order) => order.id === "order-pending");
    const confirmed = state.orders.find((order) => order.id === "order-confirmed");
    if (!pending || !confirmed) throw new Error("missing seed");
    const before = presentOrder(state, pending, true);
    const after = presentOrder(state, confirmed, true);
    expect(before?.contacts).toBeNull();
    expect(after?.contacts?.wechat).toBe("wx-wantang-private");
    const views = listOrders(state);
    expect(views.find((item) => item.id === "order-pending")?.contacts).toBeNull();
    expect(views.find((item) => item.id === "order-awaiting")?.contacts).toBeNull();
    expect(views.find((item) => item.id === "order-confirmed")?.contacts?.wechat).toBe(
      "wx-wantang-private",
    );
  });

  it("does not give contacts to the model through the order", () => {
    const asModel = setRole(seedState(), "model", "wantang");
    if (!asModel) throw new Error("role");
    const order = asModel.orders.find((item) => item.id === "order-confirmed");
    if (!order) throw new Error("missing order");
    expect(presentOrder(asModel, order, true)?.contacts).toBeNull();
  });

  it("walks pending, paid, confirmed, completed", () => {
    const now = new Date("2026-11-07T05:00:00.000Z");
    const created = createOrder(
      { ...seedState(now), session: { ...seedState(now).session, inviteAccepted: true } },
      { slug: "chengyue", startsAt: "周日 20:00", paymentMethodId: "pay-chengyue" },
      now,
    );
    if (!created.ok) throw new Error(created.error);
    const paid = markPaid(
      created.state,
      created.orderId,
      { note: "已转", screenshotAttached: true },
      now,
    );
    if (!paid) throw new Error("pay");
    const asModel = setRole(paid, "model", "chengyue");
    if (!asModel) throw new Error("role");
    const confirmed = confirmReceived(asModel, created.orderId, now);
    if (!confirmed) throw new Error("confirm");
    const done = completeOrder(confirmed, created.orderId, now);
    if (!done) throw new Error("complete");
    const order = done.orders.find((item) => item.id === created.orderId);
    expect(order?.status).toBe("COMPLETED");
    expect(done.audits.map((entry) => entry.action)).toEqual(
      expect.arrayContaining(["创建订单", "客人表示已付款", "模特确认到账", "订单完成"]),
    );
    const guest = setRole(done, "user", "chengyue");
    if (!guest || !order) throw new Error("guest");
    expect(presentOrder(guest, order, true)?.contacts?.wechat).toBe("wx-chengyue-private");
  });

  it("cancels only a pending order, and disputes only while waiting", () => {
    const now = new Date("2026-11-07T05:00:00.000Z");
    const state = seedState(now);
    const cancelled = simulateTimeout(state, "order-pending", now);
    expect(cancelled?.orders.find((order) => order.id === "order-pending")?.status).toBe(
      "CANCELLED",
    );
    expect(simulateTimeout(state, "order-awaiting", now)).toBeNull();
    const asModel = setRole(state, "model", "wantang");
    if (!asModel) throw new Error("role");
    const disputed = disputeOrder(asModel, "order-awaiting", now);
    expect(disputed?.orders.find((order) => order.id === "order-awaiting")?.status).toBe(
      "DISPUTED",
    );
    expect(confirmReceived(disputed ?? asModel, "order-awaiting", now)).toBeNull();
    expect(presentOrder(state, state.orders[0]!, true)?.contacts).toBeNull();
  });

  it("requires an invite before booking", () => {
    const denied = createOrder(seedState(), {
      slug: "wantang",
      startsAt: "周四 19:00",
      paymentMethodId: "pay-wantang",
      code: "NOPE",
    });
    expect(denied.ok).toBe(false);
  });

  it("keeps the ledger at zero until the engine is running", () => {
    const state = seedState();
    const ali = state.profiles.find((profile) => profile.id === "ali");
    const live = state.profiles.find((profile) => profile.id === "wantang");
    if (!ali || !live) throw new Error("missing");
    expect(ledger(ali).total).toBe(0);
    expect(ledger(live).total).toBeGreaterThan(0);
  });

  it("does not leak contact markers in a pending order view", () => {
    const state = seedState();
    const order = state.orders.find((item) => item.id === "order-pending");
    if (!order) throw new Error("missing");
    const view = visible(presentOrder(state, order, true));
    for (const marker of contactMarkers) expect(view).not.toContain(marker);
  });
});
