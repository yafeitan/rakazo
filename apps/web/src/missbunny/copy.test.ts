import { describe, expect, it } from "vitest";
import { localizeDashboard } from "./copy";
import { dashboard, setRole } from "./domain";
import { seedState } from "./seed";

describe("missbunny english dashboard", () => {
  it("translates the model dashboard and leaves the Chinese view unchanged", () => {
    const state = setRole(seedState(), "model", "wantang");
    if (!state) throw new Error("role");
    const view = dashboard(state);
    if (!view) throw new Error("dashboard");
    const { profile: _profile, ...rest } = view;
    const english = localizeDashboard(rest, "en");
    expect(english.badge).toBe("Answers only from your profile. Nothing invented.");
    expect(english.pricing.monthly).toBe(420);
    expect(english.pricing).not.toHaveProperty("tool");
    const price = english.inquiries.find((inquiry) => inquiry.id === "lead-price");
    const time = english.inquiries.find((inquiry) => inquiry.id === "lead-time");
    expect(price?.question).toBe("What do you charge tonight?");
    expect(price?.label).toBe("Needs you to confirm");
    expect(price?.draft).toBe("");
    expect(time?.question).toBe("Are you free Thursday evening?");
    expect(time?.draft).toBe("Available: Thursday to Sunday, after dusk.");
    const waiting = english.awaiting.find((order) => order.note.length > 0);
    expect(waiting?.note).toBe("Transferred with the reference");
    expect(waiting?.startsAt).not.toContain("周");
    expect(JSON.stringify(english)).not.toContain("工具费");
    expect(localizeDashboard(rest, "zh").badge).toBe("只用你资料里的内容回答，不编");
  });
});
