import { Input, Label } from "@rakazo/ui-web";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { call } from "../api";
import { useLocale } from "../locale";
import type { WorkspaceDraft } from "../onboarding";
import { EMPTY_WORKSPACE, missingWorkspace, WORKSPACE_KEY, workspaceReady } from "../onboarding";
import { useDemoOptional } from "../shell";

const fieldClass = "mt-2 h-12 rounded-xl px-4 text-[16px]/6 md:text-body-lg";

export function OnboardingFlow() {
  const navigate = useNavigate();
  const demo = useDemoOptional();
  const { lang, copy } = useLocale();
  const [draft, setDraft] = useState<WorkspaceDraft>(EMPTY_WORKSPACE);
  const [failed, setFailed] = useState(false);
  const started = useRef(false);
  const missing = missingWorkspace(draft);

  function patch(partial: Partial<WorkspaceDraft>) {
    setFailed(false);
    setDraft((current) => ({ ...current, ...partial }));
  }

  useEffect(() => {
    if (!workspaceReady(draft) || started.current) return;
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

  const fields: { key: keyof WorkspaceDraft; label: string }[] = [
    { key: "stageName", label: copy.fieldName },
    { key: "city", label: copy.fieldCity },
    { key: "availability", label: copy.fieldWhen },
    { key: "services", label: copy.fieldServices },
    { key: "payment", label: copy.fieldPay },
  ];

  return (
    <section className="flex flex-col gap-4 text-left">
      <div>
        <h2 className="text-[1.75rem] font-medium leading-tight tracking-tight">{copy.join}</h2>
        <p className="mt-3 text-body-lg text-muted-foreground">{copy.joinReason}</p>
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
      {missing.length > 0 ? (
        <p role="status" className="text-muted-foreground">
          {copy.stillNeed(
            missing
              .map((key) => fields.find((field) => field.key === key)?.label ?? key)
              .join(lang === "en" ? ", " : "、"),
          )}
        </p>
      ) : (
        <p role="status" className="text-muted-foreground">
          {copy.openingDesk}
        </p>
      )}
      {failed ? <p className="text-destructive">{copy.notFinished}</p> : null}
    </section>
  );
}
