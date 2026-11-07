import { describe, expect, it } from "vitest";
import { EMPTY_WORKSPACE, missingBinds, missingFields, workspaceReady } from "./onboarding";

const filled = {
  stageName: "晚棠",
  city: "墨尔本",
  availability: "周四晚上",
  services: "私人晚宴",
  payment: "PayID",
  binds: { x: false, ivy: false, catch: false },
};

describe("missbunny workspace", () => {
  it("waits on the profile and the platforms for that market", () => {
    expect(missingFields(EMPTY_WORKSPACE)).toEqual([
      "stageName",
      "city",
      "availability",
      "services",
      "payment",
    ]);
    expect(workspaceReady(filled, "zh")).toBe(false);
    expect(missingBinds(filled, "zh")).toEqual(["catch", "x"]);
    expect(missingBinds(filled, "en")).toEqual(["ivy", "x"]);
    expect(workspaceReady({ ...filled, binds: { x: true, ivy: false, catch: true } }, "zh")).toBe(
      true,
    );
    expect(workspaceReady({ ...filled, binds: { x: true, ivy: false, catch: true } }, "en")).toBe(
      false,
    );
    expect(workspaceReady({ ...filled, binds: { x: true, ivy: true, catch: false } }, "en")).toBe(
      true,
    );
  });
});
