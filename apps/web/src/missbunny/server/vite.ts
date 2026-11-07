import type { IncomingMessage, ServerResponse } from "node:http";
import type { Connect, PreviewServer, ViteDevServer } from "vite";
import { handleMissbunny } from "./http";

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

async function handle(req: IncomingMessage, res: ServerResponse, next: Connect.NextFunction) {
  const path = req.url?.split("?")[0];
  if (path !== "/api/missbunny") {
    next();
    return;
  }
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
}

/** Serves the demo API from the Vite dev and preview servers. */
export function missbunnyApi() {
  const attach = (server: ViteDevServer | PreviewServer) => {
    server.middlewares.use(handle);
  };
  return {
    name: "missbunny-api",
    configureServer: attach,
    configurePreviewServer: attach,
  };
}
