import { Button } from "@rakazo/ui-web";
import { useEffect, useState } from "react";
import { useLocale } from "../locale";

const REPLY_MS = 1200;
const ORDER_MS = 2400;

export function AhaPlay() {
  const { copy } = useLocale();
  const [step, setStep] = useState(0);
  const [paid, setPaid] = useState(false);

  useEffect(() => {
    const reply = window.setTimeout(() => setStep(1), REPLY_MS);
    const order = window.setTimeout(() => setStep(2), ORDER_MS);
    return () => {
      window.clearTimeout(reply);
      window.clearTimeout(order);
    };
  }, []);

  const label = paid ? copy.ahaContactOpen : copy.ahaSteps[step];

  return (
    <div className="flex flex-col gap-6 pt-4">
      <header>
        <h1 className="text-heading3 font-medium">{copy.desk}</h1>
        <p className="mt-2 text-muted-foreground" role="status">
          {label}
        </p>
      </header>
      <ol className="flex flex-col gap-1 text-muted-foreground">
        {copy.ahaSteps.slice(0, step + 1).map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ol>
      <article className="rounded-xl px-4 py-4 ring-1 ring-foreground/10">
        <p>{copy.ahaGuest}</p>
      </article>
      {step >= 1 ? (
        <article className="rounded-xl px-4 py-4 ring-1 ring-foreground/10">
          <p>{copy.ahaReply}</p>
        </article>
      ) : null}
      {step >= 2 ? (
        <section className="flex flex-col gap-3">
          <p>{paid ? copy.ahaConfirmed : copy.ahaPending}</p>
          <p className="text-muted-foreground">{paid ? copy.ahaContact : copy.ahaContactHidden}</p>
          {paid ? <p>{copy.ahaLedger}</p> : null}
          {paid ? null : (
            <Button type="button" onClick={() => setPaid(true)}>
              {copy.ahaReceived}
            </Button>
          )}
        </section>
      ) : null}
    </div>
  );
}
