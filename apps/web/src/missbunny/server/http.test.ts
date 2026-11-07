import { describe, expect, it } from "vitest";
import { emptyDraft } from "../domain";
import { PRIVATE_MARKERS } from "../seed";
import { handleMissbunny } from "./http";
import { generateProfileCopy } from "./llm";

function orderFrom(body: unknown) {
  const order = body && typeof body === "object" && "order" in body ? body.order : undefined;
  if (!order || typeof order !== "object") throw new Error("missing order");
  return order as {
    status: string;
    contacts: { wechat?: string } | null;
    audits: { action: string }[];
  };
}

function field<T>(body: unknown, key: string): T {
  if (!body || typeof body !== "object" || !(key in body)) throw new Error(key);
  return (body as Record<string, unknown>)[key] as T;
}

function withoutToken(body: unknown): string {
  if (!body || typeof body !== "object") return "";
  const clone = { ...(body as Record<string, unknown>) };
  delete clone.token;
  return JSON.stringify(clone);
}

async function post(op: string, token: string | undefined, extra: Record<string, unknown> = {}) {
  const response = await handleMissbunny(
    new Request("http://demo.local/api/missbunny", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...(token ? { "x-missbunny-token": token } : {}),
      },
      body: JSON.stringify({ op, ...extra }),
    }),
  );
  const text = await response.text();
  const body = response.headers.get("content-type")?.includes("text/event-stream")
    ? null
    : (JSON.parse(text) as Record<string, unknown>);
  return { status: response.status, body, text };
}

