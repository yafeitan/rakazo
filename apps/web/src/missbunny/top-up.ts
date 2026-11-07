export const TOP_UP_PRESETS = [50, 100, 200, 400] as const;
export const TOP_UP_MIN = 50;

/** A whole-dollar top-up of at least A$50. Anything else cannot be paid. */
export function topUpAmount(selection: number | "other", custom: string): number | null {
  if (selection !== "other") return selection >= TOP_UP_MIN ? selection : null;
  const trimmed = custom.trim();
  if (!/^\d+$/.test(trimmed)) return null;
  const amount = Number(trimmed);
  return amount >= TOP_UP_MIN ? amount : null;
}
