export type PlatformId = "x" | "ivy" | "catch";

export type Binds = Record<PlatformId, boolean>;

export type WorkspaceDraft = {
  stageName: string;
  city: string;
  availability: string;
  services: string;
  payment: string;
  binds: Binds;
};

export const EMPTY_BINDS: Binds = { x: false, ivy: false, catch: false };

export const EMPTY_WORKSPACE: WorkspaceDraft = {
  stageName: "",
  city: "",
  availability: "",
  services: "",
  payment: "",
  binds: EMPTY_BINDS,
};

export const WORKSPACE_KEY = "missbunny.workspace";

const FIELDS: (keyof Omit<WorkspaceDraft, "binds">)[] = [
  "stageName",
  "city",
  "availability",
  "services",
  "payment",
];

export type Market = "zh" | "en";

/** English needs Ivy and X. Chinese needs Catch and X. The other platform stays optional. */
export function requiredPlatforms(market: Market): PlatformId[] {
  return market === "en" ? ["ivy", "x"] : ["catch", "x"];
}

export function optionalPlatforms(market: Market): PlatformId[] {
  return market === "en" ? ["catch"] : ["ivy"];
}

export function missingFields(draft: WorkspaceDraft): (keyof Omit<WorkspaceDraft, "binds">)[] {
  return FIELDS.filter((key) => draft[key].trim().length === 0);
}

export function missingBinds(draft: WorkspaceDraft, market: Market): PlatformId[] {
  return requiredPlatforms(market).filter((id) => !draft.binds[id]);
}

/** The workspace opens only when the profile and the market's platforms are set. */
export function workspaceReady(draft: WorkspaceDraft, market: Market): boolean {
  return missingFields(draft).length === 0 && missingBinds(draft, market).length === 0;
}
