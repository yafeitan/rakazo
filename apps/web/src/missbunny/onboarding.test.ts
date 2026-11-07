import { describe, expect, it } from "vitest";
import { EMPTY_WORKSPACE, missingWorkspace, workspaceReady } from "./onboarding";

describe("missbunny workspace", () => {
  it("starts only when every required field is filled", () => {
    expect(missingWorkspace(EMPTY_WORKSPACE)).toEqual([
      "stageName",
      "city",
      "availability",
      "services",
      "payment",
    ]);
    expect(workspaceReady(EMPTY_WORKSPACE)).toBe(false);
    expect(
      workspaceReady({
        stageName: "晚棠",
        city: "墨尔本",
        availability: "周四晚上",
        services: "私人晚宴",
        payment: "PayID",
      }),
    ).toBe(true);
  });
});
