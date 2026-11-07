import { buttonVariants } from "@rakazo/ui-web";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { LanguageToggle, useLocale } from "../locale";
import { OnboardingFlow } from "./onboarding-flow";

export function HomePage() {
  const { copy } = useLocale();

  useEffect(() => {
    document.title = "Miss Bunny OS";
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", copy.metaDescription);
  }, [copy.metaDescription]);

  return (
    <div className="min-h-full bg-background text-foreground">
      <header className="flex items-center justify-between gap-4 px-5 py-5">
        <div>
          <p className="text-body-lg font-medium">Miss Bunny OS</p>
          <p className="text-label text-muted-foreground">{copy.operatingSystem}</p>
        </div>
        <div className="flex items-center gap-4">
          <LanguageToggle />
          <Link to="/demo" className={buttonVariants({ variant: "text" })}>
            {copy.tryDemo}
          </Link>
        </div>
      </header>
      <main className="mx-auto flex w-full max-w-3xl flex-col gap-16 px-5 pb-20 pt-8">
        <section>
          <p className="text-label text-muted-foreground">{copy.kicker}</p>
          <h1 className="mt-4 max-w-xl text-[2.5rem] font-medium leading-tight tracking-tight sm:text-[4rem]">
            {copy.hero}
          </h1>
          <p className="mt-6 max-w-xl text-body-lg font-medium">{copy.priceTagline}</p>
          <p className="mt-2 max-w-xl text-muted-foreground">{copy.priceSupport}</p>
          <p className="mt-6 max-w-md text-body-lg text-muted-foreground">{copy.heroDetail}</p>
          <Link to="/demo" className={`${buttonVariants({ size: "lg" })} mt-8`}>
            {copy.tryDemo}
          </Link>
        </section>
        <section className="flex flex-col gap-10">
          {copy.lines.map(([line, detail]) => (
            <div key={line}>
              <h2 className="max-w-xl text-[1.75rem] font-medium leading-tight tracking-tight">
                {line}
              </h2>
              <p className="mt-2 text-muted-foreground">{detail}</p>
            </div>
          ))}
        </section>
        <OnboardingFlow />
      </main>
      <footer className="px-5 py-8 text-muted-foreground">Miss Bunny OS</footer>
    </div>
  );
}
