import { Button, Input, Label } from "@rakazo/ui-web";
import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { PaymentMethodView, PublicProfile } from "../api";
import { call } from "../api";
import { BOOKING_SLOTS, formatAud } from "../domain";
import { useDemo } from "../shell";

type Checkout = {
  profile: PublicProfile;
  depositAmount: number;
  payid: PaymentMethodView | null;
};

const fieldClass = "mt-2 h-12 rounded-xl px-4 text-[16px]/6 md:text-body-lg";

export function BookPage() {
  const { slug = "" } = useParams();
  const navigate = useNavigate();
  const { apply } = useDemo();
  const [checkout, setCheckout] = useState<Checkout | null>(null);
  const [phone, setPhone] = useState("");
  const [slot, setSlot] = useState<string>(BOOKING_SLOTS[0] ?? "");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    let active = true;
    void call<Checkout>("checkout", { slug })
      .then((body) => {
        if (!active) return;
        apply(body.shell);
        setCheckout(body);
      })
      .catch((reason: unknown) => {
        if (active) setError(reason instanceof Error ? reason.message : "找不到主页");
      });
    return () => {
      active = false;
    };
  }, [apply, slug]);

  async function book(event: FormEvent) {
    event.preventDefault();
    setPending(true);
    setError(null);
    try {
      const body = await call<{ order: { id: string } }>("createOrder", {
        slug,
        startsAt: slot,
        phone,
      });
      apply(body.shell);
      navigate(`/bookings/${body.order.id}`);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "没有完成");
    } finally {
      setPending(false);
    }
  }

  if (!checkout && !error) return null;
  if (!checkout) return <p className="pt-8 text-destructive">{error}</p>;
  const deposit = checkout.depositAmount > 0;

  return (
    <form
      onSubmit={(event) => void book(event)}
      className="mx-auto flex w-full max-w-md flex-col pt-6"
    >
      <h1 className="text-heading3 font-medium">预约 {checkout.profile.stageName}</h1>
      <p className="mt-2 text-muted-foreground">
        {deposit ? "需要 PayID 订金（演示）" : "留下电话即可预约（演示）"}
      </p>
      <fieldset className="mt-8">
        <legend className="text-label text-muted-foreground">时间</legend>
        <div className="mt-2 flex flex-col gap-2">
          {BOOKING_SLOTS.map((item) => (
            <button
              key={item}
              type="button"
              aria-pressed={slot === item}
              className="rounded-xl px-4 py-3 text-left ring-1 ring-foreground/10 aria-pressed:ring-2 aria-pressed:ring-foreground"
              onClick={() => setSlot(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </fieldset>
      <div className="mt-6">
        <Label htmlFor="phone">电话</Label>
        <Input
          id="phone"
          inputMode="tel"
          autoComplete="tel"
          value={phone}
          placeholder="04xx（演示）"
          onChange={(event) => setPhone(event.target.value)}
          className={fieldClass}
        />
      </div>
      {deposit && checkout.payid ? (
        <p className="mt-6">
          {checkout.payid.label} · {formatAud(checkout.depositAmount)}
          <span className="mt-1 block text-muted-foreground">
            {checkout.payid.accountName} · {checkout.payid.reference}
          </span>
        </p>
      ) : null}
      {error ? <p className="mt-4 text-destructive">{error}</p> : null}
      <Button
        type="submit"
        size="xl"
        className="mt-6"
        disabled={pending || phone.trim().length < 8}
      >
        {deposit ? "生成订单" : "预约"}
      </Button>
    </form>
  );
}
