import { completeLocalChat } from "@rakazo/adapters/pi-local-chat";
import type { ProfileDraft } from "../domain";
import { templateBio } from "../domain";

type Env = Record<string, string | undefined>;

/**
 * Asks the shared local model connection for a profile, and uses a fixed template when that
 * connection is absent or the request fails.
 */
export async function generateProfileCopy(
  draft: ProfileDraft,
  options: { fetcher?: typeof fetch; env?: Env } = {},
): Promise<{ bio: string; source: "model" | "template" }> {
  const fallback = { bio: templateBio(draft), source: "template" as const };
  try {
    const text = await completeLocalChat(
      [
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
      { env: options.env, fetch: options.fetcher },
    );
    if (!text || text.includes("援交")) return fallback;
    return { bio: text.slice(0, 800), source: "model" };
  } catch {
    return fallback;
  }
}
