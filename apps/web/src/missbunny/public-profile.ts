import { localizePublicProfile } from "./copy";
import type { PublicProfile } from "./domain";
import { toPublicProfile } from "./domain";
import { seedState } from "./seed";

/** Public pages use this origin. The operating system origin stays off those pages. */
export const DEFAULT_PUBLIC_PROFILE_BASE_URL = "https://mrlootbox.com";

const OS_MARKERS = ["missbunny", "miss bunny", "/api/"];

export function publicProfileBaseUrl(env?: { PUBLIC_PROFILE_BASE_URL?: string }): string {
  const fromProcess =
    typeof process !== "undefined" ? process.env.PUBLIC_PROFILE_BASE_URL?.trim() : undefined;
  const configured = env?.PUBLIC_PROFILE_BASE_URL?.trim() || fromProcess;
  return (configured || DEFAULT_PUBLIC_PROFILE_BASE_URL).replace(/\/$/, "");
}

export function publicProfileUrl(slug: string, lang: "zh" | "en" = "zh"): string {
  const base = `${publicProfileBaseUrl()}/${slug}`;
  return lang === "en" ? `${base}?lang=en` : base;
}

export function publicProfileSlug(pathname: string): string | null {
  const match = pathname.match(/^\/p\/([a-z0-9-]+)\/?$/);
  return match?.[1] ?? null;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function profileFor(slug: string, lang: "zh" | "en"): PublicProfile | null {
  const profile = seedState().profiles.find((item) => item.slug === slug && item.published);
  if (!profile) return null;
  return localizePublicProfile(toPublicProfile(profile), lang);
}

/** Square modules for a link code. Finder squares sit in three corners; the rest encode the URL. */
export function linkCodeModules(value: string): boolean[][] {
  const size = 33;
  const grid = Array.from({ length: size }, () => Array.from({ length: size }, () => false));
  const finder = (row: number, col: number) => {
    for (let y = 0; y < 7; y += 1) {
      for (let x = 0; x < 7; x += 1) {
        const edge = x === 0 || y === 0 || x === 6 || y === 6;
        const core = x >= 2 && x <= 4 && y >= 2 && y <= 4;
        grid[row + y]![col + x] = edge || core;
      }
    }
  };
  finder(0, 0);
  finder(0, size - 7);
  finder(size - 7, 0);
  let bit = 0;
  const bytes = Array.from(new TextEncoder().encode(value));
  for (let row = 0; row < size; row += 1) {
    for (let col = 0; col < size; col += 1) {
      if (grid[row]?.[col]) continue;
      const reserved =
        (row < 8 && col < 8) || (row < 8 && col > size - 9) || (row > size - 9 && col < 8);
      if (reserved) continue;
      const byte = bytes[Math.floor(bit / 8)] ?? 0;
      grid[row]![col] = ((byte >> (bit % 8)) & 1) === 1;
      bit += 1;
    }
  }
  return grid;
}

function linkCodeSvg(url: string): string {
  const modules = linkCodeModules(url);
  const cell = 4;
  const size = modules.length * cell;
  const rects = modules
    .flatMap((row, y) =>
      row.map((on, x) =>
        on ? `<rect x="${x * cell}" y="${y * cell}" width="${cell}" height="${cell}"/>` : "",
      ),
    )
    .join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="168" height="168" role="img" aria-label="${escapeHtml(url)}"><title>${escapeHtml(url)}</title><rect width="100%" height="100%" fill="#fff"/>${rects.replaceAll("<rect ", '<rect fill="#111" ')}</svg>`;
}

export function renderPublicProfileHtml(slug: string, lang: "zh" | "en" = "zh"): string | null {
  const profile = profileFor(slug, lang);
  if (!profile) return null;
  const url = publicProfileUrl(slug, lang);
  const other = publicProfileUrl(slug, lang === "en" ? "zh" : "en");
  const copyLabel = lang === "en" ? "Copy link" : "复制链接";
  const copied = lang === "en" ? "Copied" : "已复制";
  const zhLabel = "中文";
  const enLabel = "EN";
  const hours = lang === "en" ? "Hours" : "可约";
  const plans = lang === "en" ? "Plans" : "安排";
  const html = `<!doctype html>
<html lang="${lang === "en" ? "en" : "zh-CN"}">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>${escapeHtml(profile.stageName)}</title>
<link rel="canonical" href="${escapeHtml(url)}"/>
<meta property="og:url" content="${escapeHtml(url)}"/>
<meta property="og:title" content="${escapeHtml(profile.stageName)}"/>
<meta property="og:description" content="${escapeHtml(profile.bio)}"/>
<style>
  body { margin: 0; font: 18px/1.5 system-ui, sans-serif; color: #111; background: #fff; }
  main { max-width: 40rem; margin: 0 auto; padding: 2rem 1.25rem 3rem; }
  h1 { font-size: 2.5rem; font-weight: 500; margin: 0; }
  p { margin: 0.5rem 0 0; }
  .muted { color: #5c5c5c; }
  a { color: inherit; }
  button { font: inherit; margin-top: 1rem; }
  section { margin-top: 1.5rem; }
  h2 { font-size: 1rem; font-weight: 500; margin: 0; }
</style>
</head>
<body>
<main>
  <p class="muted"><a href="${escapeHtml(other)}">${lang === "en" ? zhLabel : enLabel}</a></p>
  <h1>${escapeHtml(profile.stageName)}</h1>
  <p class="muted">${escapeHtml(profile.city)} · ${escapeHtml(profile.languages.join(" · "))}</p>
  <p>${escapeHtml(profile.bio)}</p>
  <section><h2>${hours}</h2><p>${escapeHtml(profile.availability)}</p></section>
  <section><h2>${plans}</h2><p>${escapeHtml(profile.services)}</p></section>
  <section>
    <p><a href="${escapeHtml(url)}">${escapeHtml(url)}</a></p>
    <button type="button" id="copy">${copyLabel}</button>
    <div>${linkCodeSvg(url)}</div>
  </section>
</main>
<script>
  document.getElementById("copy").addEventListener("click", function () {
    navigator.clipboard.writeText(${JSON.stringify(url)}).then(function () {
      document.getElementById("copy").textContent = ${JSON.stringify(copied)};
    });
  });
</script>
</body>
</html>`;
  return html;
}

/** Fails when a public page mentions the operating system or its API. */
export function publicProfileLeaksOs(html: string): string[] {
  const haystack = html.toLowerCase();
  return OS_MARKERS.filter((marker) => haystack.includes(marker));
}
