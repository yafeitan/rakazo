import { Button, Input, Label } from "@rakazo/ui-web";
import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { PaymentMethodView, PublicProfile } from "../api";
import { call } from "../api";
import { guestMessage, localizeSlot } from "../copy";
import { BOOKING_SLOTS, formatAud } from "../domain";
import { useLocale } from "../locale";
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
  const { lang, copy } = useLocale();
  const [checkout, setCheckout] = useState<Checkout | null>(null);
  const [phone, setPhone] = useState("");
  const [slot, setSlot] = useState<string>(BOOKING_SLOTS[0] ?? "");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    let active = true;
    void call<Checkout>("checkout", { slug, lang })
      .then((body) => {
        if (!active) return;
        apply(body.shell);
        setCheckout(body);
      })
      .catch((reason: unknown) => {
        if (!active) return;
        const message = reason instanceof Error ? reason.message : copy.pageMissing;
        setError(guestMessage(message, lang));
      });
    return () => {
      active = false;
    };
  }, [apply, copy.pageMissing, lang, slug]);

  async function book(event: FormEvent) {
    event.preventDefault();
    setPending(true);
    setError(null);
    try {
      const body = await call<{ order: { id: string } }>("createOrder", {
        slug,
        startsAt: slot,
        phone,
        lang,
      });
      apply(body.shell);
      const search = lang === "en" ? "?lang=en" : "";
      navigate(`/bookings/${body.order.id}${search}`);
    } catch (reason) {
      const message = reason instanceof Error ? reason.message : copy.notFinished;
      setError(guestMessage(message, lang));
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
      <h1 className="text-heading3 font-medium">{copy.bookHeading(checkout.profile.stageName)}</h1>
      <p className="mt-2 text-muted-foreground">
        {deposit ? copy.bookDepositNote : copy.bookPhoneNote}
      </p>
      <fieldset className="mt-8">
        <legend className="text-label text-muted-foreground">{copy.fieldTime}</legend>
        <div className="mt-2 flex flex-col gap-2">
          {BOOKING_SLOTS.map((item) => (
            <button
              key={item}
              type="button"
              aria-pressed={slot === item}
              className="rounded-xl px-4 py-3 text-left ring-1 ring-foreground/10 aria-pressed:ring-2 aria-pressed:ring-foreground"
              onClick={() => setSlot(item)}
            >
              {localizeSlot(item, lang)}
            </button>
          ))}
        </div>
      </fieldset>
      <div className="mt-6">
        <Label htmlFor="phone">{copy.fieldPhone}</Label>
        <Input
          id="phone"
          inputMode="tel"
          autoComplete="tel"
          value={phone}
          placeholder={copy.phonePlaceholder}
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
        {deposit ? copy.createOrderLabel : copy.book}
      </Button>
    </form>
  );
}
