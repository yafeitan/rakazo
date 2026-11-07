import { Button } from "@rakazo/ui-web";
import { useState } from "react";
import type { OnboardingBinds } from "../onboarding";
import { missingOnboarding, onboardingReady } from "../onboarding";

const EMPTY: OnboardingBinds = { selfRun: false, x: false, ivy: false };

export function OnboardingFlow() {
  const [state, setState] = useState<OnboardingBinds>(EMPTY);
  const [done, setDone] = useState(false);
  const missing = missingOnboarding(state);
  const ready = onboardingReady(state);

  return (
    <section className="flex flex-col gap-5 text-left">
      <div>
        <h2 className="text-[1.75rem] font-medium leading-tight tracking-tight">入驻</h2>
        <p className="mt-3 text-body-lg text-muted-foreground">
          搜索流量不够。AI 员工要每天有稳定的询问。不绑定，就没有量。
        </p>
      </div>
      <button
        type="button"
        aria-pressed={state.selfRun}
        className="w-fit rounded-xl px-4 py-3 text-left ring-1 ring-foreground/10 aria-pressed:ring-2 aria-pressed:ring-foreground"
        onClick={() => setState((current) => ({ ...current, selfRun: true }))}
      >
        自运营
      </button>
      <div className="flex flex-col gap-2">
        <Button
          type="button"
          variant="outline"
          aria-pressed={state.x}
          onClick={() => setState((current) => ({ ...current, x: !current.x }))}
        >
          {state.x ? "X 已绑定（演示）" : "绑定 X（演示）"}
        </Button>
        <Button
          type="button"
          variant="outline"
          aria-pressed={state.ivy}
          onClick={() => setState((current) => ({ ...current, ivy: !current.ivy }))}
        >
          {state.ivy ? "IVY 已绑定（演示）" : "绑定 IVY（演示）"}
        </Button>
      </div>
      {missing.length > 0 ? (
        <ul role="status" className="flex flex-col gap-1 text-muted-foreground">
          {missing.map((item) => (
            <li key={item}>{item === "自运营" ? "先选择自运营" : `还没绑定 ${item}`}</li>
          ))}
        </ul>
      ) : null}
      {done ? <p>入驻完成（演示）</p> : null}
      <Button
        type="button"
        variant="outline"
        disabled={!ready || done}
        onClick={() => setDone(true)}
      >
        继续
      </Button>
    </section>
  );
}
