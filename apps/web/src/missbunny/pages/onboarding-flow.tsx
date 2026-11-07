import { Input, Label } from "@rakazo/ui-web";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { call } from "../api";
import { useLocale } from "../locale";
import type { PlatformId, WorkspaceDraft } from "../onboarding";
import {
  EMPTY_WORKSPACE,
  missingBinds,
  missingFields,
  optionalPlatforms,
  requiredPlatforms,
  WORKSPACE_KEY,
  workspaceReady,
} from "../onboarding";
import { useDemoOptional } from "../shell";

const fieldClass = "mt-2 h-12 rounded-xl px-4 text-[16px]/6 md:text-body-lg";

const BIND_COPY = {
  x: ["bindX", "boundX"],
  ivy: ["bindIvy", "boundIvy"],
  catch: ["bindCatch", "boundCatch"],
} as const;

export function OnboardingFlow() {
  const navigate = useNavigate();
  const demo = useDemoOptional();
  const { lang, copy } = useLocale();
  const [draft, setDraft] = useState<WorkspaceDraft>(EMPTY_WORKSPACE);
  const [failed, setFailed] = useState(false);
  const started = useRef(false);
  const fieldsMissing = missingFields(draft);
  const bindsMissing = missingBinds(draft, lang);

  function patch(partial: Partial<WorkspaceDraft>) {
    setFailed(false);
    setDraft((current) => ({ ...current, ...partial }));
  }

  function bind(id: PlatformId) {
    setFailed(false);
    setDraft((current) => ({ ...current, binds: { ...current.binds, [id]: true } }));
  }

  useEffect(() => {
    if (!workspaceReady(draft, lang) || started.current) return;
    started.current = true;
    const params = new URLSearchParams(lang === "en" ? "lang=en" : "");
    void call("session", { role: "model", modelId: "wantang" })
      .then((body) => {
        sessionStorage.setItem(WORKSPACE_KEY, JSON.stringify(draft));
        demo?.apply(body.shell);
        navigate({ pathname: "/studio/ops", search: params.toString() });
      })
      .catch(() => {
        started.current = false;
        setFailed(true);
      });
  }, [demo, draft, lang, navigate]);

  const fields: { key: keyof Omit<WorkspaceDraft, "binds">; label: string }[] = [
    { key: "stageName", label: copy.fieldName },
    { key: "city", label: copy.fieldCity },
    { key: "availability", label: copy.fieldWhen },
    { key: "services", label: copy.fieldServices },
    { key: "payment", label: copy.fieldPay },
  ];

  function bindButton(id: PlatformId, required: boolean) {
    const [off, on] = BIND_COPY[id];
    const bound = draft.binds[id];
    return (
      <button
        key={id}
        type="button"
        aria-pressed={bound}
        className="rounded-xl px-4 py-3 text-left ring-1 ring-foreground/10 aria-pressed:ring-2 aria-pressed:ring-foreground"
        onClick={() => bind(id)}
      >
        {bound ? copy[on] : copy[off]}
        <span className="ml-2 text-muted-foreground">
          {required ? copy.bindRequired : copy.bindOptional}
        </span>
      </button>
    );
  }

  return (
    <section id="join" className="flex flex-col gap-4 text-left">
      <div>
        <h2 className="text-[1.75rem] font-medium leading-tight tracking-tight">{copy.join}</h2>
        <p className="mt-3 text-body-lg text-muted-foreground">{copy.joinReason}</p>
        <p className="mt-2 text-muted-foreground">{copy.marketRule}</p>
      </div>
      {fields.map((field) => (
        <div key={field.key}>
          <Label htmlFor={field.key}>{field.label}</Label>
          <Input
            id={field.key}
            value={draft[field.key]}
            onChange={(event) => patch({ [field.key]: event.target.value })}
            className={fieldClass}
          />
        </div>
      ))}
      <div className="flex flex-col gap-2">
        {requiredPlatforms(lang).map((id) => bindButton(id, true))}
        {optionalPlatforms(lang).map((id) => bindButton(id, false))}
      </div>
      {fieldsMissing.length > 0 ? (
        <p role="status" className="text-muted-foreground">
          {copy.stillNeed(
            fieldsMissing
              .map((key) => fields.find((field) => field.key === key)?.label ?? key)
              .join(lang === "en" ? ", " : "、"),
          )}
        </p>
      ) : null}
      {bindsMissing.length > 0 ? (
        <p role="status" className="text-muted-foreground">
          {copy.needBind(
            bindsMissing
              .map((id) => id[0]?.toUpperCase() + id.slice(1))
              .join(lang === "en" ? ", " : "、"),
          )}
        </p>
      ) : null}
      {fieldsMissing.length === 0 && bindsMissing.length === 0 ? (
        <p role="status" className="text-muted-foreground">
          {copy.openingDesk}
        </p>
      ) : null}
      {failed ? <p className="text-destructive">{copy.notFinished}</p> : null}
    </section>
  );
}
