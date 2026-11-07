import { buttonVariants } from "@rakazo/ui-web";
import { Link } from "react-router-dom";
import { useLocale } from "../locale";
import { OnboardingFlow } from "./onboarding-flow";

export function DemoPage() {
  const { lang, copy } = useLocale();
  const search = lang === "en" ? "?lang=en" : "";

  function openEngine() {
    document.getElementById("join")?.scrollIntoView();
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
        <Link to={`/models/wantang/book${search}`} className={buttonVariants({ variant: "text" })}>
          {copy.wantangDeposit}
        </Link>
        <Link to={`/models/chengyue/book${search}`} className={buttonVariants({ variant: "text" })}>
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
