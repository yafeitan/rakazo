import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import type {
  DemoBot,
  DemoComputer,
  DemoMemory,
  DemoRoutine,
  DemoSkill,
  DemoTool,
} from "../domain";
import {
  seedComputers,
  seedMemories,
  seedRoutines,
  seedSkills,
  seedTools,
  timelineSeed,
  tx,
} from "../domain";
import { useLang, useTo } from "../locale";
import { createOpsClient } from "../rpc";
import { Metrics } from "../shell";
import { useDemo } from "../state";
import { Decisions, Feed, openDrafts, TaskList } from "../widgets";

export function Overview() {
  const [lang] = useLang();
  const to = useTo();
  const demo = useDemo();
  const agents = demo.agentView(lang);
  return (
    <main className="page stack">
      <h1>{tx(lang, "一个名字，干完所有活。", "One name. The whole shift.")}</h1>
      <p className="lead">
        {tx(lang, "你睡觉时，这四件事还在走。", "It keeps going while you sleep.")}
      </p>
      <div className="stack">
        {agents.map((agent) => (
          <p key={agent.id} style={{ margin: 0 }}>
            {tx(lang, agentName(agent.id), agentName(agent.id, true))}
            {tx(lang, "，", ", ")}
            {agent.line}
          </p>
        ))}
      </div>
      <Metrics lang={lang} />
      <Link className="btn pri" to={to("/app")} style={{ width: "fit-content" }}>
        {tx(lang, "进入晚棠", "Open Wantang")}
      </Link>
      <div className="grid-2">
        <Feed lang={lang} />
        <TaskList lang={lang} />
      </div>
    </main>
  );
}

function agentName(id: string, en = false): string {
  const names: Record<string, [string, string]> = {
    reception: ["接待", "Reception"],
    records: ["档案", "Records"],
    promo: ["推广", "Promotion"],
    payments: ["收款", "Payments"],
  };
  const pair = names[id];
  if (!pair) return id;
  return en ? pair[1] : pair[0];
}

export function Bots() {
  const [lang] = useLang();
  const to = useTo();
  const demo = useDemo();
  const [remote, setRemote] = useState<DemoBot[]>(demo.bots);
  useEffect(() => {
    void createOpsClient()
      .bots.list()
      .then((bots) => setRemote(bots))
      .catch(() => undefined);
  }, []);
  const extras = demo.extraBots.filter((bot) => !remote.some((item) => item.id === bot.id));
  const bots = [...remote, ...extras];
  return (
    <main className="page stack">
      <div className="row" style={{ justifyContent: "space-between" }}>
        <h1>Bots</h1>
        <Link className="btn pri" to={to("/studio/onboarding")}>
          {tx(lang, "新建场景 / 开通新模特", "New scene")}
        </Link>
      </div>
      <div className="grid-2">
        {bots.map((bot) => (
          <Link key={bot.id} className="card stack" to={to(`/studio/bots/${bot.id}`)}>
            <strong>{bot.name}</strong>
            <span className="muted">{bot.role}</span>
            <span>{bot.status}</span>
          </Link>
        ))}
      </div>
    </main>
  );
}

export function BotDetail() {
  const { id = "" } = useParams();
  const [lang] = useLang();
  const to = useTo();
  const demo = useDemo();
  const [bot, setBot] = useState<DemoBot | null>(demo.bots.find((item) => item.id === id) ?? null);
  useEffect(() => {
    void createOpsClient()
      .bots.get({ id })
      .then((found) => {
        if (found) setBot(found);
      })
      .catch(() => undefined);
  }, [id]);
  const local = demo.extraBots.find((item) => item.id === id);
  const shown = local ?? bot;
  if (!shown) {
    return (
      <main className="page">
        <p>{tx(lang, "没有这个 bot。", "No bot with that id.")}</p>
      </main>
    );
  }
  return (
    <main className="page stack">
      <Link to={to("/studio/bots")}>{tx(lang, "返回", "Back")}</Link>
      <h1>{shown.name}</h1>
      <p className="muted" style={{ margin: 0 }}>
        {shown.role}
        {shown.sceneId ? ` · ${shown.sceneId}` : ""}
      </p>
      <p style={{ margin: 0 }}>{shown.description}</p>
      <p className="muted" style={{ margin: 0 }}>
        {shown.modelSummary}
      </p>
      <p style={{ margin: 0 }}>{shown.skillSummary}</p>
      <p>
        {tx(lang, "状态", "Status")} <span className="tag">{shown.status}</span>
      </p>
      {shown.sceneId === "missbunny" ? (
        <Link className="btn ghost" to={to("/app")} style={{ width: "fit-content" }}>
          {tx(lang, "进入晚棠", "Open Wantang")}
        </Link>
      ) : null}
      {local?.status === "等批" ? (
        <button type="button" className="btn pri" onClick={() => demo.approveScene(local.id, lang)}>
          {tx(lang, "批准", "Approve")}
        </button>
      ) : null}
    </main>
  );
}

