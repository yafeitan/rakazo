import type { IncomingMessage, ServerResponse } from "node:http";
import { opsApp } from "./app";

const OPS_FALLBACK = "/api/missbunny";

async function readBody(req: IncomingMessage): Promise<Buffer | undefined> {
  if (req.method === "GET" || req.method === "HEAD") return undefined;
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

/** Vercel Node function. Mock reads only. */
export default async function handler(req: IncomingMessage, res: ServerResponse) {
  const host = req.headers.host ?? "localhost";
  const protoHeader = req.headers["x-forwarded-proto"];
  const proto = Array.isArray(protoHeader) ? protoHeader[0] : protoHeader || "https";
  const url = `${proto}://${host}${req.url ?? OPS_FALLBACK}`;
  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers)) {
    if (typeof value === "string") headers.set(key, value);
    else if (Array.isArray(value)) headers.set(key, value.join(", "));
  }
  const method = req.method ?? "GET";
  const body = await readBody(req);
  const response = await opsApp.fetch(
    new Request(url, {
      method,
      headers,
      body: body && body.length > 0 ? new Uint8Array(body) : undefined,
    }),
  );
  res.statusCode = response.status;
  response.headers.forEach((value, key) => {
    res.setHeader(key, value);
  });
  res.end(Buffer.from(await response.arrayBuffer()));
}
