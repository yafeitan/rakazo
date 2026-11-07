import type { ReactNode } from "react";
import { createContext, useCallback, useContext, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import type { Copy, Lang } from "./copy";
import { copy, LANG_STORAGE_KEY } from "./copy";

type LocaleValue = {
  lang: Lang;
  copy: Copy;
  setLang: (lang: Lang) => void;
};

const LocaleContext = createContext<LocaleValue | null>(null);

function storedLang(): Lang {
  if (typeof localStorage === "undefined") return "zh";
  return localStorage.getItem(LANG_STORAGE_KEY) === "en" ? "en" : "zh";
}

export function LangProvider({ children }: { children: ReactNode }) {
  const [params, setParams] = useSearchParams();
  const explicit = params.get("lang");
  const lang: Lang = explicit === "en" || explicit === "zh" ? explicit : storedLang();

  useEffect(() => {
    document.documentElement.lang = lang === "en" ? "en" : "zh-CN";
    if (explicit === "en" || explicit === "zh") {
      localStorage.setItem(LANG_STORAGE_KEY, explicit);
      return;
    }
    if (storedLang() === "en") {
      const next = new URLSearchParams(params);
      next.set("lang", "en");
      setParams(next, { replace: true });
    }
  }, [explicit, lang, params, setParams]);

  const setLang = useCallback(
    (next: Lang) => {
      localStorage.setItem(LANG_STORAGE_KEY, next);
      const updated = new URLSearchParams(params);
      if (next === "zh") updated.delete("lang");
      else updated.set("lang", "en");
      setParams(updated, { replace: true });
    },
    [params, setParams],
  );

  const value = useMemo<LocaleValue>(() => ({ lang, copy: copy[lang], setLang }), [lang, setLang]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): LocaleValue {
  const value = useContext(LocaleContext);
  if (!value) throw new Error("missing locale");
  return value;
}

export function LanguageToggle() {
  const { lang, setLang } = useLocale();
  return (
    <div className="flex items-center gap-2 text-label">
      <button
        type="button"
        aria-pressed={lang === "zh"}
        className={lang === "zh" ? "text-foreground" : "text-muted-foreground"}
        onClick={() => setLang("zh")}
      >
        中文
      </button>
      <span className="text-muted-foreground" aria-hidden>
        /
      </span>
      <button
        type="button"
        aria-pressed={lang === "en"}
        className={lang === "en" ? "text-foreground" : "text-muted-foreground"}
        onClick={() => setLang("en")}
      >
        EN
      </button>
    </div>
  );
}
