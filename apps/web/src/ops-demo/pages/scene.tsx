import { useState } from "react";
import { Link } from "react-router-dom";
import type { AgentId } from "../domain";
import { agentName, formatAud, statusLabel, timelineSeed, tx } from "../domain";
import { useLang, useTo } from "../locale";
import { Metrics } from "../shell";
import { useDemo } from "../state";
import { Decisions, Feed, openDrafts, TaskList } from "../widgets";

export function Scene() {
  const [lang] = useLang();
  const to = useTo();
  const demo = useDemo();
  const agents = demo.agentView(lang);
  const [tab, setTab] = useState<AgentId>("reception");
  const open = openDrafts(demo.drafts);
  const done = demo.drafts.filter((draft) => draft.state === "done");
  return (
    <main className="page stack">
      <div className="row" style={{ justifyContent: "space-between" }}>
        <h1>{tx(lang, "晚棠", "Wantang")}</h1>
        <Link to={to("/studio")}>{tx(lang, "返回总览", "Back to overview")}</Link>
      </div>
      <div className="summary">
        <span>
          {tx(lang, "待确认", "To confirm")} <span className="mono">{demo.pending}</span>
        </span>
        <span className="mono">{formatAud(demo.collectedCents)}</span>
        <span className="mono">{demo.points}</span>
        <button type="button" className="btn ghost" onClick={() => demo.setTopUpOpen(true)}>
          {tx(lang, "充值", "Top up")}
        </button>
      </div>
      <div className="tabs" role="tablist">
        {agents.map((agent) => (
          <button
            key={agent.id}
            type="button"
            role="tab"
            aria-selected={tab === agent.id}
            className={tab === agent.id ? "on" : ""}
            onClick={() => setTab(agent.id)}
          >
            {agentName(agent.id, lang)}
            {agent.badge > 0 ? <span className="badge mono">{agent.badge}</span> : null}
          </button>
        ))}
      </div>
      <div className="desk">
        <div className="agents stack">
          {agents.map((agent) => (
            <article key={agent.id} className={tab === agent.id ? "agent on" : "agent"}>
              <button type="button" onClick={() => setTab(agent.id)}>
                <span className={`dot ${agent.status}`} /> {agentName(agent.id, lang)}
                <div className="muted">{statusLabel(agent.status, lang)}</div>
                <div>{agent.line}</div>
              </button>
            </article>
          ))}
        </div>
        <div className="stack">
          <Decisions lang={lang} items={open} />
          {demo.paymentPending ? (
            <button type="button" className="btn pri" onClick={() => demo.confirmReceived(lang)}>
              {tx(lang, "已收款", "Payment received")}
            </button>
          ) : null}
          {demo.walkInUnlocked && demo.walkIn ? (
            <div className="unlock stack">
              <strong>{tx(lang, "已解锁，转她私域", "Unlocked. Her private channels.")}</strong>
              <span>
                {demo.walkIn.when} · {demo.walkIn.place}
              </span>
              <span>{tx(lang, "见面两小时前再看一眼。", "Look again two hours before.")}</span>
            </div>
          ) : null}
          <ul className="timeline">
            {timelineSeed(lang).map((line) => (
              <li key={line}>{line}</li>
            ))}
            {done.map((draft) => (
              <li key={draft.id}>
                {draft.guestId ? (
                  <Link to={to(`/app/chat/${draft.guestId}`)}>{draft.body}</Link>
                ) : (
                  draft.body
                )}
              </li>
            ))}
            {(["jason", "ajie", "leo", "tom"] as const).map((id) => (
              <li key={id}>
                <Link to={to(`/app/chat/${id}`)}>{guestLabel(id, lang)}</Link>
              </li>
            ))}
          </ul>
          <Feed lang={lang} />
        </div>
        <aside className="rail stack">
          <div className="desk-metrics">
            <Metrics lang={lang} onTopUp />
          </div>
          <TaskList lang={lang} />
        </aside>
      </div>
    </main>
  );
}

function guestLabel(id: string, lang: "zh" | "en"): string {
  if (id === "jason") return "Jason";
  if (id === "ajie") return tx(lang, "阿杰", "Ajie");
  if (id === "leo") return "Leo";
  if (id === "tom") return "Tom";
  return id;
}
