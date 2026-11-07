import { buttonVariants, SectionHeading } from "@rakazo/ui-web";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import type { PublicProfile } from "../api";
import { call } from "../api";
import { useLocale } from "../locale";
import { useDemo } from "../shell";

export function ProfilePage() {
  const { slug = "" } = useParams();
  const { apply } = useDemo();
  const { lang, copy } = useLocale();
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    void call<{ profile: PublicProfile }>("profile", { slug, lang })
      .then((body) => {
        if (!active) return;
        apply(body.shell);
        setProfile(body.profile);
      })
      .catch((reason: unknown) => {
        if (active) setError(reason instanceof Error ? reason.message : "找不到主页");
      });
    return () => {
      active = false;
    };
  }, [apply, lang, slug]);

  if (error) return <p className="pt-8 text-body text-destructive">{error}</p>;
  if (!profile) return null;

  return (
    <article className="flex flex-col gap-8 pt-4">
      <header>
        <h1 className="text-display font-medium tracking-tight">{profile.stageName}</h1>
        <p className="mt-2 text-body-lg text-muted-foreground">
          {profile.city} · {profile.languages.join(" · ")}
        </p>
      </header>
      <p className="max-w-xl text-body-lg">{profile.bio}</p>
      <section className="flex flex-col gap-2">
        <SectionHeading as="h2">{copy.available}</SectionHeading>
        <p>{profile.availability}</p>
      </section>
      <section className="flex flex-col gap-2">
        <SectionHeading as="h2">{copy.plans}</SectionHeading>
        <p>{profile.services}</p>
      </section>
      {profile.paymentLabels.length > 0 ? (
        <p className="text-muted-foreground">
          {copy.payment} · {profile.paymentLabels.join("、")}
        </p>
      ) : null}
      <Link
        to={`/models/${profile.slug}/book`}
        className={`${buttonVariants({ size: "lg" })} w-fit`}
      >
        {copy.book}
      </Link>
    </article>
  );
}
