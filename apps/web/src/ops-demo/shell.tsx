import { useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { formatAud, tx } from "./domain";
import { LangSwitch, useLang, usePageTitle, useTo } from "./locale";
import { useDemo } from "./state";

const LINKS = [
  ["/studio", "总览", "Overview"],
  ["/studio/bots", "Bots", "Bots"],
  ["/studio/work", "工作", "Work"],
  ["/studio/memory", "记忆", "Memory"],
  ["/studio/tools", "工具", "Tools"],
  ["/studio/settings", "设置", "Settings"],
] as const;

export function Shell() {
  const [lang] = useLang();
  const to = useTo();
  const location = useLocation();
  const demo = useDemo();
  usePageTitle(tx(lang, "rakazo 运营 OS", "rakazo"), lang);
  return (
    <div className="app">
      <header className="topbar">
        <Link className="brand" to={to("/studio")}>
          rakazo
        </Link>
        <nav className="nav" aria-label={tx(lang, "运营", "Operations")}>
          {LINKS.map(([path, zh, en]) => (
            <NavLink
              key={path}
              to={to(path)}
              className={active(location.pathname, path) ? "on" : ""}
              end={path === "/studio"}
            >
              {tx(lang, zh, en)}
            </NavLink>
          ))}
          <NavLink to={to("/app")} className={location.pathname.startsWith("/app") ? "on" : ""}>
            {tx(lang, "晚棠", "Wantang")}
          </NavLink>
        </nav>
        <LangSwitch />
      </header>
      <Outlet />
      {demo.topUpOpen ? <TopUp lang={lang} /> : null}
    </div>
  );
}

function active(pathname: string, path: string): boolean {
  if (path === "/studio") return pathname === "/studio";
  return pathname === path || pathname.startsWith(`${path}/`);
}

function TopUp({ lang }: { lang: "zh" | "en" }) {
  const demo = useDemo();
  const packs = [50, 120, 300];
  const [pick, setPick] = useState(120);
  return (
    <div className="modal" role="dialog" aria-modal="true" aria-label={tx(lang, "充值", "Top up")}>
      <div className="card stack">
        <h2>{tx(lang, "充值", "Top up")}</h2>
        <div className="row">
          {packs.map((pack) => (
            <button
              key={pack}
              type="button"
              className={pick === pack ? "btn pri" : "btn ghost"}
              onClick={() => setPick(pack)}
            >
              <span className="mono">{pack}</span>
            </button>
          ))}
        </div>
        <p className="muted" style={{ margin: 0 }}>
          {tx(lang, "模拟，不会扣款。", "Simulated. Nothing is charged.")}
        </p>
        <div className="row">
          <button
            type="button"
            className="btn pri"
            onClick={() => {
              demo.addPoints(pick);
              demo.setTopUpOpen(false);
            }}
          >
            {tx(lang, "充值", "Top up")}
          </button>
          <button type="button" className="btn ghost" onClick={() => demo.setTopUpOpen(false)}>
            {tx(lang, "关闭", "Close")}
          </button>
        </div>
        <p className="mono muted" style={{ margin: 0 }}>
          {demo.points}
        </p>
      </div>
    </div>
  );
}

export function Metrics({ lang, onTopUp }: { lang: "zh" | "en"; onTopUp?: boolean }) {
  const demo = useDemo();
  return (
    <div className="stack">
      <div className="metrics">
        <div className="metric">
          <span>{tx(lang, "待确认", "To confirm")}</span>
          <strong className="mono">{demo.pending}</strong>
        </div>
        <div className="metric">
          <span>{tx(lang, "本月已收", "Collected this month")}</span>
          <strong className="mono">{formatAud(demo.collectedCents)}</strong>
        </div>
        <div className="metric">
          <span>{tx(lang, "剩余点数", "Points left")}</span>
          <strong className="mono">{demo.points}</strong>
        </div>
      </div>
      {onTopUp ? (
        <button type="button" className="btn pri" onClick={() => demo.setTopUpOpen(true)}>
          {tx(lang, "充值", "Top up")}
        </button>
      ) : null}
    </div>
  );
}
