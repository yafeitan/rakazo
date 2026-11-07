import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { PAYEE_NAME, PAYID_ACCOUNT, PRICE_CENTS, tx, typingDelayMs } from "../domain";
import { LangSwitch, useLang, usePageTitle, useTo } from "../locale";
import { useDemo } from "../state";

const SLOTS = ["周五晚", "周六晚"] as const;
const LENGTHS = ["1小时", "2小时", "过夜"] as const;
const PLACES = ["悉尼", "墨尔本"] as const;

export function Profile() {
  const { slug = "" } = useParams();
  const [lang] = useLang();
  const to = useTo();
  usePageTitle(tx(lang, "晚棠", "Wantang"), lang);
  if (slug !== "wantang") {
    return (
      <GuestFrame>
        <p>{tx(lang, "没有这位。", "Nobody by that name.")}</p>
      </GuestFrame>
    );
  }
  return (
    <GuestFrame>
      <div className="banner" role="img" aria-label={tx(lang, "晚棠", "Wantang")} />
      <h1>晚棠</h1>
      <p className="lead">{tx(lang, "悉尼。周五晚有空。", "Sydney. Friday evening is open.")}</p>
      <p className="mono">mrlootbox.com/models/wantang</p>
      <div className="photos">
        <div className="photo" />
        <div className="photo" />
        <div className="photo" />
      </div>
      <h2>{tx(lang, "价格", "Prices")}</h2>
      <p className="muted">{tx(lang, "示例", "Sample")}</p>
      <ul>
        <li>
          1 {tx(lang, "小时", "hour")} <span className="mono">A$600</span>
        </li>
        <li>
          2 {tx(lang, "小时", "hours")} <span className="mono">A$1,100</span>
        </li>
        <li>
          {tx(lang, "过夜", "Overnight")} <span className="mono">A$2,400</span>
        </li>
      </ul>
      <div className="row">
        <Link className="btn pri" to={to("/models/wantang/book")}>
          {tx(lang, "预约", "Book")}
        </Link>
        <Link className="btn ghost" to={to("/models/wantang/book")}>
          {tx(lang, "咨询", "Ask")}
        </Link>
      </div>
    </GuestFrame>
  );
}

export function Book() {
  const [lang] = useLang();
  const to = useTo();
  const navigate = useNavigate();
  const demo = useDemo();
  usePageTitle(tx(lang, "预约 晚棠", "Book Wantang"), lang);
  const [step, setStep] = useState(0);
  const [when, setWhen] = useState("");
  const [length, setLength] = useState("");
  const [place, setPlace] = useState("");
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(false);
    const delay = typingDelayMs(step === 0 ? "想约哪一天？" : "好");
    const timer = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(timer);
  }, [step]);

  const ask = () => {
    if (!show) return <p className="typing">{tx(lang, "正在输入…", "typing…")}</p>;
    if (step === 0) {
      return (
        <Choice
          prompt={tx(lang, "想约哪一天？", "Which evening?")}
          options={SLOTS.map((slot) =>
            tx(lang, slot, slot === "周五晚" ? "Friday evening" : "Saturday evening"),
          )}
          values={[...SLOTS]}
          onPick={(value) => {
            setWhen(value);
            setStep(1);
          }}
        />
      );
    }
    if (step === 1) {
      return (
        <Choice
          prompt={tx(lang, "多久？", "How long?")}
          options={LENGTHS.map((item) =>
            tx(
              lang,
              item,
              item === "1小时" ? "1 hour" : item === "2小时" ? "2 hours" : "Overnight",
            ),
          )}
          values={[...LENGTHS]}
          onPick={(value) => {
            setLength(value);
            setStep(2);
          }}
        />
      );
    }
    if (step === 2) {
      return (
        <Choice
          prompt={tx(lang, "在悉尼还是墨尔本？", "Sydney or Melbourne?")}
          options={PLACES.map((item) => tx(lang, item, item === "悉尼" ? "Sydney" : "Melbourne"))}
          values={[...PLACES]}
          onPick={(value) => {
            setPlace(value);
            setStep(3);
          }}
        />
      );
    }
    return (
      <div className="stack">
        <p>
          {tx(lang, "好。", "All right.")} {when} · {length} · {place}
        </p>
        <button
          type="button"
          className="btn pri"
          onClick={() => {
            const cents = PRICE_CENTS[length] ?? PRICE_CENTS["1小时"] ?? 60000;
            demo.setWalkIn({ when, duration: length, place, cents });
            navigate(to("/models/wantang/checkout"));
          }}
        >
          {tx(lang, "去结账", "Checkout")}
        </button>
      </div>
    );
  };

  return (
    <GuestFrame>
      <Link to={to("/models/wantang")}>晚棠</Link>
      {ask()}
    </GuestFrame>
  );
}

function Choice({
  prompt,
  options,
  values,
  onPick,
}: {
  prompt: string;
  options: string[];
  values: string[];
  onPick: (value: string) => void;
}) {
  return (
    <div className="stack">
      <p>{prompt}</p>
      <div className="row">
        {options.map((label, index) => (
          <button
            key={label}
            type="button"
            className="btn ghost"
            onClick={() => onPick(values[index] ?? label)}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function Checkout() {
  const [lang] = useLang();
  const to = useTo();
  const demo = useDemo();
  usePageTitle(tx(lang, "结账", "Checkout"), lang);
  const cents = demo.walkIn?.cents ?? 60000;
  const amount = cents === 110000 ? "A$1,100" : cents === 240000 ? "A$2,400" : "A$600";
  if (demo.walkInUnlocked && demo.guestPaid) {
    return (
      <GuestFrame>
        <div className="unlock stack">
          <strong>{tx(lang, "已解锁，转她私域", "Unlocked. Her private channels.")}</strong>
          <span>{tx(lang, "短信", "SMS")}</span>
          <span>WhatsApp</span>
          <span>{tx(lang, "微信", "WeChat")}</span>
        </div>
      </GuestFrame>
    );
  }
  return (
    <GuestFrame>
      <Link to={to("/models/wantang")}>晚棠</Link>
      <h1>{amount}</h1>
      <p>
        PayID <span className="mono">{PAYID_ACCOUNT}</span>
      </p>
      <p>
        {tx(lang, "收款户名", "Account name")} {PAYEE_NAME}
      </p>
      {demo.guestPaid ? (
        <p>{tx(lang, "她看一下到账。", "She'll check the transfer.")}</p>
      ) : (
        <button type="button" className="btn pri" onClick={() => demo.markGuestPaid()}>
          {tx(lang, "我已付款", "I've paid")}
        </button>
      )}
    </GuestFrame>
  );
}

function GuestFrame({ children }: { children: ReactNode }) {
  return (
    <div className="app">
      <header className="topbar">
        <span className="brand">晚棠</span>
        <span className="muted mono">mrlootbox.com/models/wantang</span>
        <LangSwitch />
      </header>
      <main className="page stack">{children}</main>
    </div>
  );
}
