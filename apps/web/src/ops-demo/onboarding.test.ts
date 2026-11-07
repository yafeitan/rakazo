import { describe, expect, it } from "vitest";
import { fieldVisibility, generate, wantangForm } from "./onboarding";

describe("onboarding", () => {
  it("hides shop hours on the sensitive line and shows them on setup", () => {
    expect(fieldVisibility("sensitive")).toMatchObject({
      regulations: true,
      hours: false,
      slotsNote: true,
      lock: true,
    });
    expect(fieldVisibility("build_service")).toMatchObject({
      regulations: false,
      hours: true,
      siteRequired: true,
    });
  });

  it("writes schema 3 for 晚棠 without secrets", () => {
    const pack = generate(wantangForm(), "2026-11-07T00:00:00.000Z");
    expect(pack.errors).toEqual([]);
    expect(pack.config?.schema_version).toBe(3);
    expect(pack.config?.product_line).toBe("sensitive");
    expect(pack.config?.placeholders.MERCHANT_SLUG).toBe("wantang");
    expect(pack.config?.placeholders.WORKSPACE).toBe("wantang");
    expect(pack.config?.placeholders.BRIEF_TIME).toBe("21:30");
    expect(pack.config?.placeholders.PAYID_ACCOUNT).toBe("wantang@example.com");
    expect(pack.config?.placeholders.LOCK_RULE).toBe("收钱前必须先问我有没有空");
    expect(pack.config?.placeholders.START_PRICES).toContain("A$600");
    expect(pack.config?.placeholders.FLOOR_PRICES).toContain("A$2,000");
    expect(pack.config?.placeholders.SPEND_LIMIT).toBe("ASK");
    expect(pack.config?.notes.draft_only).toBe(true);
    const blob = JSON.stringify(pack.config);
    expect(blob).not.toMatch(/password|token|card number|银行卡/i);
    expect(pack.owner).toContain("晚棠");
    expect(pack.offering).toContain("A$600");
    expect(pack.owner).toContain("ASK");
  });

  it("requires hours only for the setup line", () => {
    const form = wantangForm();
    form.productLine = "build_service";
    form.siteUrl = "https://example.com";
    form.services = ["美甲"];
    const missing = generate(form);
    expect(missing.errors).toContain("营业时间");
    form.days = ["1"];
    form.open = "10:00";
    form.close = "20:00";
    expect(generate(form).errors).not.toContain("营业时间");
  });
});
