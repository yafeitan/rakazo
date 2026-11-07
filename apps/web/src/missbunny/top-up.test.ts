import { describe, expect, it } from "vitest";
import { topUpAmount } from "./top-up";

describe("missbunny credit top-up", () => {
  it("accepts the presets and a custom amount of at least A$50", () => {
    expect(topUpAmount(50, "")).toBe(50);
    expect(topUpAmount(400, "")).toBe(400);
    expect(topUpAmount("other", "50")).toBe(50);
    expect(topUpAmount("other", "80")).toBe(80);
    expect(topUpAmount("other", "")).toBeNull();
    expect(topUpAmount("other", "49")).toBeNull();
    expect(topUpAmount("other", "49.5")).toBeNull();
  });
});
