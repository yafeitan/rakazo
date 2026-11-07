/**
 * Public marketing pages are static HTML.
 * The formal canonical host is still unconfirmed; rakazo.com is the placeholder
 * and this preview does not change DNS.
 */
export const CANONICAL_ORIGIN = "https://rakazo.com";

export type PublicPage = {
  path: string;
  title: string;
  description: string;
  jsonLd: Record<string, unknown>;
  body: string;
};

const org = {
  "@type": "Organization",
  name: "rakazo",
  url: CANONICAL_ORIGIN,
};

function pageShell(page: PublicPage): string {
  const url = `${CANONICAL_ORIGIN}${page.path === "/" ? "/" : page.path}`;
  const image = `${CANONICAL_ORIGIN}/og.svg`;
  return `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(page.title)}</title>
<meta name="description" content="${escapeHtml(page.description)}">
<link rel="canonical" href="${url}">
<meta property="og:title" content="${escapeHtml(page.title)}">
<meta property="og:description" content="${escapeHtml(page.description)}">
<meta property="og:image" content="${image}">
<meta property="og:url" content="${url}">
<meta property="og:type" content="website">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${escapeHtml(page.title)}">
<meta name="twitter:description" content="${escapeHtml(page.description)}">
<meta name="twitter:image" content="${image}">
<script type="application/ld+json">${JSON.stringify(page.jsonLd)}</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@500;600&family=Poppins:wght@500;600&display=swap" rel="stylesheet">
<style>${PUBLIC_CSS}</style>
</head>
<body>
<header class="bar"><a class="brand" href="/">rakazo</a><nav><a href="/features">功能</a><a href="/cases">案例</a><a href="/blog">博客</a><a href="/studio">工作台</a></nav></header>
<main>${page.body}</main>
</body>
</html>`;
}

export const publicPages: PublicPage[] = [
  {
    path: "/",
    title: "rakazo 运营 OS",
    description: "一个名字，干完所有活。接待、档案、推广、收款在同一张工作台上。",
    jsonLd: {
      "@context": "https://schema.org",
      "@graph": [org, { "@type": "WebSite", name: "rakazo", url: CANONICAL_ORIGIN }],
    },
    body: `<h1>一个名字，干完所有活。</h1>
<p class="lead">你睡觉时，这四件事还在走。</p>
<ul>
<li>接待，用她的口吻起草。</li>
<li>档案，把客人记清楚。</li>
<li>推广，发出去之前等她点头。</li>
<li>收款，核对到账，再转私域。</li>
</ul>
<p><a class="go" href="/studio">打开工作台</a></p>
<p class="en">One name does the whole shift. Reception drafts. Records file the guest. Promotion waits for her. Payments check the transfer.</p>`,
  },
  {
    path: "/features",
    title: "功能 · rakazo 运营 OS",
    description: "Bot、会话、记忆、技能、例程、审批、工具和电脑，在同一套运营 OS 里。",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "rakazo",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      url: `${CANONICAL_ORIGIN}/features`,
      description: "Bot、会话、记忆、技能、例程、审批、工具和电脑。",
    },
    body: `<h1>一张工作台。</h1>
<ul>
<li>Bot。每个角色有自己的会话和状态。</li>
<li>会话。草稿留在她发出之前。</li>
<li>记忆和技能。口吻和规矩留得住。</li>
<li>例程。到点唤醒，这次不会真的跑。</li>
<li>审批。定金、砍价、推广，都等她点头。</li>
<li>工具和电脑。连接状态只作演示。</li>
</ul>`,
  },
  {
    path: "/cases",
    title: "案例 · rakazo 运营 OS",
    description: "晚棠用同一套运营 OS 接待、建档、推广、收款。",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: "晚棠",
      url: `${CANONICAL_ORIGIN}/cases`,
      author: { "@type": "Organization", name: "rakazo" },
    },
    body: `<h1>案例</h1>
<article><h2>晚棠</h2><p>悉尼。四个人替她接待、建档、推广、收款。公开页在 <a href="https://mrlootbox.com/models/wantang">mrlootbox.com/models/wantang</a>。</p><p><a href="/cases/wantang">看这个案例</a></p></article>`,
  },
  {
    path: "/cases/wantang",
    title: "晚棠 · rakazo 案例",
    description: "晚棠的公开页在 mrlootbox.com/models/wantang。付款前客人只看到她本人。",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: "晚棠",
      url: `${CANONICAL_ORIGIN}/cases/wantang`,
      author: { "@type": "Organization", name: "rakazo" },
    },
    body: `<h1>晚棠</h1>
<p>付款前，客人只跟她说话。接待起草，她点发送。档案记下时间、地点和信誉。推广写「本周五晚有空档」，发出前等她确认。收款核对户名晚棠，她点已收款，客人转到私域。</p>
<p>公开页：<a href="https://mrlootbox.com/models/wantang">mrlootbox.com/models/wantang</a></p>`,
  },
  {
    path: "/blog",
    title: "博客 · rakazo 运营 OS",
    description: "你睡觉，工作台还醒着。",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Blog",
      name: "rakazo",
      url: `${CANONICAL_ORIGIN}/blog`,
    },
    body: `<h1>博客</h1>
<article><h2>你睡觉，工作台还醒着</h2><p>四个角色把今晚的活走完，该她拍板的停在最上面。</p><p><a href="/blog/while-you-sleep">读这篇</a></p></article>`,
  },
  {
    path: "/blog/while-you-sleep",
    title: "你睡觉，工作台还醒着 · rakazo",
    description: "接待、档案、推广、收款各自往前走。要她拍板的，停在决策卡上。",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: "你睡觉，工作台还醒着",
      datePublished: "2026-11-07",
      url: `${CANONICAL_ORIGIN}/blog/while-you-sleep`,
      author: { "@type": "Organization", name: "rakazo" },
    },
    body: `<h1>你睡觉，工作台还醒着</h1>
<p>接待先写草稿。常规档期可以一键发。砍价、定金、犹豫留给她。档案把客人记成一张卡片。推广把「本周五晚有空档」放到她面前。收款只在她确认到账之后，才把客人转进私域。</p>
<p>这篇说的是演示里的晚棠，不是一笔真实订单。</p>`,
  },
];

