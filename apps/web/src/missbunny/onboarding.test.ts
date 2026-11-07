import { describe, expect, it } from "vitest";
import { missingOnboarding, onboardingReady } from "./onboarding";

describe("missbunny onboarding", () => {
  it("stays blocked only until 自运营 is chosen", () => {
    expect(missingOnboarding({ selfRun: false })).toEqual(["自运营"]);
    expect(onboardingReady({ selfRun: false })).toBe(false);
    expect(missingOnboarding({ selfRun: true })).toEqual([]);
    expect(onboardingReady({ selfRun: true })).toBe(true);
  });
});
