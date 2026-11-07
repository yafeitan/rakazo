import { useEffect, useRef, useState } from "react";
import type { ActivityEvent } from "./activity";
import type { Draft, Lang, TaskCard, TaskStatus } from "./domain";
import { canSend, tx } from "./domain";
import { tagLabel } from "./locale";
import { useDemo } from "./state";

export function Feed({ lang }: { lang: Lang }) {
  const demo = useDemo();
  const list = useRef<HTMLOListElement>(null);
  useEffect(() => {
    const node = list.current;
    if (node) node.scrollTop = node.scrollHeight;
  }, [demo.feed.length]);
  return (
    <section className="card stack" data-testid="feed">
      <div className="row" style={{ justifyContent: "space-between" }}>
        <h2>{tx(lang, "活动", "Activity")}</h2>
        <div className="row">
          <button type="button" className="btn ghost" onClick={demo.pauseFeed}>
            {tx(lang, "暂停", "Pause")}
          </button>
          <button type="button" className="btn ghost" onClick={demo.resumeFeed}>
            {tx(lang, "继续", "Resume")}
          </button>
          <button type="button" className="btn ghost" onClick={demo.replayFeed}>
            {tx(lang, "重放", "Replay")}
          </button>
        </div>
      </div>
      <ol className="feed-list" ref={list}>
        {demo.feed.map((event) => (
          <li key={event.id}>
            <FeedLine event={event} lang={lang} />
          </li>
        ))}
      </ol>
    </section>
  );
}

function FeedLine({ event, lang }: { event: ActivityEvent; lang: Lang }) {
  const message = lang === "en" ? event.message_en : event.message;
  const step =
    lang === "en"
      ? `step ${event.step}/${event.total_steps}`
      : `第 ${event.step}/${event.total_steps} 步`;
  return (
    <span>
      {lang === "en" ? agentEn(event.agent) : event.agent}
      {" · "}
      {message}
      {" · "}
      {step} <span className="mono muted">{event.ts.slice(11, 19)}</span>
    </span>
  );
}

function agentEn(name: string): string {
  if (name === "接待") return "Reception";
  if (name === "档案") return "Records";
  if (name === "推广") return "Promotion";
  if (name === "收款") return "Payments";
  if (name === "总管") return "Lead";
  return name;
}

export function taskStatusLabel(status: TaskStatus, lang: Lang): string {
  if (lang === "zh") return status;
  if (status === "排队") return "Queued";
  if (status === "执行中") return "Running";
  if (status === "完成") return "Done";
  return "Waiting";
}

export function TaskList({ lang }: { lang: Lang }) {
  const demo = useDemo();
  const [open, setOpen] = useState<string | null>(null);
  const task = demo.tasks.find((item) => item.id === open) ?? null;
  return (
    <section className="stack">
      {demo.tasks.map((item) => (
        <article key={item.id} className="task stack">
          <div className="row" style={{ justifyContent: "space-between" }}>
            <strong>{item.title}</strong>
            <span className="tag">{taskStatusLabel(item.status, lang)}</span>
          </div>
          <span className="mono muted">
            {item.step}/{item.total}
          </span>
          <button type="button" className="btn ghost" onClick={() => setOpen(item.id)}>
            {tx(lang, "打开", "Open")}
          </button>
        </article>
      ))}
      {task ? <TaskDialog lang={lang} task={task} onClose={() => setOpen(null)} /> : null}
    </section>
  );
}

function TaskDialog({ lang, task, onClose }: { lang: Lang; task: TaskCard; onClose: () => void }) {
  const demo = useDemo();
  const [draft, setDraft] = useState(task.output);
  return (
    <div className="modal" role="dialog" aria-modal="true" aria-label={task.title}>
      <div className="card stack">
        <div className="row" style={{ justifyContent: "space-between" }}>
          <h2>{task.title}</h2>
          <span className="tag">{taskStatusLabel(task.status, lang)}</span>
        </div>
        <pre>{task.output}</pre>
        {task.status === "等批" ? (
          <>
            <textarea value={draft} onChange={(event) => setDraft(event.target.value)} rows={3} />
            <div className="row">
              <button
                type="button"
                className="btn pri"
                onClick={() => demo.approveTask(task.id, lang)}
              >
                {tx(lang, "批准", "Approve")}
              </button>
              <button
                type="button"
                className="btn ghost"
                onClick={() => demo.editTask(task.id, draft, lang)}
              >
                {tx(lang, "改一下", "Edit")}
              </button>
            </div>
          </>
        ) : null}
        <button type="button" className="btn ghost" onClick={onClose}>
          {tx(lang, "关闭", "Close")}
        </button>
      </div>
    </div>
  );
}

export function Decisions({ lang, items }: { lang: Lang; items: Draft[] }) {
  return (
    <div className="stack" data-testid="decisions">
      {items.map((draft) => (
        <DecisionCard key={draft.id} draft={draft} lang={lang} />
      ))}
    </div>
  );
}

function DecisionCard({ draft, lang }: { draft: Draft; lang: Lang }) {
  const demo = useDemo();
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(draft.body);
  return (
    <article className="decision stack">
      <span className={draft.tag === "可一键发" ? "tag ready" : "tag hold"}>
        {tagLabel(draft.tag, lang)}
      </span>
      {editing ? (
        <textarea
          value={text}
          rows={3}
          onChange={(event) => {
            setText(event.target.value);
            demo.editDraft(draft.id, event.target.value);
          }}
        />
      ) : (
        <p style={{ margin: 0 }}>{draft.body}</p>
      )}
      <div className="row">
        <button
          type="button"
          className="btn pri"
          disabled={!canSend(draft)}
          onClick={() => demo.sendDraft(draft.id)}
        >
          {tx(lang, "发送", "Send")}
        </button>
        <button
          type="button"
          className="btn ghost"
          onClick={() => {
            setEditing(true);
            demo.editDraft(draft.id, text);
          }}
        >
          {tx(lang, "改一下", "Edit")}
        </button>
        <button type="button" className="btn sec" onClick={() => demo.confirmDraft(draft.id)}>
          {tx(lang, "本人确认", "I'll confirm")}
        </button>
      </div>
    </article>
  );
}

export function openDrafts(drafts: Draft[]): Draft[] {
  return drafts
    .filter((draft) => draft.state === "open")
    .sort((a, b) => Number(b.tag === "需本人回复") - Number(a.tag === "需本人回复"));
}
