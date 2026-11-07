import { describe, expect, it } from "vitest";
import { canSendDraft, guestCopyLeaks, guestTurns, humanDelay } from "./guest-desk";

const voice = { availability: "周四晚上", services: "私人晚宴", payment: "PayID" };

describe("guest desk drafts", () => {
  it("lets her send routine answers and holds the sensitive one", () => {
    const turns = guestTurns(voice, "zh");
    expect(turns.map((turn) => turn.kind)).toEqual(["oneTap", "oneTap", "needsHer"]);
    expect(turns[0]?.draft).toBe("周四晚上可以。私人晚宴。");
    expect(
      canSendDraft({
        kind: "oneTap",
        original: turns[0]?.draft ?? "",
        current: turns[0]?.draft ?? "",
        confirmed: false,
      }),
    ).toBe(true);
    const sensitive = turns[2];
    expect(sensitive?.guest).toContain("再想想");
    expect(
      canSendDraft({
        kind: "needsHer",
        original: sensitive?.draft ?? "",
        current: sensitive?.draft ?? "",
        confirmed: false,
      }),
    ).toBe(false);
    expect(
      canSendDraft({
        kind: "needsHer",
        original: sensitive?.draft ?? "",
        current: sensitive?.draft ?? "",
        confirmed: true,
      }),
    ).toBe(true);
    expect(
      canSendDraft({
        kind: "needsHer",
        original: sensitive?.draft ?? "",
        current: "先付一百，到了再说。",
        confirmed: false,
      }),
    ).toBe(true);
  });

  it("keeps the guest’s side free of assistant wording", () => {
    for (const lang of ["zh", "en"] as const) {
      for (const turn of guestTurns(voice, lang)) {
        expect(guestCopyLeaks(turn.guest)).toBe(false);
        expect(guestCopyLeaks(turn.draft)).toBe(false);
      }
    }
    expect(guestCopyLeaks("正在输入…")).toBe(false);
    expect(guestCopyLeaks("typing…")).toBe(false);
  });

  it("waits a few seconds before the guest sees a reply", () => {
    expect(humanDelay(() => 0)).toBe(3000);
    expect(humanDelay(() => 0.999999)).toBe(8000);
  });
});
