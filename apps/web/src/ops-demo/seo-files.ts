import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { publicPages, renderOgSvg, renderPublicHtml, renderRobots, renderSitemap } from "./seo";

export function writePublicSite(outDir: string) {
  for (const page of publicPages) {
    const html = renderPublicHtml(page.path);
    if (!html) continue;
    const file = page.path === "/" ? "index.html" : `${page.path.slice(1)}/index.html`;
    const target = path.join(outDir, file);
    mkdirSync(path.dirname(target), { recursive: true });
    writeFileSync(target, html);
  }
  writeFileSync(path.join(outDir, "robots.txt"), renderRobots());
  writeFileSync(path.join(outDir, "sitemap.xml"), renderSitemap());
  writeFileSync(path.join(outDir, "og.svg"), renderOgSvg());
}
