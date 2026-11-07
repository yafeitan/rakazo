import { Button, buttonVariants, SectionHeading } from "@rakazo/ui-web";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Assessment, OrderView } from "../api";
import { call } from "../api";
import { formatAud } from "../domain";
import { useDemo } from "../shell";

type Ledger = { days: { date: string; amount: number }[]; total: number; today: number };

type Dashboard = {
  assessment: Assessment;
  ledger: Ledger;
  engineLog: { id: string; text: string }[];
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
  const [data, setData] = useState<Dashboard | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (shell.session.role !== "model") return;
    let active = true;
    void call<Dashboard>("dashboard")
      .then((body) => {
        if (!active) return;
        apply(body.shell);
        setData(body);
      })
      .catch((reason: unknown) => {
        if (active) setError(reason instanceof Error ? reason.message : "没有完成");
      });
    return () => {
      active = false;
    };
  }, [apply, shell.session.modelId, shell.session.role]);

  async function act(op: string, id: string) {
    setPending(true);
    setError(null);
    try {
      const body = await call(op, { id });
      apply(body.shell);
      const next = await call<Dashboard>("dashboard");
      apply(next.shell);
      setData(next);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "没有完成");
    } finally {
      setPending(false);
    }
  }

  if (shell.session.role !== "model") {
    return <p className="pt-8 text-muted-foreground">切换到模特身份</p>;
  }
  if (!data) return error ? <p className="pt-8 text-destructive">{error}</p> : null;

  if (!data.engineStarted) {
    return (
      <div className="mx-auto flex w-full max-w-md flex-col gap-4 pt-6">
        <h1 className="text-heading3 font-medium">{data.stageName || "新的档案"}</h1>
        <p>准备度 {data.assessment.score}</p>
        <ul className="flex flex-col gap-1">
          {data.assessment.gaps.map((gap) => (
            <li key={gap.id}>{gap.suggestion}</li>
          ))}
        </ul>
        <p className="text-muted-foreground">跟着这几步，引擎会替你接住已经邀请的客人。</p>
        <Link to="/studio" className={`${buttonVariants({ size: "lg" })} w-fit`}>
          去完善档案
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10 pt-4">
      <header>
        <p className="text-label text-muted-foreground">引擎运行中</p>
        <h1 className="mt-2 text-heading3 font-medium">{data.stageName}</h1>
      </header>
      <section className="flex flex-col gap-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <SectionHeading as="h2">今日入账</SectionHeading>
            <p className="mt-2 text-display font-medium tracking-tight">
              {formatAud(data.ledger.today)}
            </p>
          </div>
          <p className="text-muted-foreground">
            近七日 {formatAud(data.ledger.total)}
            <span className="mt-1 block text-label">演示账本</span>
          </p>
        </div>
        <Bars days={data.ledger.days} />
      </section>
      <section className="flex flex-col gap-3">
        <SectionHeading as="h2">今日引擎</SectionHeading>
        <ul className="flex flex-col gap-2 text-muted-foreground">
          {data.engineLog.map((entry) => (
            <li key={entry.id}>{entry.text}</li>
          ))}
        </ul>
      </section>
      <section className="flex flex-col gap-3">
        <SectionHeading as="h2">待确认</SectionHeading>
        {data.awaiting.length === 0 ? (
          <p className="text-muted-foreground">没有等待确认的预约</p>
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
                确认到账
              </Button>
              <Button
                type="button"
                variant="text"
                disabled={pending}
                onClick={() => void act("dispute", order.id)}
              >
                未收到
              </Button>
            </div>
          </div>
        ))}
      </section>
      <section className="flex flex-col gap-2">
        <SectionHeading as="h2">最近的预约</SectionHeading>
        {data.recent.length === 0 ? <p className="text-muted-foreground">还没有</p> : null}
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
                  标记完成
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
