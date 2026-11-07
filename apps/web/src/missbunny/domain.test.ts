import { describe, expect, it } from "vitest";
import {
  acknowledgeInquiry,
  assess,
  bookInquiry,
  commitEngine,
  completeOrder,
  confirmReceived,
  createOrder,
  dashboard,
  disputeOrder,
  draftFromProfile,
  emptyDraft,
  ledger,
  listOrders,
  markPaid,
  presentInquiry,
  presentOrder,
  replyFromProfile,
  searchProfiles,
  setRole,
  simulateTimeout,
  templateBio,
} from "./domain";
import { PRIVATE_MARKERS, seedState } from "./seed";

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

  it("walks a PayID deposit from pending to completed", () => {
    const now = new Date("2026-11-07T05:00:00.000Z");
    const created = createOrder(
      seedState(now),
      { slug: "wantang", startsAt: "周日 20:00", phone: "0412 000 444" },
      now,
    );
    if (!created.ok) throw new Error(created.error);
    const pending = created.state.orders.find((item) => item.id === created.orderId);
    expect(pending?.status).toBe("PENDING_PAYMENT");
    expect(pending?.depositAmount).toBe(100);
    expect(presentOrder(created.state, pending!, true)?.contacts).toBeNull();
    const paid = markPaid(
      created.state,
      created.orderId,
      { note: "已转", screenshotAttached: true },
      now,
    );
    if (!paid) throw new Error("pay");
    const asModel = setRole(paid, "model", "wantang");
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
    const guest = setRole(done, "user", "wantang");
    if (!guest || !order) throw new Error("guest");
    expect(presentOrder(guest, order, true)?.contacts?.wechat).toBe("wx-wantang-private");
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

  it("refreshes an open inquiry when her availability changes", () => {
    const asModel = setRole(seedState(), "model", "wantang");
    if (!asModel) throw new Error("role");
    const profile = asModel.profiles.find((item) => item.id === "wantang");
    if (!profile) throw new Error("profile");
    const committed = commitEngine(asModel, {
      ...draftFromProfile(profile),
      availability: "仅周五晚上",
    });
    if (!committed.ok) throw new Error(committed.error);
    expect(committed.state.inquiries.find((item) => item.id === "lead-time")?.draft).toContain(
      "仅周五晚上",
    );
    expect(
      committed.state.inquiries.find((item) => item.id === "lead-booked")?.draft,
    ).not.toContain("仅周五晚上");
  });

  it("books with a phone number when she does not ask for a deposit", () => {
    const created = createOrder(seedState(), {
      slug: "chengyue",
      startsAt: "周日 20:00",
      phone: "0412000555",
    });
    if (!created.ok) throw new Error(created.error);
    const order = created.state.orders.find((item) => item.id === created.orderId);
    if (!order) throw new Error("missing");
    expect(order.status).toBe("CONFIRMED");
    expect(order.depositAmount).toBe(0);
    expect(presentOrder(created.state, order, true)?.contacts?.wechat).toBe("wx-chengyue-private");
    expect(
      createOrder(seedState(), { slug: "chengyue", startsAt: "周日 20:00", phone: "12" }).ok,
    ).toBe(false);
  });

  it("keeps the ledger at zero until the engine is running", () => {
    const state = seedState();
    const ali = state.profiles.find((profile) => profile.id === "ali");
    const live = state.profiles.find((profile) => profile.id === "wantang");
    if (!ali || !live) throw new Error("missing");
    expect(ledger(ali).total).toBe(0);
    expect(ledger(live).total).toBeGreaterThan(0);
  });

  it("answers only from the profile and flags everything else", () => {
    const state = seedState();
    const model = state.profiles.find((profile) => profile.id === "wantang");
    if (!model) throw new Error("missing");
    const time = replyFromProfile(model, "availability");
    expect(time.needsConfirm).toBe(false);
    expect(time.draft).toContain(model.availability);
    expect(time.draft).not.toContain("wx-");
    const price = replyFromProfile(model, "price");
    const agency = replyFromProfile(model, "agency");
    expect(price).toEqual({ draft: "", needsConfirm: true });
    expect(agency).toEqual({ draft: "", needsConfirm: true });
    const shown = presentInquiry(state.inquiries.find((item) => item.id === "lead-price")!);
    expect(shown.draft).toBe("");
    expect(shown.label).toBe("需要你确认");
    const view = dashboard(setRole(state, "model", "wantang") ?? state);
    if (!view) throw new Error("dashboard");
    const { profile: _profile, ...rest } = view;
    const text = JSON.stringify(rest);
    expect(text).toContain("只用你资料里的内容回答，不编");
    expect(text).not.toContain("wx-wantang-private");
    expect(text).not.toContain("payid-wantang-private");
    expect(view?.pricing.monthly).toBe(420);
    expect(view?.pricing.monthly).toBe(view?.pricing.token);
    expect(view?.pricing.token).toBeGreaterThanOrEqual(view?.pricing.tokenLow ?? 0);
    expect(view?.pricing.token).toBeLessThanOrEqual(view?.pricing.tokenHigh ?? 0);
    expect(view?.pricing).not.toHaveProperty("tool");
  });

  it("turns a drafted inquiry into a pending booking without releasing contacts", () => {
    const asModel = setRole(seedState(), "model", "wantang");
    if (!asModel) throw new Error("role");
    const booked = bookInquiry(asModel, "lead-time");
    if (!booked.ok) throw new Error(booked.error);
    const order = booked.state.orders.find((item) => item.id === booked.orderId);
    if (!order) throw new Error("missing order");
    expect(order.status).toBe("PENDING_PAYMENT");
    expect(presentOrder(booked.state, order, true)?.contacts).toBeNull();
    expect(bookInquiry(asModel, "lead-price").ok).toBe(false);
    const seen = acknowledgeInquiry(asModel, "lead-price");
    const gap = seen?.inquiries.find((item) => item.id === "lead-price");
    expect(gap?.draft).toBe("");
    expect(gap?.status).toBe("handed_off");
  });

  it("does not leak contact markers in a pending order view", () => {
    const state = seedState();
    const order = state.orders.find((item) => item.id === "order-pending");
    if (!order) throw new Error("missing");
    const view = visible(presentOrder(state, order, true));
    for (const marker of contactMarkers) expect(view).not.toContain(marker);
  });
});
