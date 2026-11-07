import { localBaseUrl, localModelIds } from "./pi-local-provider-id.js";

type ChatMessage = { role: "system" | "user"; content: string };

/**
 * One completion through the same local model server the rest of the product uses.
 * Returns null when no local model is configured. A model list without a URL uses the default base.
 */
export async function completeLocalChat(
  messages: readonly ChatMessage[],
  options: { env?: NodeJS.ProcessEnv; fetch?: typeof fetch } = {},
): Promise<string | null> {
  const env = options.env ?? process.env;
  const model = localModelIds(env)[0];
  if (!model) return null;
  const base = localBaseUrl(env);
  const endpoint = new URL("chat/completions", base.endsWith("/") ? base : `${base}/`);
  const response = await (options.fetch ?? fetch)(endpoint, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ model, temperature: 0.4, messages }),
  });
  if (!response.ok) throw new Error("local model request failed");
  const payload = (await response.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const text = payload.choices?.[0]?.message?.content?.trim() ?? "";
  return text || null;
}
