import { Button, Disclosure, Input, Label } from "@rakazo/ui-web";
import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import type { OrderView } from "../api";
import { call } from "../api";
import { useDemo } from "../shell";

const CHANNELS = [
  ["wechat", "微信"],
  ["telegram", "Telegram"],
  ["whatsapp", "WhatsApp"],
  ["sms", "短信"],
] as const;

export function OrdersPage() {
  const { apply } = useDemo();
  const [orders, setOrders] = useState<OrderView[]>([]);

  useEffect(() => {
    let active = true;
    void call<{ orders: OrderView[] }>("orders").then((body) => {
      if (!active) return;
      apply(body.shell);
      setOrders(body.orders);
    });
    return () => {
      active = false;
    };
  }, [apply]);

  if (orders.length === 0) return <p className="pt-8 text-muted-foreground">还没有预约</p>;

  return (
    <ul className="flex flex-col gap-2 pt-4">
      {orders.map((order) => (
        <li key={order.id}>
          <Link
            to={`/bookings/${order.id}`}
            className="flex items-center justify-between gap-3 rounded-xl px-4 py-3 ring-1 ring-foreground/10"
          >
            <span>
              {order.stageName}
              <span className="mt-0.5 block text-muted-foreground">{order.startsAt}</span>
            </span>
            <span className="text-muted-foreground">{order.statusLabel}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function OrderPage() {
  const { id = "" } = useParams();
  const { apply, shell } = useDemo();
  const [order, setOrder] = useState<OrderView | null>(null);
  const [note, setNote] = useState("");
  const [screenshot, setScreenshot] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  function take(body: { shell: typeof shell; order: OrderView | null }) {
    apply(body.shell);
    setOrder(body.order);
  }

  useEffect(() => {
    let active = true;
    void call<{ order: OrderView }>("order", { id })
      .then((body) => {
        if (!active) return;
        take(body);
      })
      .catch((reason: unknown) => {
        if (active) setError(reason instanceof Error ? reason.message : "找不到订单");
      });
    return () => {
      active = false;
    };
  }, [apply, id]);

  async function act(op: string, extra: Record<string, unknown> = {}) {
    setPending(true);
    setError(null);
    try {
      const body = await call<{ order: OrderView }>(op, { id, ...extra });
      take(body);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "没有完成");
    } finally {
      setPending(false);
    }
  }

  async function pay(event: FormEvent) {
    event.preventDefault();
    await act("pay", { note, screenshotAttached: screenshot });
  }

  if (error && !order) return <p className="pt-8 text-destructive">{error}</p>;
  if (!order) return null;
  const guest = shell.session.role === "user";

  return (
    <article className="mx-auto flex w-full max-w-md flex-col gap-6 pt-6">
      <header>
        <p className="text-label text-muted-foreground">{order.statusLabel}</p>
        <h1 className="mt-2 text-heading3 font-medium">
          {order.stageName} · {order.startsAt}
        </h1>
      </header>
      {order.payment ? (
        <p>
          {order.payment.label}
          <span className="mt-1 block text-muted-foreground">
            {order.payment.accountName} · {order.payment.reference}
          </span>
        </p>
      ) : null}
      {order.status === "PENDING_PAYMENT" && guest ? (
        <form onSubmit={(event) => void pay(event)} className="flex flex-col gap-4">
          <div>
            <Label htmlFor="note">备注</Label>
            <Input
              id="note"
              value={note}
              onChange={(event) => setNote(event.target.value)}
              className="mt-2 h-12 rounded-xl px-4 text-[16px]/6 md:text-body-lg"
            />
          </div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={screenshot}
              onChange={(event) => setScreenshot(event.target.checked)}
            />
            附上截图
          </label>
          <Button type="submit" size="xl" disabled={pending}>
            我已付款
          </Button>
        </form>
      ) : null}
      {order.status === "AWAITING_MODEL_CONFIRM" ? (
        <p className="text-muted-foreground">等待她确认到账。</p>
      ) : null}
      {order.contacts ? (
        <section>
          <h2 className="text-body-lg font-medium">她确认收款了</h2>
          <ul className="mt-3 flex flex-col gap-2">
            {CHANNELS.map(([key, label]) =>
              order.contacts?.[key] ? (
                <li key={key} className="flex justify-between gap-3">
                  <span className="text-muted-foreground">{label}</span>
                  <span>{order.contacts[key]}</span>
                </li>
              ) : null,
            )}
          </ul>
        </section>
      ) : null}
      {error ? <p className="text-destructive">{error}</p> : null}
      <Disclosure summary={<span className="text-muted-foreground">记录</span>}>
        <ul className="mt-3 flex flex-col gap-2 text-muted-foreground">
          {order.audits.map((entry) => (
            <li key={entry.id}>{entry.action}</li>
          ))}
        </ul>
      </Disclosure>
      {order.status === "PENDING_PAYMENT" && guest ? (
        <Disclosure summary={<span className="text-muted-foreground">演示</span>}>
          <Button
            type="button"
            variant="text"
            className="mt-3"
            disabled={pending}
            onClick={() => void act("timeout")}
          >
            模拟超时
          </Button>
        </Disclosure>
      ) : null}
    </article>
  );
}
