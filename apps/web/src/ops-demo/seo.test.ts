import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { renderPublicHtml, renderRobots, renderSitemap, STUDIO_ROBOTS } from "./seo";

const required = [
  "<title>",
  'name="description"',
  'rel="canonical"',
  'property="og:title"',
  'property="og:description"',
  'property="og:image"',
  'property="og:url"',
  'name="twitter:card"',
  "application/ld+json",
];

describe("public seo", () => {
  it("prerenders home, features, cases, and blog", () => {
    for (const path of [
      "/",
      "/features",
      "/cases",
      "/cases/wantang",
      "/blog",
      "/blog/while-you-sleep",
    ]) {
      const html = renderPublicHtml(path);
      expect(html).toBeTruthy();
      for (const needle of required) expect(html).toContain(needle);
    }
    const home = renderPublicHtml("/") ?? "";
    expect(home).toContain("一个名字，干完所有活。");
    expect(home).toContain("Organization");
    expect(home).toContain("WebSite");
    expect(renderPublicHtml("/features")).toContain("SoftwareApplication");
    expect(renderPublicHtml("/blog/while-you-sleep")).toContain("BlogPosting");
    expect(renderPublicHtml("/cases/wantang")).toContain("https://mrlootbox.com/models/wantang");
    expect(renderPublicHtml("/nope")).toBeNull();
  });

  it("keeps the studio out of the sitemap and robots", () => {
    const robots = renderRobots();
    const sitemap = renderSitemap();
    expect(robots).toContain("Disallow: /studio");
    expect(robots).toContain("Sitemap: https://rakazo.com/sitemap.xml");
    expect(sitemap).not.toContain("/studio");
    expect(sitemap).toContain("https://rakazo.com/blog/while-you-sleep");
    expect(STUDIO_ROBOTS).toBe("noindex, nofollow");
    const studio = readFileSync(
      path.join(path.dirname(fileURLToPath(import.meta.url)), "../../studio.html"),
      "utf8",
    );
    expect(studio).toContain('content="noindex, nofollow"');
  });
});
