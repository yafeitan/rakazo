import { describe, expect, it } from "vitest";
import { PAYEE_NAME } from "./domain";
import { guestSurfaceIsClean } from "./guest-copy";

describe("guest surface", () => {
  it("never names a bot, and the payee stays 晚棠", () => {
    expect(guestSurfaceIsClean()).toBe(true);
    expect(PAYEE_NAME).toBe("晚棠");
  });
});
