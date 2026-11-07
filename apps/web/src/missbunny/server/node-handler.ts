import { handleMissbunny } from "./http";

type NodeRequest = {
  method?: string;
  url?: string;
  headers?: Record<string, string | string[] | undefined>;
  body?: unknown;
};

type NodeResponse = {
  statusCode: number;
  setHeader: (name: string, value: string) => void;
  end: (body?: string | Buffer) => void;
};

function isWebRequest(value: unknown): value is Request {
  return typeof Request !== "undefined" && value instanceof Request;
}

async function fromNode(req: NodeRequest): Promise<Request> {
  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers ?? {})) {
    if (typeof value === "string") headers.set(key, value);
    else if (Array.isArray(value)) headers.set(key, value.join(", "));
  }
  const host = headers.get("host") || "localhost";
  const url = new URL(req.url || "/api/missbunny", `https://${host}`);
  let body: string | undefined;
  if (req.method !== "GET" && req.method !== "HEAD") {
    if (typeof req.body === "string") body = req.body;
    else if (typeof Buffer !== "undefined" && Buffer.isBuffer(req.body)) {
      body = req.body.toString("utf8");
    } else if (req.body !== undefined) {
      body = JSON.stringify(req.body);
      if (!headers.has("content-type")) headers.set("content-type", "application/json");
    }
  }
  return new Request(url, { method: req.method, headers, body });
}

async function send(res: NodeResponse, response: Response) {
  res.statusCode = response.status;
  response.headers.forEach((value, key) => {
    res.setHeader(key, value);
  });
  res.end(Buffer.from(await response.arrayBuffer()));
}

/** The hosted runtime calls this with a Node request and response. */
export default async function handler(req: Request | NodeRequest, res?: NodeResponse) {
  try {
    const response = isWebRequest(req)
      ? await handleMissbunny(req)
      : await handleMissbunny(await fromNode(req));
    if (!res) return response;
    await send(res, response);
    return;
  } catch (error) {
    const message =
      error instanceof Error ? `${error.message}\n${error.stack ?? ""}`.slice(0, 1200) : "failed";
    if (!res) return Response.json({ error: message }, { status: 500 });
    res.statusCode = 500;
    res.setHeader("content-type", "application/json; charset=utf-8");
    res.end(JSON.stringify({ error: message }));
  }
}
