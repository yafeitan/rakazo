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
} from "@rakazo/ui-web";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { call } from "../api";
import { formatAud } from "../domain";
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

type FeedItem = { id: string; text: string };

export function OpsPage() {
  const { shell, apply } = useDemo();
  const { lang, copy } = useLocale();
  const saved = useMemo(() => readWorkspace(lang), [lang]);
  const draft = saved ?? SEEDED[lang];
  const [feed, setFeed] = useState<FeedItem[]>([]);
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
  const guestShown = useRef(false);
  const steps = copy.workSteps;
  const current = steps[index] ?? steps[0] ?? "";

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
    const typing = window.setInterval(() => setTyped((count) => count + 1), 40);
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
      window.clearInterval(typing);
      window.clearInterval(ticking);
      window.clearTimeout(advance);
    };
  }, [index, loop, steps]);

  useEffect(() => {
    if (guestShown.current || index < 4) return;
    guestShown.current = true;
    setFeed((currentFeed) => [
      ...currentFeed,
      { id: "guest", text: copy.guestAsk },
      { id: "reply", text: copy.agentReply(draft) },
    ]);
  }, [copy, draft, index]);

  useEffect(() => {
    if (index >= 5) setOrderReady(true);
  }, [index]);

  function log(text: string) {
    setFeed((current) => [...current, { id: `${text}-${current.length}`, text }]);
    setToday((current) => [...current, text]);
    setUsed((count) => count + 1);
    setNotice(text);
    setEditing(null);
  }

  function receive() {
    if (paid) return;
    setPaid(true);
    setFeed((current) => [...current, { id: "paid", text: copy.ahaLedger }]);
    setToday((current) => [...current, copy.depositRecorded]);
    setUsed((count) => count + 1);
  }

  const publicUrl = publicProfileUrl("wantang", lang);
  const shown = current.slice(0, typed);

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
      <section className="flex flex-col gap-3">
        <SectionHeading as="h2">{copy.feed}</SectionHeading>
        <ul className="flex flex-col gap-2">
          {feed.map((item) => (
            <li key={item.id} className="rounded-xl px-4 py-3 ring-1 ring-foreground/10">
              {item.text}
            </li>
          ))}
        </ul>
        {orderReady ? (
          <div className="flex flex-col gap-3 rounded-xl px-4 py-4 ring-1 ring-foreground/10">
            <p>{paid ? copy.ahaConfirmed : copy.ahaPending}</p>
            <p className="text-muted-foreground">
              {paid ? copy.ahaContact : copy.ahaContactHidden}
            </p>
            {paid ? null : (
              <Button type="button" onClick={receive}>
                {copy.ahaReceived}
              </Button>
            )}
          </div>
        ) : null}
      </section>
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
