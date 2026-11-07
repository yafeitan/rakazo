import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
} from "@rakazo/ui-web";
import { useState } from "react";
import { formatAud } from "../domain";
import { useLocale } from "../locale";
import { TOP_UP_PRESETS, topUpAmount } from "../top-up";

export function CreditTopUp() {
  const { copy } = useLocale();
  const [open, setOpen] = useState(false);
  const [balance, setBalance] = useState(0);
  const [selection, setSelection] = useState<number | "other">(100);
  const [custom, setCustom] = useState("");
  const [done, setDone] = useState<number | null>(null);
  const amount = topUpAmount(selection, custom);
  const invalidCustom = selection === "other" && amount == null;

  function pay() {
    if (amount == null) return;
    setBalance((current) => current + amount);
    setDone(amount);
  }

  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-label text-muted-foreground">{copy.demoBalance}</p>
        <p className="mt-1 text-body-lg font-medium">{formatAud(balance)}</p>
      </div>
      <Button
        type="button"
        variant="outline"
        onClick={() => {
          setDone(null);
          setOpen(true);
        }}
      >
        {copy.topUp}
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{copy.topUpTitle}</DialogTitle>
          </DialogHeader>
          {done != null ? (
            <div className="flex flex-col gap-4">
              <p>
                {copy.topUpDone} {formatAud(done)}
              </p>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                {copy.topUpClose}
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap gap-2">
                {TOP_UP_PRESETS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    aria-pressed={selection === preset}
                    className="rounded-xl px-3 py-2 ring-1 ring-foreground/10 aria-pressed:ring-2 aria-pressed:ring-foreground"
                    onClick={() => setSelection(preset)}
                  >
                    {formatAud(preset)}
                  </button>
                ))}
                <button
                  type="button"
                  aria-pressed={selection === "other"}
                  className="rounded-xl px-3 py-2 ring-1 ring-foreground/10 aria-pressed:ring-2 aria-pressed:ring-foreground"
                  onClick={() => setSelection("other")}
                >
                  {copy.topUpOther}
                </button>
              </div>
              {selection === "other" ? (
                <div>
                  <Label htmlFor="top-up-custom">{copy.customAmount}</Label>
                  <Input
                    id="top-up-custom"
                    inputMode="numeric"
                    value={custom}
                    aria-invalid={invalidCustom}
                    aria-describedby={invalidCustom ? "top-up-min" : undefined}
                    onChange={(event) => setCustom(event.target.value)}
                    className="mt-2 h-12 rounded-xl px-4 text-[16px]/6 md:text-body-lg"
                  />
                  {invalidCustom ? (
                    <p id="top-up-min" className="mt-2 text-destructive">
                      {copy.topUpMin}
                    </p>
                  ) : null}
                </div>
              ) : null}
              <div className="flex flex-col gap-1 text-muted-foreground">
                <p>
                  {copy.topUpCredit} {amount == null ? "—" : formatAud(amount)}
                </p>
                <p>
                  {copy.topUpDue} {amount == null ? "—" : formatAud(amount)}
                </p>
              </div>
              <Button type="button" disabled={amount == null} onClick={pay}>
                {copy.topUpPay(amount == null ? "—" : formatAud(amount))}
              </Button>
              <p className="text-label text-muted-foreground">{copy.topUpDemo}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
