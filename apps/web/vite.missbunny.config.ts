import { copyFileSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import type { Connect, ViteDevServer } from "vite";
import { defineConfig } from "vite";
import { missbunnyApi } from "./src/missbunny/server/vite.ts";

const root = path.dirname(fileURLToPath(import.meta.url));
const htmlPath = path.join(root, "missbunny.html");

function isAppRoute(url: string | undefined): boolean {
  const pathname = url?.split("?")[0] ?? "";
  if (
    !pathname ||
    pathname.startsWith("/api/") ||
    pathname.startsWith("/p/") ||
    pathname.startsWith("/@")
  )
    return false;
  if (pathname.startsWith("/src/") || pathname.startsWith("/node_modules/")) return false;
  return !pathname.split("/").pop()?.includes(".");
}

function htmlFallback(server: ViteDevServer): Connect.NextHandleFunction {
  return (req, res, next) => {
    if (req.method !== "GET" && req.method !== "HEAD") {
      next();
      return;
    }
    if (!isAppRoute(req.url)) {
      next();
      return;
    }
    void server
      .transformIndexHtml(req.url ?? "/", readFileSync(htmlPath, "utf8"))
      .then((html) => {
        res.statusCode = 200;
        res.setHeader("content-type", "text/html; charset=utf-8");
        res.end(html);
      })
      .catch(next);
  };
}

function previewFallback(): Connect.NextHandleFunction {
  const file = path.join(root, "dist-missbunny", "index.html");
  return (req, res, next) => {
    if ((req.method !== "GET" && req.method !== "HEAD") || !isAppRoute(req.url)) {
      next();
      return;
    }
    res.statusCode = 200;
    res.setHeader("content-type", "text/html; charset=utf-8");
    res.end(readFileSync(file));
  };
}

export default defineConfig({
  plugins: [
    {
      name: "missbunny-html",
      configureServer(server) {
        server.middlewares.use(htmlFallback(server));
      },
      configurePreviewServer(server) {
        server.middlewares.use(previewFallback());
      },
      closeBundle() {
        copyFileSync(
          path.join(root, "dist-missbunny", "missbunny.html"),
          path.join(root, "dist-missbunny", "index.html"),
        );
      },
    },
    react(),
    tailwindcss(),
    missbunnyApi(),
  ],
  build: {
    outDir: "dist-missbunny",
    emptyOutDir: true,
    rollupOptions: { input: path.join(root, "missbunny.html") },
  },
  server: { port: 5174, strictPort: true },
  preview: { port: 4174, strictPort: true },
});
