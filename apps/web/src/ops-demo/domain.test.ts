import { describe, expect, it } from "vitest";
import {
  canSend,
  formatAud,
  guestCopyLeak,
  PAYEE_NAME,
  pendingCount,
  seedDrafts,
  typingDelayMs,
} from "./domain";

describe("draft rules", () => {
  it("sends a one-tap draft and holds a draft that needs her", () => {
    expect(canSend({ tag: "可一键发", confirmed: false, edited: false })).toBe(true);
    expect(canSend({ tag: "需本人回复", confirmed: false, edited: false })).toBe(false);
    expect(canSend({ tag: "需本人回复", confirmed: true, edited: false })).toBe(true);
    expect(canSend({ tag: "需本人回复", confirmed: false, edited: true })).toBe(true);
  });

  it("starts with three items waiting on her", () => {
    expect(pendingCount(seedDrafts, false)).toBe(3);
  });
});

describe("typing delay", () => {
  it("stays between 3 and 12 seconds", () => {
    expect(typingDelayMs("有", 0)).toBeGreaterThanOrEqual(3000);
    expect(typingDelayMs("有", 0)).toBeLessThanOrEqual(12000);
    expect(typingDelayMs("晚".repeat(400), 0.99)).toBeLessThanOrEqual(12000);
    expect(typingDelayMs("晚".repeat(400), 0.99)).toBeGreaterThanOrEqual(3000);
  });
});

describe("guest-facing words", () => {
  it("keeps the payee name and rejects assistant wording", () => {
    expect(PAYEE_NAME).toBe("晚棠");
    expect(formatAud(245000)).toBe("A$2,450");
    expect(guestCopyLeak("周五晚有的")).toBe(false);
    expect(guestCopyLeak("我是 AI 助理")).toBe(true);
    expect(guestCopyLeak("the bot will reply")).toBe(true);
  });
});
