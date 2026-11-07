export type DraftKind = "oneTap" | "needsHer";

export type GuestTurn = {
  id: string;
  kind: DraftKind;
  guest: string;
  draft: string;
};

export type Voice = {
  availability: string;
  services: string;
  payment: string;
};

const HUMAN_DELAY_MIN = 3000;
const HUMAN_DELAY_MAX = 8000;

/** Guest-visible lines. The model’s own screen may name the assistant; this side must not. */
const GUEST_LEAK = /\bai\b|\bbot\b|机器人|人工智能|\bagent\b/i;

export function humanDelay(random: () => number = Math.random): number {
  const span = HUMAN_DELAY_MAX - HUMAN_DELAY_MIN;
  return HUMAN_DELAY_MIN + Math.floor(random() * (span + 1));
}

export function guestTurns(voice: Voice, lang: "zh" | "en"): GuestTurn[] {
  if (lang === "en") {
    return [
      {
        id: "time",
        kind: "oneTap",
        guest: "Are you free now? I’d like to book.",
        draft: `${voice.availability} works. ${voice.services}.`,
      },
      {
        id: "price",
        kind: "oneTap",
        guest: "What do you charge tonight?",
        draft: "Per booking. Let’s lock a time first.",
      },
      {
        id: "hold",
        kind: "needsHer",
        guest: "Can you do less? I’ll think about it.",
        draft: `A$100 by ${voice.payment} first. I’ll send details once it’s there. Can’t go lower.`,
      },
    ];
  }
  return [
    {
      id: "time",
      kind: "oneTap",
      guest: "现在有空吗？想约一次。",
      draft: `${voice.availability}可以。${voice.services}。`,
    },
    {
      id: "price",
      kind: "oneTap",
      guest: "今晚怎么算？",
      draft: "按次。先对一下时间。",
    },
    {
      id: "hold",
      kind: "needsHer",
      guest: "能少一点吗？我再想想。",
      draft: `先${voice.payment}一百。到了再发你。不能再少。`,
    },
  ];
}

export function canSendDraft(input: {
  kind: DraftKind;
  original: string;
  current: string;
  confirmed: boolean;
}): boolean {
  const current = input.current.trim();
  if (!current) return false;
  if (input.kind === "oneTap") return true;
  return input.confirmed || current !== input.original.trim();
}

export function guestCopyLeaks(text: string): boolean {
  return GUEST_LEAK.test(text);
}
