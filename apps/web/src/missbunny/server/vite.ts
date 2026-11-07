import type { IncomingMessage } from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { PreviewServer, ViteDevServer } from "vite";

type Handler = (request: Request) => Promise<Response>;

const httpModule = path.join(path.dirname(fileURLToPath(import.meta.url)), "http.ts");

async function toRequest(req: IncomingMessage): Promise<Request> {
  const host = req.headers.host ?? "localhost";
  const url = new URL(req.url ?? "/", `http://${host}`);
  const chunks: Buffer[] = [];
  for await (const chunk of req) chunks.push(Buffer.from(chunk));
  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers)) {
    if (typeof value === "string") headers.set(key, value);
    else if (Array.isArray(value)) headers.set(key, value.join(", "));
  }
  const method = req.method ?? "GET";
  return new Request(url, {
    method,
    headers,
    body: method === "GET" || method === "HEAD" ? undefined : Buffer.concat(chunks),
  });
}

async function loadHandler(server: ViteDevServer | PreviewServer): Promise<Handler> {
  if (!("ssrLoadModule" in server)) throw new Error("demo API needs the dev server");
  const loaded = (await server.ssrLoadModule(httpModule)) as { handleMissbunny: Handler };
  return loaded.handleMissbunny;
}

function attach(server: ViteDevServer | PreviewServer) {
  server.middlewares.use(async (req, res, next) => {
    const pathname = req.url?.split("?")[0];
    if (pathname !== "/api/missbunny") {
      next();
      return;
    }
    try {
      const handleMissbunny = await loadHandler(server);
      const response = await handleMissbunny(await toRequest(req));
      res.statusCode = response.status;
      response.headers.forEach((value, key) => {
        res.setHeader(key, value);
      });
      if (!response.body) {
        res.end();
        return;
      }
      const reader = response.body.getReader();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        res.write(value);
      }
      res.end();
    } catch (error) {
      next(error);
    }
  });
}

/** Serves the demo API from the Vite dev and preview servers. */
export function missbunnyApi() {
  return {
    name: "missbunny-api",
    configureServer: attach,
    configurePreviewServer: attach,
  };
}
