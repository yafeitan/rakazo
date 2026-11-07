import type { ProfileDraft } from "../domain";
import { templateBio } from "../domain";

type Env = Record<string, string | undefined>;

/**
 * Uses the deployment's local OpenAI-compatible model when RAKAZO_LOCAL_MODELS
 * is set (the same switch as the rest of the product). Otherwise a fixed template.
 */
export async function generateProfileCopy(
  draft: ProfileDraft,
  options: { fetcher?: typeof fetch; env?: Env } = {},
): Promise<{ bio: string; source: "model" | "template" }> {
  const fallback = { bio: templateBio(draft), source: "template" as const };
  const env = options.env ?? process.env;
  const model = (env.RAKAZO_LOCAL_MODELS ?? "")
    .split(",")
    .map((item) => item.trim())
    .find(Boolean);
  const base = env.RAKAZO_LOCAL_MODELS_URL?.trim();
  if (!model || !base) return fallback;
  try {
    const endpoint = new URL("chat/completions", base.endsWith("/") ? base : `${base}/`);
    const fetcher = options.fetcher ?? fetch;
    const response = await fetcher(endpoint, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        model,
        temperature: 0.4,
        messages: [
          {
            role: "system",
            content:
              "你为澳洲独立模特写一段克制、私人的主页简介。用中文，80到140字。不要写价格，不要写露骨内容，不要出现“援交”，不要写成经纪公司口吻。联系方式在确认收款后才开放，这句话可以保留。",
          },
          {
            role: "user",
            content: JSON.stringify({
              stageName: draft.stageName,
              city: draft.city,
              languages: draft.languages,
              services: draft.services,
              availability: draft.availability,
            }),
          },
        ],
      }),
    });
    if (!response.ok) return fallback;
    const payload = (await response.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const text = payload.choices?.[0]?.message?.content?.trim().slice(0, 800) ?? "";
    if (!text || text.includes("援交")) return fallback;
    return { bio: text, source: "model" };
  } catch {
    return fallback;
  }
}
