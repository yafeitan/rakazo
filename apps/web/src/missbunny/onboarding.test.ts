import { describe, expect, it } from "vitest";
import { missingOnboarding, onboardingReady } from "./onboarding";

describe("missbunny onboarding", () => {
  it("stays blocked until 自运营, X, and IVY are all set", () => {
    expect(missingOnboarding({ selfRun: false, x: false, ivy: false })).toEqual([
      "自运营",
      "X",
      "IVY",
    ]);
    expect(missingOnboarding({ selfRun: true, x: true, ivy: false })).toEqual(["IVY"]);
    expect(missingOnboarding({ selfRun: true, x: false, ivy: true })).toEqual(["X"]);
    expect(onboardingReady({ selfRun: true, x: true, ivy: false })).toBe(false);
    expect(onboardingReady({ selfRun: true, x: true, ivy: true })).toBe(true);
  });
});
