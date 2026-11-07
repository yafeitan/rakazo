import { Button, buttonVariants, Input, Label, SectionHeading, Switch } from "@rakazo/ui-web";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import type { Assessment, OrderView } from "../api";
import { call } from "../api";
import { formatAud } from "../domain";
import { useLocale } from "../locale";
import { useDemo } from "../shell";
import { AhaPlay } from "./aha";
import { CreditTopUp } from "./top-up";

type Ledger = { days: { date: string; amount: number }[]; total: number; today: number };

type InquiryView = {
  id: string;
  guestName: string;
  question: string;
  draft: string;
  needsConfirm: boolean;
  status: string;
  label: string;
};

type Pricing = {
  token: number;
  tokenLow: number;
  tokenHigh: number;
  monthly: number;
  recentIncome: number;
};

type Dashboard = {
  assessment: Assessment;
  ledger: Ledger;
  pricing: Pricing;
  heldLabel: string;
  depositAmount: number;
  badge: string;
  engineLog: { id: string; text: string }[];
  inquiries: InquiryView[];
  awaiting: OrderView[];
  recent: OrderView[];
  stageName: string;
  engineStarted: boolean;
};

function Bars({ days }: { days: Ledger["days"] }) {
  const max = Math.max(1, ...days.map((day) => day.amount));
  return (
    <div className="flex h-32 items-end gap-2" aria-hidden>
      {days.map((day) => (
        <div key={day.date} className="flex min-w-0 flex-1 flex-col items-center gap-2">
          <div className="flex h-24 w-full items-end">
            <div
              className={
                day.amount
                  ? "mx-auto w-full max-w-6 rounded-sm bg-foreground"
                  : "mx-auto h-2 w-full max-w-6 rounded-sm bg-muted"
              }
              style={
                day.amount ? { height: `${Math.max(8, (day.amount / max) * 100)}%` } : undefined
              }
            />
          </div>
          <span className="text-label text-muted-foreground">{day.date.slice(5)}</span>
        </div>
      ))}
    </div>
  );
}

