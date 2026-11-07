import { describe, expect, it } from "vitest";
import {
  DEFAULT_PUBLIC_PROFILE_BASE_URL,
  publicProfileLeaksOs,
  publicProfileUrl,
  renderPublicProfileHtml,
} from "./public-profile";

describe("public profile pages", () => {
  it("uses the public base and never mentions the operating system", () => {
    expect(DEFAULT_PUBLIC_PROFILE_BASE_URL).toBe("https://mrlootbox.com");
    expect(publicProfileUrl("wantang")).toBe("https://mrlootbox.com/wantang");
    expect(publicProfileUrl("wantang", "en")).toBe("https://mrlootbox.com/wantang?lang=en");
    const html = renderPublicProfileHtml("wantang");
    if (!html) throw new Error("missing page");
    expect(publicProfileLeaksOs(html)).toEqual([]);
    expect(html).toContain('rel="canonical" href="https://mrlootbox.com/wantang"');
    expect(html).toContain('property="og:url" content="https://mrlootbox.com/wantang"');
    expect(html).toContain("https://mrlootbox.com/wantang");
    expect(html).not.toContain("/api/");
    expect(html).not.toMatch(/A\$\d/);
    expect(html).not.toContain("订金");
    const english = renderPublicProfileHtml("wantang", "en");
    expect(english).toContain("https://mrlootbox.com/wantang?lang=en");
    expect(english).toContain("Melbourne");
    expect(publicProfileLeaksOs(english ?? "")).toEqual([]);
  });
});
