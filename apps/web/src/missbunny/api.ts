import type { Assessment, OrderView, ProfileDraft, PublicProfile, Session } from "./domain";

export type ModelChoice = {
  id: string;
  stageName: string;
  city: string;
  engineStarted: boolean;
  published: boolean;
};

export type ShellInfo = {
  session: Session;
  models: ModelChoice[];
};

export type PaymentMethodView = {
  id: string;
  kind: "payid" | "bank";
  label: string;
  accountName: string;
  reference: string;
};

const KEY = "missbunny.demo.token";

function remember(token: unknown) {
  if (typeof token === "string" && token) localStorage.setItem(KEY, token);
}

export async function call<T extends object>(
  op: string,
  payload: Record<string, unknown> = {},
): Promise<T & { shell: ShellInfo }> {
  const token = localStorage.getItem(KEY);
  const response = await fetch("/api/missbunny", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...(token ? { "x-missbunny-token": token } : {}),
    },
    body: JSON.stringify({ op, ...payload }),
  });
  const body = (await response.json()) as T & { shell: ShellInfo; token?: string; error?: string };
  remember(body.token);
  if (!response.ok) throw new Error(body.error || "没有完成");
  return body;
}

export type EngineEvent = {
  type: string;
  text?: string;
  assessment?: Assessment;
  shell?: ShellInfo;
};

export async function streamEngine(
  draft: ProfileDraft,
  onEvent: (event: EngineEvent) => void,
  signal: AbortSignal,
): Promise<void> {
  const token = localStorage.getItem(KEY);
  const response = await fetch("/api/missbunny", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...(token ? { "x-missbunny-token": token } : {}),
    },
    body: JSON.stringify({ op: "engine.start", draft }),
    signal,
  });
  if (!response.ok || !response.body) {
    const failed = (await response.json().catch(() => null)) as {
      error?: string;
      token?: string;
    } | null;
    remember(failed?.token);
    throw new Error(failed?.error || "引擎没有开始");
  }
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const blocks = buffer.split("\n\n");
    buffer = blocks.pop() ?? "";
    for (const block of blocks) {
      const line = block.split("\n").find((item) => item.startsWith("data:"));
      if (!line) continue;
      const event = JSON.parse(line.slice(5).trim()) as EngineEvent & { token?: string };
      remember(event.token);
      onEvent(event);
    }
  }
}

export type { Assessment, OrderView, ProfileDraft, PublicProfile, Session };
