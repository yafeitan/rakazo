import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import type { Lang } from "./domain";
import { tx } from "./domain";

export function useLang(): [Lang, (next: Lang) => void] {
  const [params, setParams] = useSearchParams();
  const lang: Lang = params.get("lang") === "en" ? "en" : "zh";
  const setLang = (next: Lang) => {
    const copy = new URLSearchParams(params);
    if (next === "en") copy.set("lang", "en");
    else copy.delete("lang");
    setParams(copy, { replace: true });
  };
  return [lang, setLang];
}

export function useTo(): (path: string) => string {
  const [lang] = useLang();
  return (path: string) => (lang === "en" ? `${path}?lang=en` : path);
}

export function usePageTitle(title: string, lang: Lang) {
  useEffect(() => {
    document.title = title;
    document.documentElement.lang = lang === "en" ? "en" : "zh-CN";
  }, [title, lang]);
}

export function LangSwitch() {
  const [lang, setLang] = useLang();
  return (
    <fieldset className="lang">
      <legend className="sr">Language</legend>
      <button type="button" className={lang === "zh" ? "on" : ""} onClick={() => setLang("zh")}>
        中文
      </button>
      <button type="button" className={lang === "en" ? "on" : ""} onClick={() => setLang("en")}>
        EN
      </button>
    </fieldset>
  );
}

export function tagLabel(tag: "可一键发" | "需本人回复", lang: Lang): string {
  if (tag === "可一键发") return tx(lang, "可一键发", "One-tap");
  return tx(lang, "需本人回复", "Needs her reply");
}
