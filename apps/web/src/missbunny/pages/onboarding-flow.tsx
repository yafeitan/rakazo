import { Button } from "@rakazo/ui-web";
import { useState } from "react";
import { useLocale } from "../locale";
import type { OnboardingBinds } from "../onboarding";
import { missingOnboarding, onboardingReady } from "../onboarding";

const EMPTY: OnboardingBinds = { selfRun: false };

export function OnboardingFlow() {
  const { copy } = useLocale();
  const [state, setState] = useState<OnboardingBinds>(EMPTY);
  const [done, setDone] = useState(false);
  const missing = missingOnboarding(state);
  const ready = onboardingReady(state);

  return (
    <section className="flex flex-col gap-5 text-left">
      <div>
        <h2 className="text-[1.75rem] font-medium leading-tight tracking-tight">{copy.join}</h2>
        <p className="mt-3 text-body-lg text-muted-foreground">{copy.joinReason}</p>
      </div>
      <button
        type="button"
        aria-pressed={state.selfRun}
        className="w-fit rounded-xl px-4 py-3 text-left ring-1 ring-foreground/10 aria-pressed:ring-2 aria-pressed:ring-foreground"
        onClick={() => setState({ selfRun: true })}
      >
        {copy.selfRun}
      </button>
      {missing.length > 0 ? (
        <p role="status" className="text-muted-foreground">
          {copy.chooseSelfRun}
        </p>
      ) : null}
      {done ? <p>{copy.joined}</p> : null}
      <Button
        type="button"
        variant="outline"
        disabled={!ready || done}
        onClick={() => setDone(true)}
      >
        {copy.continue}
      </Button>
    </section>
  );
}
