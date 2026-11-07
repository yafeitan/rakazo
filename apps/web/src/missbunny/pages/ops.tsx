import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  SectionHeading,
  Spinner,
  Textarea,
} from "@rakazo/ui-web";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { call } from "../api";
import { formatAud } from "../domain";
import { canSendDraft, guestTurns, humanDelay } from "../guest-desk";
import { useLocale } from "../locale";
import type { WorkspaceDraft } from "../onboarding";
import { WORKSPACE_KEY, workspaceReady } from "../onboarding";
import { publicProfileUrl } from "../public-profile";
import { useDemo } from "../shell";
import { CreditTopUp } from "./top-up";

const fieldClass = "mt-2 h-12 rounded-xl px-4 text-[16px]/6 md:text-body-lg";
const DEPOSIT = 100;

const SEEDED: Record<"zh" | "en", WorkspaceDraft> = {
  zh: {
    stageName: "晚棠",
    city: "墨尔本",
    availability: "周四至周日，傍晚之后",
    services: "私人晚宴",
    payment: "PayID",
    binds: { x: true, ivy: false, catch: true },
  },
  en: {
    stageName: "Wantang",
    city: "Melbourne",
    availability: "Thursday to Sunday, after dusk",
    services: "Private dinners",
    payment: "PayID",
    binds: { x: true, ivy: true, catch: false },
  },
};

function readWorkspace(lang: "zh" | "en"): WorkspaceDraft | null {
  try {
    const parsed = JSON.parse(sessionStorage.getItem(WORKSPACE_KEY) ?? "") as WorkspaceDraft;
    if (parsed.binds && workspaceReady(parsed, lang)) return parsed;
  } catch {
    // A direct visit still runs on the seeded model.
  }
  return null;
}

type GuestLine = { id: string; from: "guest" | "her"; text: string };
type Outbound = { reply: string; follow: { id: string; text: string } | null };

