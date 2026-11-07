import { Button, Input, Label } from "@rakazo/ui-web";
import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { PaymentMethodView, PublicProfile } from "../api";
import { call } from "../api";
import { BOOKING_SLOTS } from "../domain";
import { useDemo } from "../shell";

type Checkout = {
  profile: PublicProfile;
  needsInvite: boolean;
  methods: PaymentMethodView[];
};

export function BookPage() {
  const { slug = "" } = useParams();
  const navigate = useNavigate();
  const { apply } = useDemo();
  const [checkout, setCheckout] = useState<Checkout | null>(null);
  const [code, setCode] = useState("");
  const [slot, setSlot] = useState<string>(BOOKING_SLOTS[0] ?? "");
  const [methodId, setMethodId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    let active = true;
    void call<Checkout>("checkout", { slug })
      .then((body) => {
        if (!active) return;
        apply(body.shell);
        setCheckout(body);
        setMethodId(body.methods[0]?.id ?? "");
      })
      .catch((reason: unknown) => {
        if (active) setError(reason instanceof Error ? reason.message : "找不到主页");
      });
    return () => {
      active = false;
    };
  }, [apply, slug]);

  async function verify(event: FormEvent) {
    event.preventDefault();
    setPending(true);
    setError(null);
    try {
      const body = await call("verifyInvite", { code });
      apply(body.shell);
      const next = await call<Checkout>("checkout", { slug });
      apply(next.shell);
      setCheckout(next);
      setMethodId(next.methods[0]?.id ?? "");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "邀请码不正确");
    } finally {
      setPending(false);
    }
  }

  async function book(event: FormEvent) {
    event.preventDefault();
    setPending(true);
    setError(null);
    try {
      const body = await call<{ order: { id: string } }>("createOrder", {
        slug,
        startsAt: slot,
        paymentMethodId: methodId,
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
  const selected = checkout.methods.find((method) => method.id === methodId);

  return (
    <div className="mx-auto flex w-full max-w-md flex-col pt-6">
      <h1 className="text-heading3 font-medium">预约 {checkout.profile.stageName}</h1>
      {checkout.needsInvite ? (
        <form onSubmit={(event) => void verify(event)} className="mt-8 flex flex-col">
          <Label htmlFor="invite">邀请码</Label>
          <Input
            id="invite"
            value={code}
            autoComplete="off"
            placeholder="MB-DEMO"
            onChange={(event) => setCode(event.target.value)}
            className="mt-2 h-12 rounded-xl px-4 text-[16px]/6 md:text-body-lg"
          />
          {error ? <p className="mt-3 text-destructive">{error}</p> : null}
          <Button
            type="submit"
            size="xl"
            className="mt-4 w-full"
            disabled={pending || !code.trim()}
          >
            继续
          </Button>
        </form>
      ) : (
        <form onSubmit={(event) => void book(event)} className="mt-8 flex flex-col gap-6">
          <fieldset>
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
          <fieldset>
            <legend className="text-label text-muted-foreground">收款方式</legend>
            <div className="mt-2 flex flex-col gap-2">
              {checkout.methods.map((method) => (
                <button
                  key={method.id}
                  type="button"
                  aria-pressed={methodId === method.id}
                  className="rounded-xl px-4 py-3 text-left ring-1 ring-foreground/10 aria-pressed:ring-2 aria-pressed:ring-foreground"
                  onClick={() => setMethodId(method.id)}
                >
                  {method.label}
                </button>
              ))}
            </div>
            {selected ? (
              <p className="mt-3 text-muted-foreground">
                {selected.accountName} · {selected.reference}
              </p>
            ) : null}
          </fieldset>
          {error ? <p className="text-destructive">{error}</p> : null}
          <Button type="submit" size="xl" disabled={pending || !methodId}>
            生成订单
          </Button>
        </form>
      )}
    </div>
  );
}
