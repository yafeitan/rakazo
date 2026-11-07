import { handleMissbunny } from "../src/missbunny/server/http";

type NodeRequest = {
  method?: string;
  url?: string;
  headers: Record<string, string | string[] | undefined>;
  body?: unknown;
};

type NodeResponse = {
  statusCode: number;
  setHeader: (name: string, value: string) => void;
  end: (body?: string | Buffer) => void;
};

function isRequest(value: unknown): value is Request {
  return typeof Request !== "undefined" && value instanceof Request;
}

async function fromNode(req: NodeRequest): Promise<Request> {
  const hostHeader = req.headers.host;
  const host = Array.isArray(hostHeader) ? hostHeader[0] : hostHeader || "localhost";
  const url = new URL(req.url || "/api/missbunny", `https://${host}`);
  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers)) {
    if (typeof value === "string") headers.set(key, value);
    else if (Array.isArray(value)) headers.set(key, value.join(", "));
  }
  let body: string | undefined;
  if (req.method !== "GET" && req.method !== "HEAD") {
    if (typeof req.body === "string") body = req.body;
    else if (Buffer.isBuffer(req.body)) body = req.body.toString("utf8");
    else if (req.body !== undefined) {
      body = JSON.stringify(req.body);
      if (!headers.has("content-type")) headers.set("content-type", "application/json");
    }
  }
  return new Request(url, { method: req.method, headers, body });
}

async function writeNode(res: NodeResponse, response: Response) {
  res.statusCode = response.status;
  response.headers.forEach((value, key) => {
    res.setHeader(key, value);
  });
  res.end(Buffer.from(await response.arrayBuffer()));
}

export function POST(request: Request): Promise<Response> {
  return handleMissbunny(request);
}

export default async function handler(req: Request | NodeRequest, res?: NodeResponse) {
  try {
    if (isRequest(req) && !res) return handleMissbunny(req);
    const response = await handleMissbunny(await fromNode(req as NodeRequest));
    if (!res) return response;
    await writeNode(res, response);
    return;
  } catch (error) {
    const message = error instanceof Error ? error.message : "failed";
    if (!res) return Response.json({ error: message }, { status: 500 });
    res.statusCode = 500;
    res.setHeader("content-type", "application/json");
    res.end(JSON.stringify({ error: message }));
  }
}
