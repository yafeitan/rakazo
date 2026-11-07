import { NativeSelect, NativeSelectOption } from "@rakazo/ui-web";
import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Shimmer } from "../components/ai/primitives";
import type { ShellInfo } from "./api";
import { call } from "./api";

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
  const [shell, setShell] = useState<ShellInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    void call("bootstrap")
      .then((body) => {
        if (active) setShell(body.shell);
      })
      .catch(() => {
        if (active) setError("演示服务没有打开");
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
        <p className="text-body text-destructive">{error}</p>
      </div>
    );
  }
  if (!value) {
    return (
      <div className="grid h-full place-items-center">
        <Shimmer>正在打开</Shimmer>
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
              浏览
            </NavLink>
            {session.role === "user" ? (
              <NavLink
                to="/bookings"
                className={({ isActive }) => (isActive ? "text-foreground" : undefined)}
              >
                预约
              </NavLink>
            ) : (
              <>
                <NavLink
                  to="/studio/dashboard"
                  className={({ isActive }) => (isActive ? "text-foreground" : undefined)}
                >
                  今日
                </NavLink>
                <NavLink
                  to="/studio"
                  end
                  className={({ isActive }) => (isActive ? "text-foreground" : undefined)}
                >
                  档案
                </NavLink>
              </>
            )}
          </nav>
          <div className="ml-auto flex flex-wrap items-center gap-2">
            <NativeSelect
              aria-label="身份"
              value={session.role}
              onChange={(event) => {
                const role = event.target.value === "model" ? "model" : "user";
                void switchRole(role);
              }}
            >
              <NativeSelectOption value="user">客人 · {session.userName}</NativeSelectOption>
              <NativeSelectOption value="model">模特</NativeSelectOption>
            </NativeSelect>
            {session.role === "model" ? (
              <NativeSelect
                aria-label="档案"
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
                <NativeSelectOption value="new">新的档案</NativeSelectOption>
              </NativeSelect>
            ) : null}
          </div>
        </header>
        <main className="mx-auto w-full max-w-3xl flex-1 px-5 pb-16">{children}</main>
      </div>
    </DemoContext.Provider>
  );
}