export function OpsPage() {
  const { shell, apply } = useDemo();
  const { lang, copy } = useLocale();
  const saved = useMemo(() => readWorkspace(lang), [lang]);
  const draft = saved ?? SEEDED[lang];
  const turns = useMemo(() => guestTurns(draft, lang), [draft, lang]);
  const [today, setToday] = useState<string[]>([]);
  const [orderReady, setOrderReady] = useState(false);
  const [paid, setPaid] = useState(false);
  const [used, setUsed] = useState(0);
  const [editing, setEditing] = useState<"profile" | "schedule" | null>(null);
  const [draftText, setDraftText] = useState("");
  const [notice, setNotice] = useState<string | null>(null);
  const [index, setIndex] = useState(0);
  const [loop, setLoop] = useState(0);
  const [finished, setFinished] = useState<{ id: string; text: string; at: string }[]>([]);
  const [tick, setTick] = useState(0);
  const [typed, setTyped] = useState(1);
  const [turnIndex, setTurnIndex] = useState(0);
  const [reply, setReply] = useState(turns[0]?.draft ?? "");
  const [editingReply, setEditingReply] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [guestLines, setGuestLines] = useState<GuestLine[]>(() =>
    turns[0] ? [{ id: turns[0].id, from: "guest", text: turns[0].guest }] : [],
  );
  const [typing, setTyping] = useState(false);
  const steps = copy.workSteps;
  const current = steps[index] ?? steps[0] ?? "";
  const turn = turns[turnIndex];
  const queue = useRef<Outbound[]>([]);
  const pumping = useRef(false);
  const alive = useRef(true);
  const replyCount = useRef(0);
  const delayTimer = useRef<number | null>(null);

  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);

  useEffect(() => {
    if (shell.session.role === "model") return;
    let active = true;
    void call("session", { role: "model", modelId: "wantang" }).then((body) => {
      if (active) apply(body.shell);
    });
    return () => {
      active = false;
    };
  }, [apply, shell.session.role]);

  useEffect(() => {
    setTick(0);
    setTyped(1);
    const typingTimer = window.setInterval(() => setTyped((count) => count + 1), 40);
    const ticking = window.setInterval(() => setTick((count) => count + 1), 200);
    const wait = loop === 0 ? 2200 : 4800;
    const advance = window.setTimeout(() => {
      const at = new Date().toLocaleTimeString("en-GB", { hour12: false });
      const text = steps[index] ?? "";
      setFinished((list) => [{ id: `${loop}-${index}`, text, at }, ...list].slice(0, 8));
      setToday((list) => [`${at} ${text}`, ...list].slice(0, 30));
      setUsed((count) => count + 1);
      if (index >= steps.length - 1) {
        setLoop((count) => count + 1);
        setIndex(0);
      } else {
        setIndex((currentIndex) => currentIndex + 1);
      }
    }, wait);
    return () => {
      window.clearInterval(typingTimer);
      window.clearInterval(ticking);
      window.clearTimeout(advance);
    };
  }, [index, loop, steps]);

  useEffect(() => {
    const first = turns[0];
    setTurnIndex(0);
    setReply(first?.draft ?? "");
    setEditingReply(false);
    setConfirmed(false);
    setOrderReady(false);
    setGuestLines(first ? [{ id: first.id, from: "guest", text: first.guest }] : []);
    setTyping(false);
    queue.current = [];
    pumping.current = false;
    if (delayTimer.current != null) window.clearTimeout(delayTimer.current);
    delayTimer.current = null;
  }, [turns]);

  function pump() {
    if (pumping.current) return;
    const item = queue.current.shift();
    if (!item) {
      setTyping(false);
      return;
    }
    pumping.current = true;
    setTyping(true);
    delayTimer.current = window.setTimeout(() => {
      delayTimer.current = null;
      if (!alive.current) return;
      replyCount.current += 1;
      const herId = `her-${replyCount.current}`;
      setGuestLines((lines) => [
        ...lines,
        { id: herId, from: "her", text: item.reply },
        ...(item.follow
          ? [{ id: item.follow.id, from: "guest" as const, text: item.follow.text }]
          : []),
      ]);
      pumping.current = false;
      pump();
    }, humanDelay());
  }

  function sendReply() {
    if (!turn || !canSend) return;
    const next = turns[turnIndex + 1];
    queue.current.push({
      reply: reply.trim(),
      follow: next ? { id: next.id, text: next.guest } : null,
    });
    pump();
    if (next) {
      setTurnIndex(turnIndex + 1);
      setReply(next.draft);
      setConfirmed(false);
      setEditingReply(false);
    } else {
      setTurnIndex(turns.length);
      setOrderReady(true);
    }
  }

  function log(text: string) {
    setToday((currentList) => [...currentList, text]);
    setUsed((count) => count + 1);
    setNotice(text);
    setEditing(null);
  }

  function receive() {
    if (paid) return;
    setPaid(true);
    setToday((currentList) => [...currentList, copy.depositRecorded]);
    setUsed((count) => count + 1);
  }

  const publicUrl = publicProfileUrl("wantang", lang);
  const shown = current.slice(0, typed);
  const canSend = turn
    ? canSendDraft({
        kind: turn.kind,
        original: turn.draft,
        current: reply,
        confirmed,
      })
    : false;
  const collected = paid ? DEPOSIT : 0;
  const pending = orderReady && !paid ? DEPOSIT : 0;

  return (
    <div className="flex flex-col gap-8 pt-4">
      {saved ? null : (
        <p className="text-muted-foreground">
          {copy.seedBanner}{" "}
          <Link to={lang === "en" ? "/?lang=en" : "/"} className="underline">
            {copy.seedLink}
          </Link>
        </p>
      )}
      <section aria-labelledby="working-now" className="flex flex-col gap-3">
        <h2 id="working-now" className="text-heading3 font-medium">
          {copy.workNow}
        </h2>
        <ul className="flex flex-col gap-2">
          <li aria-busy="true" className="flex items-center gap-3">
            <Spinner />
            <span>
              {shown}
              <span className="animate-pulse">|</span>
            </span>
            <span className="text-muted-foreground">{tick}</span>
          </li>
          {finished.map((step) => (
            <li key={step.id} className="flex items-center gap-3 text-muted-foreground">
              <span aria-hidden>✓</span>
              <span>{step.text}</span>
              <time>{step.at}</time>
            </li>
          ))}
        </ul>
      </section>
      {paid ? (
        <section className="flex flex-col gap-2">
          <p>{copy.unlocked}</p>
          <ul className="flex flex-col gap-1 text-muted-foreground">
            <li>{copy.helperWho}</li>
            <li>{draft.availability}</li>
            <li>
              {draft.services} · {draft.payment} · {formatAud(DEPOSIT)}
            </li>
            <li>{copy.paidReminder}</li>
            <li>{copy.ahaLedger}</li>
          </ul>
        </section>
      ) : (
        <>
          {turn ? (
            <article
              className={`flex flex-col gap-3 rounded-xl px-4 py-4 ring-1 ${turn.kind === "needsHer" ? "ring-warning" : "ring-foreground/10"}`}
            >
              <p>{turn.guest}</p>
              {editingReply ? (
                <Textarea
                  aria-label={copy.editDraft}
                  value={reply}
                  onChange={(event) => setReply(event.target.value)}
                />
              ) : (
                <p>{reply}</p>
              )}
              <p className={turn.kind === "needsHer" ? "text-warning" : "text-muted-foreground"}>
                {turn.kind === "needsHer" ? copy.needsHer : copy.oneTap}
              </p>
              <div className="flex flex-wrap gap-2">
                <Button type="button" disabled={!canSend} onClick={sendReply}>
                  {copy.sendReply}
                </Button>
                {editingReply ? null : (
                  <Button type="button" variant="outline" onClick={() => setEditingReply(true)}>
                    {copy.editDraft}
                  </Button>
                )}
                {turn.kind === "needsHer" && !canSend ? (
                  <Button type="button" variant="outline" onClick={() => setConfirmed(true)}>
                    {copy.confirmMine}
                  </Button>
                ) : null}
              </div>
            </article>
          ) : null}
          {orderReady ? (
            <div className="flex flex-col gap-3">
              <p>{copy.ahaPending}</p>
              <p className="text-muted-foreground">{copy.ahaContactHidden}</p>
              <Button type="button" onClick={receive}>
                {copy.ahaReceived}
              </Button>
            </div>
          ) : null}
          <section aria-label={copy.guestSees} className="flex flex-col gap-2">
            <SectionHeading as="h2">{copy.guestSees}</SectionHeading>
            <ul className="flex flex-col gap-2">
              {guestLines.map((line) => (
                <li key={line.id} className="text-muted-foreground">
                  {line.text}
                </li>
              ))}
              {typing ? <li role="status">{copy.typingNow}</li> : null}
            </ul>
          </section>
        </>
      )}
      <header>
        <h1 className="text-heading3 font-medium">{copy.desk}</h1>
        <p className="mt-1 text-muted-foreground">
          {draft.stageName} · {draft.city}
        </p>
        <p className="mt-3">
          <span className="text-muted-foreground">{copy.publicLink}</span>
          <a className="mt-1 block break-all" href={publicUrl}>
            {publicUrl}
          </a>
        </p>
      </header>
      <section className="grid grid-cols-3 gap-3">
        <div>
          <p className="text-label text-muted-foreground">{copy.collected}</p>
          <p className="mt-1 text-body-lg font-medium">{formatAud(collected)}</p>
        </div>
        <div>
          <p className="text-label text-muted-foreground">{copy.pendingDeposits}</p>
          <p className="mt-1 text-body-lg font-medium">{formatAud(pending)}</p>
        </div>
        <div>
          <p className="text-label text-muted-foreground">{copy.usage(used)}</p>
        </div>
      </section>
      <CreditTopUp />
      <section className="flex flex-col gap-2">
        <SectionHeading as="h2">{copy.todayDid}</SectionHeading>
        <ol className="flex flex-col gap-1 text-muted-foreground">
          {today.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
      </section>
      <section className="flex flex-col gap-3">
        {notice ? <p role="status">{notice}</p> : null}
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setDraftText(draft.services);
              setEditing("profile");
            }}
          >
            {copy.updateProfile}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setDraftText(draft.availability);
              setEditing("schedule");
            }}
          >
            {copy.adjustSchedule}
          </Button>
          <Button type="button" variant="outline" onClick={() => log(copy.pushed)}>
            {copy.push}
          </Button>
        </div>
      </section>
      <Dialog open={editing != null} onOpenChange={(open) => setEditing(open ? editing : null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editing === "schedule" ? copy.adjustSchedule : copy.updateProfile}
            </DialogTitle>
          </DialogHeader>
          <Label htmlFor="ops-edit">
            {editing === "schedule" ? copy.fieldWhen : copy.fieldServices}
          </Label>
          <Input
            id="ops-edit"
            value={draftText}
            onChange={(event) => setDraftText(event.target.value)}
            className={fieldClass}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => log(editing === "schedule" ? copy.scheduleSaved : copy.profileSaved)}
          >
            {copy.save}
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
