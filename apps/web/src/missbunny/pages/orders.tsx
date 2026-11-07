import { Button, Disclosure, Input, Label } from "@rakazo/ui-web";
import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import type { OrderView } from "../api";
import { call } from "../api";
import { guestMessage } from "../copy";
import { formatAud } from "../domain";
import { useLocale } from "../locale";
import { useDemo } from "../shell";

export function OrdersPage() {
  const { apply } = useDemo();
  const { lang, copy } = useLocale();
  const [orders, setOrders] = useState<OrderView[]>([]);

  useEffect(() => {
    let active = true;
    void call<{ orders: OrderView[] }>("orders", { lang }).then((body) => {
      if (!active) return;
      apply(body.shell);
      setOrders(body.orders);
    });
    return () => {
      active = false;
    };
  }, [apply, lang]);

  if (orders.length === 0) return <p className="pt-8 text-muted-foreground">{copy.noBookings}</p>;

  return (
    <ul className="flex flex-col gap-2 pt-4">
      {orders.map((order) => (
        <li key={order.id}>
          <Link
            to={lang === "en" ? `/bookings/${order.id}?lang=en` : `/bookings/${order.id}`}
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
  const { lang, copy } = useLocale();
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
    void call<{ order: OrderView }>("order", { id, lang })
      .then((body) => {
        if (!active) return;
        take(body);
      })
      .catch((reason: unknown) => {
        if (!active) return;
        const message = reason instanceof Error ? reason.message : copy.orderMissing;
        setError(guestMessage(message, lang));
      });
    return () => {
      active = false;
    };
  }, [apply, copy.orderMissing, id, lang]);

  async function act(op: string, extra: Record<string, unknown> = {}) {
    setPending(true);
    setError(null);
    try {
      const body = await call<{ order: OrderView }>(op, { id, lang, ...extra });
      take(body);
    } catch (reason) {
      const message = reason instanceof Error ? reason.message : copy.notFinished;
      setError(guestMessage(message, lang));
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
      {order.guestPhone ? <p>{copy.guestPhoneLine(order.guestPhone)}</p> : null}
      {order.depositAmount > 0 && order.payment ? (
        <p>
          {copy.depositDue(formatAud(order.depositAmount), order.payment.label)}
          <span className="mt-1 block text-muted-foreground">
            {order.payment.accountName} · {order.payment.reference}
          </span>
        </p>
      ) : (
        <p className="text-muted-foreground">{copy.noDeposit}</p>
      )}
      {order.status === "PENDING_PAYMENT" && guest ? (
        <form onSubmit={(event) => void pay(event)} className="flex flex-col gap-4">
          <div>
            <Label htmlFor="note">{copy.fieldNote}</Label>
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
            {copy.attachShot}
          </label>
          <Button type="submit" size="xl" disabled={pending}>
            {copy.iPaid}
          </Button>
        </form>
      ) : null}
      {order.status === "AWAITING_MODEL_CONFIRM" ? (
        <p className="text-muted-foreground">{copy.waitingConfirm}</p>
      ) : null}
      {order.contacts ? (
        <section>
          <h2 className="text-body-lg font-medium">{copy.contactsReleased}</h2>
          <ul className="mt-3 flex flex-col gap-2">
            {(
              [
                ["wechat", copy.channelWechat],
                ["telegram", "Telegram"],
                ["whatsapp", "WhatsApp"],
                ["sms", copy.channelSms],
              ] as const
            ).map(([key, label]) =>
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
      <Disclosure summary={<span className="text-muted-foreground">{copy.record}</span>}>
        <ul className="mt-3 flex flex-col gap-2 text-muted-foreground">
          {order.audits.map((entry) => (
            <li key={entry.id}>{entry.action}</li>
          ))}
        </ul>
      </Disclosure>
      {order.status === "PENDING_PAYMENT" && guest ? (
        <Disclosure summary={<span className="text-muted-foreground">{copy.demoMenu}</span>}>
          <Button
            type="button"
            variant="text"
            className="mt-3"
            disabled={pending}
            onClick={() => void act("timeout")}
          >
            {copy.simulateTimeout}
          </Button>
        </Disclosure>
      ) : null}
    </article>
  );
}
