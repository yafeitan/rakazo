export type OnboardingBinds = {
  selfRun: boolean;
  x: boolean;
  ivy: boolean;
};

/** What still blocks 入驻. X and IVY are both required. */
export function missingOnboarding(state: OnboardingBinds): string[] {
  const missing: string[] = [];
  if (!state.selfRun) missing.push("自运营");
  if (!state.x) missing.push("X");
  if (!state.ivy) missing.push("IVY");
  return missing;
}

export function onboardingReady(state: OnboardingBinds): boolean {
  return missingOnboarding(state).length === 0;
}
