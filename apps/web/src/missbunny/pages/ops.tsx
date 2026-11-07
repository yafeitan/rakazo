import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  SectionHeading,
} from "@rakazo/ui-web";
import { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import { formatAud } from "../domain";
import { useLocale } from "../locale";
import type { WorkspaceDraft } from "../onboarding";
import { WORKSPACE_KEY, workspaceReady } from "../onboarding";
import { publicProfileUrl } from "../public-profile";
import { useDemo } from "../shell";
import { CreditTopUp } from "./top-up";

const fieldClass = "mt-2 h-12 rounded-xl px-4 text-[16px]/6 md:text-body-lg";
const DEPOSIT = 100;

function readWorkspace(lang: "zh" | "en"): WorkspaceDraft | null {
  try {
    const parsed = JSON.parse(sessionStorage.getItem(WORKSPACE_KEY) ?? "") as WorkspaceDraft;
    if (parsed.binds && workspaceReady(parsed, lang)) return parsed;
  } catch {
    // A direct visit without the required platforms stays off this screen.
  }
  return null;
}

type FeedItem = { id: string; text: string };

export function OpsPage() {
  const { shell } = useDemo();
  const { lang, copy } = useLocale();
  const draft = useMemo(() => readWorkspace(lang), [lang]);
  const [feed, setFeed] = useState<FeedItem[]>([]);
  const [today, setToday] = useState<string[]>([]);
  const [orderReady, setOrderReady] = useState(false);
  const [paid, setPaid] = useState(false);
  const [used, setUsed] = useState(0);
  const [editing, setEditing] = useState<"profile" | "schedule" | null>(null);
  const [draftText, setDraftText] = useState("");
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    if (!draft) return;
    const steps: { id: string; text: string; today: string; at: number; order?: boolean }[] = [
      { id: "start", text: copy.startedWork, today: copy.startedWork, at: 300 },
      { id: "guest", text: copy.guestAsk, today: copy.guestArrived, at: 900 },
      { id: "reply", text: copy.agentReply(draft), today: copy.replied, at: 1700 },
      { id: "qualify", text: copy.qualified, today: copy.qualified, at: 2300 },
      {
        id: "ask",
        text: copy.agentDeposit(draft.payment),
        today: copy.askedDeposit,
        at: 2900,
        order: true,
      },
    ];
    const timers = steps.map((step) =>
      window.setTimeout(() => {
        setFeed((current) =>
          current.some((item) => item.id === step.id)
            ? current
            : [...current, { id: step.id, text: step.text }],
        );
        setToday((current) => (current.includes(step.today) ? current : [...current, step.today]));
        setUsed((count) => count + 1);
        if (step.order) setOrderReady(true);
      }, step.at),
    );
    return () => {
      for (const timer of timers) window.clearTimeout(timer);
    };
  }, [copy, draft]);

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

  if (!draft) {
    return <Navigate to={lang === "en" ? "/?lang=en" : "/"} replace />;
  }
  if (shell.session.role !== "model") {
    return <p className="pt-8 text-muted-foreground">{copy.switchToModel}</p>;
  }
  const publicUrl = publicProfileUrl("wantang", lang);

  const collected = paid ? DEPOSIT : 0;
  const pending = orderReady && !paid ? DEPOSIT : 0;

  return (
    <div className="flex flex-col gap-8 pt-4">
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
