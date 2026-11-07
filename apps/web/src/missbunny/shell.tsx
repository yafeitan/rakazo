import { NativeSelect, NativeSelectOption } from "@rakazo/ui-web";
import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Shimmer } from "../components/ai/primitives";
import type { ShellInfo } from "./api";
import { call } from "./api";
import { LanguageToggle, useLocale } from "./locale";

type DemoContextValue = {
  shell: ShellInfo;
  apply: (shell: ShellInfo) => void;
};

const DemoContext = createContext<DemoContextValue | null>(null);

export function useDemo(): DemoContextValue {
  const value = useContext(DemoContext);
  if (!value) throw new Error("missing demo shell");
  return value;
}

function Mark() {
  return (
    <span
      className="flex h-9 w-9 items-center justify-center gap-1 rounded-full bg-muted"
      aria-hidden
    >
      <span className="h-3 w-1 rounded-full bg-primary" />
      <span className="h-3 w-1 rounded-full bg-primary" />
    </span>
  );
}

export function Shell({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const { copy } = useLocale();
  const [shell, setShell] = useState<ShellInfo | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    void call("bootstrap")
      .then((body) => {
        if (active) setShell(body.shell);
      })
      .catch(() => {
        if (active) setError(true);
      });
    return () => {
      active = false;
    };
  }, []);

  const value = useMemo<DemoContextValue | null>(
    () => (shell ? { shell, apply: setShell } : null),
    [shell],
  );

  if (error) {
    return (
      <div className="grid h-full place-items-center px-6 text-center">
        <p className="text-body text-destructive">{copy.serviceClosed}</p>
      </div>
    );
  }
  if (!value) {
    return (
      <div className="grid h-full place-items-center">
        <Shimmer>{copy.opening}</Shimmer>
      </div>
    );
  }

  const { session, models } = value.shell;
  async function switchRole(role: "user" | "model", modelId = session.modelId) {
    const body = await call("session", { role, modelId });
    setShell(body.shell);
    if (role === "model" && (modelId === "new" || modelId === "")) navigate("/studio");
    else if (role === "model") navigate("/studio/dashboard");
    else navigate("/models");
  }

  return (
    <DemoContext.Provider value={value}>
      <div className="flex min-h-full flex-col bg-background text-foreground">
        <header className="flex flex-wrap items-center gap-x-5 gap-y-3 px-5 py-4">
          <Link to="/demo" className="flex items-center gap-3">
            <Mark />
            <span className="text-body-lg font-medium">missbunny</span>
          </Link>
          <nav className="flex items-center gap-4 text-muted-foreground">
            <NavLink
              to="/models"
              className={({ isActive }) => (isActive ? "text-foreground" : undefined)}
            >
              {copy.browse}
            </NavLink>
            {session.role === "user" ? (
              <NavLink
                to="/bookings"
                className={({ isActive }) => (isActive ? "text-foreground" : undefined)}
              >
                {copy.bookings}
              </NavLink>
            ) : (
              <>
                <NavLink
                  to="/studio/dashboard"
                  className={({ isActive }) => (isActive ? "text-foreground" : undefined)}
                >
                  {copy.today}
                </NavLink>
                <NavLink
                  to="/studio"
                  end
                  className={({ isActive }) => (isActive ? "text-foreground" : undefined)}
                >
                  {copy.profile}
                </NavLink>
              </>
            )}
          </nav>
          <div className="ml-auto flex flex-wrap items-center gap-2">
            <LanguageToggle />
            <NativeSelect
              aria-label={copy.role}
              value={session.role}
              onChange={(event) => {
                const role = event.target.value === "model" ? "model" : "user";
                void switchRole(role);
              }}
            >
              <NativeSelectOption value="user">
                {copy.guest} · {session.userName}
              </NativeSelectOption>
              <NativeSelectOption value="model">{copy.model}</NativeSelectOption>
            </NativeSelect>
            {session.role === "model" ? (
              <NativeSelect
                aria-label={copy.whichProfile}
                value={session.modelId || "new"}
                onChange={(event) => {
                  void switchRole("model", event.target.value);
                }}
              >
                {models.map((model) => (
                  <NativeSelectOption key={model.id} value={model.id}>
                    {model.stageName}
                  </NativeSelectOption>
                ))}
                <NativeSelectOption value="new">{copy.newProfile}</NativeSelectOption>
              </NativeSelect>
            ) : null}
          </div>
        </header>
        <main className="mx-auto w-full max-w-3xl flex-1 px-5 pb-16">{children}</main>
      </div>
    </DemoContext.Provider>
  );
}
