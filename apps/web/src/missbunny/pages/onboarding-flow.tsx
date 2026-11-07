import { Button } from "@rakazo/ui-web";
import { useState } from "react";
import type { Copy } from "../copy";
import { useLocale } from "../locale";
import type { OnboardingBinds } from "../onboarding";
import { missingOnboarding, onboardingReady } from "../onboarding";

const EMPTY: OnboardingBinds = { selfRun: false, x: false, ivy: false };

function missingLabel(item: string, copy: Copy): string {
  if (item === "自运营") return copy.chooseSelfRun;
  if (item === "X") return copy.missingX;
  if (item === "IVY") return copy.missingIvy;
  return item;
}

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
        onClick={() => setState((current) => ({ ...current, selfRun: true }))}
      >
        {copy.selfRun}
      </button>
      <div className="flex flex-col gap-2">
        <Button
          type="button"
          variant="outline"
          aria-pressed={state.x}
          onClick={() => setState((current) => ({ ...current, x: !current.x }))}
        >
          {state.x ? copy.connectedX : copy.connectX}
        </Button>
        <Button
          type="button"
          variant="outline"
          aria-pressed={state.ivy}
          onClick={() => setState((current) => ({ ...current, ivy: !current.ivy }))}
        >
          {state.ivy ? copy.connectedIvy : copy.connectIvy}
        </Button>
      </div>
      {missing.length > 0 ? (
        <ul role="status" className="flex flex-col gap-1 text-muted-foreground">
          {missing.map((item) => (
            <li key={item}>{missingLabel(item, copy)}</li>
          ))}
        </ul>
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