export function DashboardPage() {
  const { shell, apply } = useDemo();
  const { lang, copy } = useLocale();
  const [params] = useSearchParams();
  const [data, setData] = useState<Dashboard | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [amount, setAmount] = useState<string | null>(null);

  useEffect(() => {
    if (shell.session.role !== "model") return;
    let active = true;
    void call<Dashboard>("dashboard", { lang })
      .then((body) => {
        if (!active) return;
        apply(body.shell);
        setData(body);
      })
      .catch((reason: unknown) => {
        if (active) setError(reason instanceof Error ? reason.message : copy.notFinished);
      });
    return () => {
      active = false;
    };
  }, [apply, copy.notFinished, lang, shell.session.modelId, shell.session.role]);

  async function saveDeposit(next: number) {
    setPending(true);
    setError(null);
    try {
      const body = await call<Dashboard>("setDeposit", { amount: next, lang });
      apply(body.shell);
      setData(body);
      setAmount(null);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : copy.notFinished);
    } finally {
      setPending(false);
    }
  }

  async function lead(op: string, id: string) {
    setPending(true);
    setError(null);
    try {
      const body = await call<Dashboard>(op, { id, lang });
      apply(body.shell);
      setData(body);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : copy.notFinished);
    } finally {
      setPending(false);
    }
  }

  async function act(op: string, id: string) {
    setPending(true);
    setError(null);
    try {
      const body = await call(op, { id });
      apply(body.shell);
      const next = await call<Dashboard>("dashboard", { lang });
      apply(next.shell);
      setData(next);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : copy.notFinished);
    } finally {
      setPending(false);
    }
  }

  if (shell.session.role !== "model") {
    return <p className="pt-8 text-muted-foreground">{copy.switchToModel}</p>;
  }
  if (params.get("aha") === "1") return <AhaPlay />;
  if (!data) return error ? <p className="pt-8 text-destructive">{error}</p> : null;

  if (!data.engineStarted) {
    return (
      <div className="mx-auto flex w-full max-w-md flex-col gap-4 pt-6">
        <h1 className="text-heading3 font-medium">{data.stageName || copy.newProfile}</h1>
        <p>
          {copy.readiness} {data.assessment.score}
        </p>
        <ul className="flex flex-col gap-1">
          {data.assessment.gaps.map((gap) => (
            <li key={gap.id}>{gap.suggestion}</li>
          ))}
        </ul>
        <p className="text-muted-foreground">{copy.followSteps}</p>
        <Link to="/studio" className={`${buttonVariants({ size: "lg" })} w-fit`}>
          {copy.finishProfile}
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10 pt-4">
      <header>
        <p className="text-label text-muted-foreground">{copy.engineRunning}</p>
        <h1 className="mt-2 text-heading3 font-medium">{data.stageName}</h1>
      </header>
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-4">
          <div>
            <SectionHeading as="h2">{copy.deposit}</SectionHeading>
            <p className="mt-1 text-muted-foreground">
              {data.depositAmount > 0
                ? copy.depositOn(formatAud(data.depositAmount))
                : copy.phoneOnly}
            </p>
          </div>
          <Switch
            checked={data.depositAmount > 0}
            aria-label={copy.requireDeposit}
            disabled={pending}
            onCheckedChange={(checked) => void saveDeposit(checked ? data.depositAmount || 100 : 0)}
          />
        </div>
        {data.depositAmount > 0 ? (
          <form
            className="flex items-end gap-3"
            onSubmit={(event) => {
              event.preventDefault();
              void saveDeposit(Number(amount ?? data.depositAmount));
            }}
          >
            <div className="flex-1">
              <Label htmlFor="deposit">{copy.amount}</Label>
              <Input
                id="deposit"
                inputMode="numeric"
                value={amount ?? String(data.depositAmount)}
                onChange={(event) => setAmount(event.target.value)}
                className="mt-2 h-12 rounded-xl px-4 text-[16px]/6 md:text-body-lg"
              />
            </div>
            <Button type="submit" variant="outline" disabled={pending}>
              {copy.save}
            </Button>
          </form>
        ) : null}
      </section>
      <section className="flex flex-col gap-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <SectionHeading as="h2">{copy.incomeToday}</SectionHeading>
            <p className="mt-2 text-display font-medium tracking-tight">
              {formatAud(data.ledger.today)}
            </p>
          </div>
          <p className="text-label text-muted-foreground">{copy.demoLedger}</p>
        </div>
        <Bars days={data.ledger.days} />
        <div className="flex items-end justify-between gap-4">
          <div>
            <SectionHeading as="h2">{copy.monthlyFee}</SectionHeading>
            <p className="mt-2 text-body-lg font-medium">{formatAud(data.pricing.monthly)}</p>
          </div>
          <p className="text-right text-muted-foreground">
            {copy.recentIncome(formatAud(data.pricing.recentIncome))}
            <span className="mt-1 block text-label">{copy.usageBand}</span>
          </p>
        </div>
        <CreditTopUp />
        {data.heldLabel ? (
          <p className="text-muted-foreground">{copy.held(data.heldLabel)}</p>
        ) : null}
      </section>
      <section className="flex flex-col gap-3">
        <SectionHeading as="h2">{copy.today}</SectionHeading>
        <p className="text-label text-muted-foreground">{data.badge}</p>
        {data.engineLog.length > 0 ? (
          <ul className="flex flex-col gap-2 text-muted-foreground">
            {data.engineLog.map((entry) => (
              <li key={entry.id}>{entry.text}</li>
            ))}
          </ul>
        ) : null}
        {data.inquiries.map((inquiry) => (
          <div
            key={inquiry.id}
            className="flex flex-col gap-2 rounded-xl px-4 py-4 ring-1 ring-foreground/10"
          >
            <div className="flex items-baseline justify-between gap-3">
              <span className="font-medium">{inquiry.guestName}</span>
              <span className="text-muted-foreground">{inquiry.label}</span>
            </div>
            <p>{inquiry.question}</p>
            {inquiry.draft ? <p className="text-muted-foreground">{inquiry.draft}</p> : null}
            {inquiry.status === "drafted" ? (
              <Button
                type="button"
                variant="outline"
                disabled={pending}
                onClick={() => void lead("bookLead", inquiry.id)}
              >
                {copy.handOff}
              </Button>
            ) : null}
            {inquiry.status === "needs_model" ? (
              <Button
                type="button"
                variant="outline"
                disabled={pending}
                onClick={() => void lead("acknowledge", inquiry.id)}
              >
                {copy.illConfirm}
              </Button>
            ) : null}
            {inquiry.status === "handed_off" ? (
              <Button
                type="button"
                variant="outline"
                disabled={pending}
                onClick={() => void lead("bookLead", inquiry.id)}
              >
                {copy.handOff}
              </Button>
            ) : null}
          </div>
        ))}
      </section>
      <section className="flex flex-col gap-3">
        <SectionHeading as="h2">{copy.waiting}</SectionHeading>
        {data.awaiting.length === 0 ? (
          <p className="text-muted-foreground">{copy.noneWaiting}</p>
        ) : null}
        {data.awaiting.map((order, index) => (
          <div
            key={order.id}
            className="flex flex-col gap-3 rounded-xl px-4 py-4 ring-1 ring-foreground/10"
          >
            <div className="flex items-baseline justify-between gap-3">
              <span className="font-medium">{order.startsAt}</span>
              <span className="text-muted-foreground">{order.paymentLabel}</span>
            </div>
            {order.note ? <p className="text-muted-foreground">{order.note}</p> : null}
            <div className="flex items-center gap-4">
              <Button
                type="button"
                variant={index === 0 ? "default" : "outline"}
                disabled={pending}
                onClick={() => void act("confirm", order.id)}
              >
                {copy.confirmReceived}
              </Button>
              <Button
                type="button"
                variant="text"
                disabled={pending}
                onClick={() => void act("dispute", order.id)}
              >
                {copy.notReceived}
              </Button>
            </div>
          </div>
        ))}
      </section>
      <section className="flex flex-col gap-2">
        <SectionHeading as="h2">{copy.recentBookings}</SectionHeading>
        {data.recent.length === 0 ? <p className="text-muted-foreground">{copy.noneYet}</p> : null}
        <ul className="flex flex-col">
          {data.recent.map((order) => (
            <li key={order.id} className="flex items-center justify-between gap-3 py-3">
              <span>
                {order.startsAt}
                <span className="ml-3 text-muted-foreground">{order.statusLabel}</span>
              </span>
              {order.status === "CONFIRMED" ? (
                <Button
                  type="button"
                  variant="text"
                  disabled={pending}
                  onClick={() => void act("complete", order.id)}
                >
                  {copy.markComplete}
                </Button>
              ) : null}
            </li>
          ))}
        </ul>
      </section>
      {error ? <p className="text-destructive">{error}</p> : null}
    </div>
  );
}
