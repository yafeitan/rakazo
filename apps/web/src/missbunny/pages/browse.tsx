import { Input } from "@rakazo/ui-web";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { PublicProfile } from "../api";
import { call } from "../api";
import { useDemo } from "../shell";

export function BrowsePage() {
  const { apply } = useDemo();
  const [query, setQuery] = useState("");
  const [profiles, setProfiles] = useState<PublicProfile[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const timer = window.setTimeout(() => {
      void call<{ profiles: PublicProfile[] }>("profiles", { q: query })
        .then((body) => {
          if (!active) return;
          apply(body.shell);
          setProfiles(body.profiles);
        })
        .catch((reason: unknown) => {
          if (active) setError(reason instanceof Error ? reason.message : "没有完成");
        });
    }, 200);
    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [apply, query]);

  return (
    <div className="flex flex-col gap-6 pt-4">
      <Input
        aria-label="搜索城市或名字"
        placeholder="城市或名字"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        className="h-12 rounded-xl px-4 text-[16px]/6 md:text-body-lg"
      />
      {error ? <p className="text-body text-destructive">{error}</p> : null}
      {profiles.length === 0 ? (
        <p className="text-body text-muted-foreground">没有匹配的主页</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {profiles.map((profile) => (
            <li key={profile.id}>
              <Link
                to={`/models/${profile.slug}`}
                className="flex flex-col gap-1 rounded-xl bg-card px-4 py-4 ring-1 ring-foreground/10"
              >
                <span className="flex items-baseline justify-between gap-3">
                  <span className="text-body-lg font-medium">{profile.stageName}</span>
                  <span className="text-muted-foreground">{profile.city}</span>
                </span>
                <span className="text-muted-foreground">{profile.languages.join(" · ")}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
