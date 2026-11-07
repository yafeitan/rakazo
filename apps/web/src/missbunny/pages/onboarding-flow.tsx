import { Button } from "@rakazo/ui-web";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { call } from "../api";
import { useLocale } from "../locale";
import type { OnboardingBinds } from "../onboarding";
import { missingOnboarding, onboardingReady } from "../onboarding";
import { useDemoOptional } from "../shell";

const EMPTY: OnboardingBinds = { selfRun: false };

export function OnboardingFlow() {
  const navigate = useNavigate();
  const demo = useDemoOptional();
  const { lang, copy } = useLocale();
  const [state, setState] = useState<OnboardingBinds>(EMPTY);
  const [pending, setPending] = useState(false);
  const [failed, setFailed] = useState(false);
  const missing = missingOnboarding(state);
  const ready = onboardingReady(state);

  async function finish() {
    setPending(true);
    try {
      const body = await call("session", { role: "model", modelId: "wantang" });
      demo?.apply(body.shell);
      const params = new URLSearchParams(lang === "en" ? "lang=en" : "");
      params.set("aha", "1");
      navigate({ pathname: "/studio/dashboard", search: params.toString() });
    } catch {
      setFailed(true);
      setPending(false);
    }
  }

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
      {failed ? <p className="text-destructive">{copy.notFinished}</p> : null}
      <Button
        type="button"
        variant="outline"
        disabled={!ready || pending}
        onClick={() => void finish()}
      >
        {copy.continue}
      </Button>
    </section>
  );
}
