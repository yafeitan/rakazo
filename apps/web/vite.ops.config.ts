import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import type { Connect, ViteDevServer } from "vite";
import { defineConfig } from "vite";
import { renderOgSvg, renderPublicHtml, renderRobots, renderSitemap } from "./src/ops-demo/seo";
import { writePublicSite } from "./src/ops-demo/seo-files";
import { opsApp } from "./src/ops-demo/server/app";

const root = path.dirname(fileURLToPath(import.meta.url));
const studioPath = path.join(root, "studio.html");
const outDir = path.join(root, "dist-missbunny");

function pathnameOf(url: string | undefined): string {
  return url?.split("?")[0] ?? "/";
}

function isSpa(pathname: string): boolean {
  return (
    pathname.startsWith("/studio") || pathname.startsWith("/app") || pathname.startsWith("/models")
  );
}

function publicFile(pathname: string): { body: string; type: string } | null {
  if (pathname === "/robots.txt")
    return { body: renderRobots(), type: "text/plain; charset=utf-8" };
  if (pathname === "/sitemap.xml") {
    return { body: renderSitemap(), type: "application/xml; charset=utf-8" };
  }
  if (pathname === "/og.svg") return { body: renderOgSvg(), type: "image/svg+xml" };
  const html = renderPublicHtml(pathname);
  if (!html) return null;
  return { body: html, type: "text/html; charset=utf-8" };
}

async function readIncoming(req: Connect.IncomingMessage): Promise<Uint8Array | undefined> {
  if (req.method === "GET" || req.method === "HEAD") return undefined;
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  const body = Buffer.concat(chunks);
  return body.length > 0 ? new Uint8Array(body) : undefined;
}

function opsMiddleware(server?: ViteDevServer): Connect.NextHandleFunction {
  const studioFile = server ? studioPath : path.join(outDir, "studio.html");
  return (req, res, next) => {
    const pathname = pathnameOf(req.url);
    if (pathname.startsWith("/api/")) {
      void readIncoming(req)
        .then(async (body) => {
          const host = req.headers.host ?? "localhost";
          const headers = new Headers();
          for (const [key, value] of Object.entries(req.headers)) {
            if (typeof value === "string") headers.set(key, value);
            else if (Array.isArray(value)) headers.set(key, value.join(", "));
          }
          const response = await opsApp.fetch(
            new Request(`http://${host}${req.url ?? "/api/missbunny"}`, {
              method: req.method,
              headers,
              body,
            }),
          );
          res.statusCode = response.status;
          response.headers.forEach((value, key) => {
            res.setHeader(key, value);
          });
          res.end(Buffer.from(await response.arrayBuffer()));
        })
        .catch(next);
      return;
    }
    if (req.method !== "GET" && req.method !== "HEAD") {
      next();
      return;
    }
    const file = publicFile(pathname);
    if (file) {
      res.statusCode = 200;
      res.setHeader("content-type", file.type);
      res.end(req.method === "HEAD" ? undefined : file.body);
      return;
    }
    if (!isSpa(pathname)) {
      next();
      return;
    }
    const raw = readFileSync(studioFile, "utf8");
    const send = (html: string) => {
      res.statusCode = 200;
      res.setHeader("content-type", "text/html; charset=utf-8");
      if (pathname.startsWith("/studio") || pathname.startsWith("/app")) {
        res.setHeader("X-Robots-Tag", "noindex, nofollow");
      }
      res.end(req.method === "HEAD" ? undefined : html);
    };
    if (!server) {
      send(raw);
      return;
    }
    void server
      .transformIndexHtml(req.url ?? "/", raw)
      .then(send)
      .catch(next);
  };
}

export default defineConfig({
  appType: "mpa",
  plugins: [
    {
      name: "ops-demo",
      configureServer(server) {
        server.middlewares.use(opsMiddleware(server));
      },
      configurePreviewServer(server) {
        server.middlewares.use(opsMiddleware());
      },
      closeBundle() {
        writePublicSite(outDir);
      },
    },
    react(),
  ],
  build: {
    outDir: "dist-missbunny",
    emptyOutDir: true,
    rollupOptions: { input: studioPath },
  },
  server: { port: 5174, strictPort: true },
  preview: { port: 4174, strictPort: true },
});