export function Work() {
  const [lang] = useLang();
  const to = useTo();
  const demo = useDemo();
  const open = openDrafts(demo.drafts);
  const done = demo.drafts.filter((draft) => draft.state === "done");
  return (
    <main className="page stack">
      <h1>{tx(lang, "工作与审批", "Work")}</h1>
      <Decisions lang={lang} items={open} />
      {demo.paymentPending ? (
        <button type="button" className="btn pri" onClick={() => demo.confirmReceived(lang)}>
          {tx(lang, "已收款", "Payment received")}
        </button>
      ) : null}
      <ul className="timeline">
        {timelineSeed(lang).map((line) => (
          <li key={line}>{line}</li>
        ))}
        {done.map((draft) => (
          <li key={draft.id}>{draft.body}</li>
        ))}
      </ul>
      <Link to={to("/app")}>{tx(lang, "晚棠的工作台", "Wantang's desk")}</Link>
    </main>
  );
}

export function Memory() {
  const [lang] = useLang();
  const [memories, setMemories] = useState<DemoMemory[]>(seedMemories);
  const [skills, setSkills] = useState<DemoSkill[]>(seedSkills);
  const [routines, setRoutines] = useState<DemoRoutine[]>(seedRoutines);
  useEffect(() => {
    void createOpsClient()
      .memory()
      .then((data) => {
        setMemories(data.memories);
        setSkills(data.skills);
        setRoutines(data.routines);
      })
      .catch(() => undefined);
  }, []);
  return (
    <main className="page stack">
      <h1>{tx(lang, "记忆", "Memory")}</h1>
      {memories.map((item) => (
        <article key={item.id} className="card">
          <p style={{ margin: 0 }}>{item.text}</p>
          <span className="muted">{item.source}</span>
        </article>
      ))}
      <h2>{tx(lang, "技能", "Skills")}</h2>
      {skills.map((item) => (
        <article key={item.id} className="card">
          <strong>{item.name}</strong>
          <p className="muted" style={{ margin: "4px 0 0" }}>
            {item.summary}
          </p>
        </article>
      ))}
      <h2>{tx(lang, "例程", "Routines")}</h2>
      {routines.map((item) => (
        <article key={item.id} className="card stack">
          <strong>{item.name}</strong>
          <span className="mono">{item.trigger}</span>
          <span className="muted">{item.summary}</span>
          <span className="tag">{tx(lang, "待确认", "Unconfirmed")}</span>
        </article>
      ))}
    </main>
  );
}

export function Tools() {
  const [lang] = useLang();
  const [tools, setTools] = useState<DemoTool[]>(seedTools);
  const [computers, setComputers] = useState<DemoComputer[]>(seedComputers);
  useEffect(() => {
    void createOpsClient()
      .tools()
      .then((data) => {
        setTools(data.tools);
        setComputers(data.computers);
      })
      .catch(() => undefined);
  }, []);
  return (
    <main className="page stack">
      <h1>{tx(lang, "工具", "Tools")}</h1>
      {tools.map((item) => (
        <article key={item.id} className="card row" style={{ justifyContent: "space-between" }}>
          <span>{item.name}</span>
          <span className="muted">
            {item.status} · {tx(lang, "待确认", "Unconfirmed")}
          </span>
        </article>
      ))}
      <h2>{tx(lang, "电脑", "Computers")}</h2>
      {computers.map((item) => (
        <article key={item.id} className="card row" style={{ justifyContent: "space-between" }}>
          <span>{item.name}</span>
          <span className="muted">{item.status}</span>
        </article>
      ))}
    </main>
  );
}

export function Settings() {
  const [lang] = useLang();
  const to = useTo();
  return (
    <main className="page stack">
      <h1>{tx(lang, "设置", "Settings")}</h1>
      <article className="card stack">
        <p style={{ margin: 0 }}>
          {tx(
            lang,
            "定金、砍价、犹豫、发出推广，都要她点头。",
            "Deposits, bargaining, hesitation, and posts wait for her.",
          )}
        </p>
        <p className="muted" style={{ margin: 0 }}>
          {tx(
            lang,
            "模型已配置。具体型号待确认。",
            "A model is configured. Which one is unconfirmed.",
          )}
        </p>
      </article>
      <Link className="btn pri" to={to("/studio/onboarding")} style={{ width: "fit-content" }}>
        {tx(lang, "我的资料与报价", "Profile and prices")}
      </Link>
    </main>
  );
}