const byPath = new Map(publicPages.map((page) => [page.path, page]));

export function renderPublicHtml(path: string): string | null {
  const page = byPath.get(path);
  if (!page) return null;
  return pageShell(page);
}

export function renderRobots(): string {
  return `User-agent: *\nDisallow: /studio\n\nSitemap: ${CANONICAL_ORIGIN}/sitemap.xml\n`;
}

export function renderSitemap(): string {
  const urls = publicPages
    .map(
      (page) => `  <url><loc>${CANONICAL_ORIGIN}${page.path === "/" ? "/" : page.path}</loc></url>`,
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

export function renderOgSvg(): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
<rect width="1200" height="630" fill="#04040c"/>
<text x="80" y="300" fill="#fafaf9" font-family="Poppins, sans-serif" font-size="72" font-weight="600">rakazo</text>
<text x="80" y="380" fill="#a8a29e" font-family="Poppins, sans-serif" font-size="32">一个名字，干完所有活。</text>
</svg>`;
}

export const STUDIO_ROBOTS = "noindex, nofollow";

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

const PUBLIC_CSS = `
:root { color-scheme: dark; }
* { box-sizing: border-box; }
body { margin: 0; background: #04040c; color: #fafaf9; font-family: Poppins, "Noto Sans SC", "PingFang SC", sans-serif; font-weight: 500; }
.bar { position: sticky; top: 0; display: flex; justify-content: space-between; gap: 16px; align-items: center; padding: 16px; border-bottom: 1px solid #3a3a3a; background: #04040c; }
.brand { color: #fafaf9; font-weight: 600; text-decoration: none; }
nav { display: flex; gap: 16px; }
nav a, .lead, li { color: #a8a29e; }
a { color: #00a68f; }
main { max-width: 1760px; margin: 0 auto; padding: 40px 16px 80px; }
h1 { font-size: 24px; font-weight: 600; margin: 0 0 12px; }
.go { display: inline-flex; align-items: center; height: 40px; padding: 0 16px; border-radius: 8px; background: #00a68f; color: #fafaf9; text-decoration: none; font-weight: 600; font-size: 14px; }
.en { color: #a8a29e; }
@media (min-width: 1024px) { main { padding: 80px 56px; } .bar { padding: 16px 56px; } }
`;
