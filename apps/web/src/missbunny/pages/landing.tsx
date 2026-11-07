import { buttonVariants } from "@rakazo/ui-web";
import { Link, useNavigate } from "react-router-dom";
import { call } from "../api";
import { useLocale } from "../locale";
import { useDemo } from "../shell";
import { OnboardingFlow } from "./onboarding-flow";

export function DemoPage() {
  const navigate = useNavigate();
  const { apply } = useDemo();
  const { lang, copy } = useLocale();

  async function openEngine() {
    const body = await call("session", { role: "model", modelId: "wantang" });
    apply(body.shell);
    const params = new URLSearchParams(lang === "en" ? "lang=en" : "");
    navigate({ pathname: "/studio/ops", search: params.toString() });
  }

  return (
    <div className="mx-auto flex max-w-xl flex-col items-center pt-10 text-center">
      <h1 className="text-display font-medium tracking-tight">{copy.demoTitle}</h1>
      <p className="mt-4 text-body-lg text-muted-foreground">{copy.demoIntro}</p>
      <ol className="mt-10 w-full space-y-3 text-left text-body">
        {copy.steps.map((step, index) => (
          <li key={step} className="flex gap-3">
            <span className="w-5 shrink-0 text-muted-foreground">{index + 1}</span>
            <span>{step}</span>
          </li>
        ))}
      </ol>
      <Link to="/models" className={`${buttonVariants({ size: "lg" })} mt-10`}>
        {copy.browseAsGuest}
      </Link>
      <div className="mt-4 flex flex-col items-center gap-2">
        <Link to="/models/wantang/book" className={buttonVariants({ variant: "text" })}>
          {copy.wantangDeposit}
        </Link>
        <Link to="/models/chengyue/book" className={buttonVariants({ variant: "text" })}>
          {copy.chengyuePhone}
        </Link>
      </div>
      <button
        type="button"
        className={`${buttonVariants({ variant: "text" })} mt-4`}
        onClick={() => void openEngine()}
      >
        {copy.openEngine}
      </button>
      <div className="mt-16 w-full">
        <OnboardingFlow />
      </div>
    </div>
  );
}