describe("missbunny http", () => {
  it("omits private contacts from public profile and search payloads", async () => {
    const listed = await post("profiles", undefined);
    const one = await post("profile", listed.body?.token as string, { slug: "wantang" });
    expect(listed.status).toBe(200);
    expect(one.status).toBe(200);
    for (const marker of PRIVATE_MARKERS) {
      expect(withoutToken(listed.body ?? {})).not.toContain(marker);
      expect(withoutToken(one.body ?? {})).not.toContain(marker);
    }
    expect(withoutToken(one.body ?? {})).not.toContain("wx-ali-private");
  });

  it("shows a PayID deposit at checkout and keeps contacts until she confirms", async () => {
    const start = await post("bootstrap", undefined);
    const token = start.body?.token as string;
    const open = await post("checkout", token, { slug: "wantang" });
    expect(withoutToken(open.body ?? {})).toContain("payid-wantang-private");
    expect(withoutToken(open.body ?? {})).not.toContain("wx-wantang-private");
    const phoneOnly = await post("checkout", token, { slug: "chengyue" });
    expect(withoutToken(phoneOnly.body ?? {})).not.toContain("bank-chengyue-private");
    const profile = await post("profile", token, { slug: "wantang" });
    expect(withoutToken(profile.body ?? {})).not.toContain("payid-wantang-private");

    const pending = await post("order", token, { id: "order-pending" });
    expect(withoutToken(pending.body ?? {})).not.toContain("wx-wantang-private");
    const paid = await post("pay", pending.body?.token as string, {
      id: "order-pending",
      note: "已转",
      screenshotAttached: true,
    });
    expect(orderFrom(paid.body).status).toBe("AWAITING_MODEL_CONFIRM");
    expect(withoutToken(paid.body ?? {})).not.toContain("wx-wantang-private");

    const asModel = await post("session", paid.body?.token as string, {
      role: "model",
      modelId: "wantang",
    });
    const confirmed = await post("confirm", asModel.body?.token as string, { id: "order-pending" });
    expect(orderFrom(confirmed.body).contacts).toBeNull();
    const asGuest = await post("session", confirmed.body?.token as string, { role: "user" });
    const seen = await post("order", asGuest.body?.token as string, { id: "order-pending" });
    expect(orderFrom(seen.body).contacts?.wechat).toBe("wx-wantang-private");
    const actions = orderFrom(seen.body).audits.map((entry) => entry.action);
    expect(actions).toEqual(expect.arrayContaining(["客人表示已付款", "模特确认到账"]));
  });

  it("disputes and simulates timeout without releasing contacts", async () => {
    const start = await post("session", undefined, { role: "model", modelId: "wantang" });
    const disputed = await post("dispute", start.body?.token as string, { id: "order-awaiting" });
    expect(orderFrom(disputed.body).status).toBe("DISPUTED");
    expect(withoutToken(disputed.body ?? {})).not.toContain("wx-wantang-private");
    const asGuest = await post("session", disputed.body?.token as string, { role: "user" });
    const cancelled = await post("timeout", asGuest.body?.token as string, { id: "order-pending" });
    expect(orderFrom(cancelled.body).status).toBe("CANCELLED");
    expect(withoutToken(cancelled.body ?? {})).not.toContain("wx-wantang-private");
  });

  it("blocks the engine until the profile is ready, then starts it", async () => {
    const asAli = await post("session", undefined, { role: "model", modelId: "ali" });
    const studio = await post("studio", asAli.body?.token as string);
    const blocked = await post("engine.start", studio.body?.token as string, {
      sync: true,
      draft: field(studio.body, "draft"),
    });
    const blockedBody = field<{
      ready: boolean;
      gaps: { suggestion: string }[];
    }>(blocked.body, "assessment");
    expect(blockedBody.ready).toBe(false);
    expect(blockedBody.gaps.map((gap) => gap.suggestion)).toContain("至少设置一种收款方式");
    expect(withoutToken(blocked.body ?? {})).not.toContain("wx-ali-private");

    const asWantang = await post("session", undefined, { role: "model", modelId: "wantang" });
    const current = await post("studio", asWantang.body?.token as string);
    const response = await handleMissbunny(
      new Request("http://demo.local/api/missbunny", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-missbunny-token": current.body?.token as string,
        },
        body: JSON.stringify({
          op: "engine.start",
          draft: field(current.body, "draft"),
        }),
      }),
    );
    const stream = await response.text();
    expect(stream).toContain("正在阅读档案");
    expect(stream).toContain("引擎已开始为你工作");
    const events = stream
      .split("\n\n")
      .map((block) => block.replace(/^data:\s*/, ""))
      .filter(Boolean)
      .map((line) => JSON.parse(line) as { type: string; token?: string; text?: string });
    const result = events.find((event) => event.type === "result");
    expect(result?.token).toBeTruthy();
    expect(JSON.stringify({ ...result, token: undefined })).not.toContain("wx-wantang-private");
  });

  it("falls back to the template when no local model is configured", async () => {
    const copy = await generateProfileCopy(
      { ...emptyDraft(), stageName: "晚棠", city: "墨尔本", availability: "傍晚" },
      { env: {} },
    );
    expect(copy.source).toBe("template");
    expect(copy.bio).toContain("晚棠");
  });

  it("uses a configured local model and drops a banned completion", async () => {
    const fetcher = (async () =>
      new Response(JSON.stringify({ choices: [{ message: { content: "一段简介" } }] }), {
        status: 200,
        headers: { "content-type": "application/json" },
      })) as typeof fetch;
    const copy = await generateProfileCopy(emptyDraft(), {
      env: { RAKAZO_LOCAL_MODELS: "demo-model", RAKAZO_LOCAL_MODELS_URL: "http://127.0.0.1:9/v1" },
      fetcher,
    });
    expect(copy).toEqual({ bio: "一段简介", source: "model" });

    const banned = await generateProfileCopy(emptyDraft(), {
      env: { RAKAZO_LOCAL_MODELS: "demo-model", RAKAZO_LOCAL_MODELS_URL: "http://127.0.0.1:9/v1" },
      fetcher: (async () =>
        new Response(JSON.stringify({ choices: [{ message: { content: "援交" } }] }), {
          status: 200,
        })) as typeof fetch,
    });
    expect(banned.source).toBe("template");
    expect(banned.bio).not.toContain("援交");
  });
});
