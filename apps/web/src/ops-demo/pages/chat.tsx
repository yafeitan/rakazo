import { Link, useParams } from "react-router-dom";
import type { GuestId } from "../domain";
import { seedGuests, tx } from "../domain";
import { useLang, useTo } from "../locale";
import { reminderCopy, useDemo } from "../state";
import { Decisions, openDrafts } from "../widgets";

const IDS = new Set<GuestId>(["jason", "ajie", "leo", "tom"]);

export function Chat() {
  const { id = "" } = useParams();
  const [lang] = useLang();
  const to = useTo();
  const demo = useDemo();
  const guestId = IDS.has(id as GuestId) ? (id as GuestId) : null;
  const guest = seedGuests.find((item) => item.id === guestId);
  if (!guest || !guestId) {
    return (
      <main className="page">
        <p>{tx(lang, "没有这位客人。", "No guest with that id.")}</p>
      </main>
    );
  }
  const messages = demo.messages[guestId];
  const typing = messages.some(
    (message) => message.role === "her" && message.guestVisibleAt > demo.now,
  );
  const guestView = messages.filter(
    (message) => message.role === "guest" || message.guestVisibleAt <= demo.now,
  );
  const drafts = openDrafts(demo.drafts).filter((draft) => draft.guestId === guestId);
  const unlocked = guest.paid || (guestId === "tom" && true);
  const note = reminderCopy(lang);
  return (
    <main className="page stack">
      <Link to={to("/app")}>{tx(lang, "返回工作台", "Back to the desk")}</Link>
      {unlocked ? (
        <div className="unlock stack">
          <strong>{tx(lang, "已解锁，转她私域", "Unlocked. Her private channels.")}</strong>
          <span>{tx(lang, "短信 · WhatsApp · 微信", "SMS · WhatsApp · WeChat")}</span>
          <span>{note.summary}</span>
          <span>{note.reminder}</span>
        </div>
      ) : null}
      <div className="split">
        <section className="stack">
          {messages.map((message) => (
            <div
              key={message.id}
              className={message.role === "her" ? "bubble her" : "bubble guest"}
            >
              {message.text}
            </div>
          ))}
          {drafts.length > 0 ? <Decisions lang={lang} items={drafts} /> : null}
        </section>
        <aside className="stack">
          <article className="card stack">
            <h2>{guest.name}</h2>
            <span>
              {tx(lang, "时间", "When")} {guest.when}
            </span>
            <span>
              {tx(lang, "时长", "Length")} {guest.duration}
            </span>
            <span>
              {tx(lang, "地点", "Place")} {guest.place}
            </span>
            <span>
              {tx(lang, "预算", "Budget")} {guest.budget}
            </span>
            <span>{tx(lang, "来源", "Source")} mrlootbox.com</span>
            <span>
              {tx(lang, "信誉", "Record")} {guest.trust}
            </span>
            <span>
              {tx(lang, "付款", "Payment")}{" "}
              {guest.paid ? tx(lang, "已付", "Paid") : tx(lang, "未付", "Unpaid")}
            </span>
          </article>
          <article className="card stack" data-testid="guest-view">
            <h2>{tx(lang, "客人看到的", "What the guest sees")}</h2>
            {guestView.map((message) => (
              <div
                key={message.id}
                className={message.role === "her" ? "bubble her" : "bubble guest"}
              >
                {message.text}
              </div>
            ))}
            {typing ? <p className="typing">{tx(lang, "正在输入…", "typing…")}</p> : null}
          </article>
        </aside>
      </div>
    </main>
  );
}
