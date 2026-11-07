export type OnboardingBinds = {
  selfRun: boolean;
};

/** 入驻 waits only on choosing self-run. A connection is not a gate. */
export function missingOnboarding(state: OnboardingBinds): string[] {
  return state.selfRun ? [] : ["自运营"];
}

export function onboardingReady(state: OnboardingBinds): boolean {
  return missingOnboarding(state).length === 0;
}
