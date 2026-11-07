import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { publicPages, renderOgSvg, renderPublicHtml, renderRobots, renderSitemap } from "./seo";

const SPA_ROUTES = [
  "studio/onboarding",
  "studio/bots",
  "studio/bots/chief",
  "studio/bots/reception",
  "studio/bots/records",
  "studio/bots/promo",
  "studio/bots/payments",
  "studio/bots/watch",
  "studio/bots/scene-wantang",
  "studio/work",
  "studio/memory",
  "studio/tools",
  "studio/settings",
  "app",
  "app/chat/jason",
  "app/chat/ajie",
  "app/chat/leo",
  "app/chat/tom",
  "models/wantang",
  "models/wantang/book",
  "models/wantang/checkout",
];

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
  const shell = readFileSync(path.join(outDir, "studio.html"), "utf8");
  for (const route of SPA_ROUTES) {
    const target = path.join(outDir, route, "index.html");
    mkdirSync(path.dirname(target), { recursive: true });
    writeFileSync(target, shell);
  }
}
