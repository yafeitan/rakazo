import type { ReactNode } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import type { Lang } from "../domain";
import { tx } from "../domain";
import { useLang, useTo } from "../locale";
import type { OnboardingForm } from "../onboarding";
import {
  BOOK_PAYS,
  BOOK_REPLIES,
  CHANNELS,
  CITIES,
  CITY_LABEL,
  DAYS,
  fieldVisibility,
  GUEST_LANGS,
  generate,
  LOCKS,
  PAYS,
  PRICE_SENSITIVE,
  PRICES_BUILD,
  SERVICE_WAYS,
  SERVICES_BUILD,
  SERVICES_SENSITIVE,
  TIMEZONES,
  wantangForm,
} from "../onboarding";
import { useDemo } from "../state";

const OPT: Record<string, string> = {
  网站咨询: "Website",
  短信: "SMS",
  邮件: "Email",
  电话: "Phone",
  "1小时": "1 hour",
  "2小时": "2 hours",
  过夜: "Overnight",
  长期伴游: "Long stay",
  上门: "Outcall",
  工作室: "Studio",
  基础护理: "Basic care",
  美甲: "Nails",
  按摩理疗: "Massage",
  到店服务: "In store",
  上门服务: "Outcall",
  前台展示起步价: "Show starting prices",
  "不公开具体价格，询价后由老板确认": "Hide prices until she confirms",
  有可对客人说的价目: "There is a price list",
  "询价后报价，未确认的转老板": "Quote, then she confirms",
  "客服出草稿，你确认后再回复客人": "Drafts wait for her",
  客服可以直接回复客人: "Replies can go straight out",
  先付定金再确认档期: "Deposit first",
  "预约不需要定金，只要电话确认": "No deposit",
  银行转账: "Bank transfer",
  现金: "Cash",
  "客人付定金即可锁单，不用再问我": "A deposit locks it",
  收钱前必须先问我有没有空: "Ask me before any payment",
  中文: "Chinese",
  English: "English",
  "中文 + English": "Chinese + English",
  周一: "Mon",
  周二: "Tue",
  周三: "Wed",
  周四: "Thu",
  周五: "Fri",
  周六: "Sat",
  周日: "Sun",
};

function opt(lang: Lang, value: string): string {
  if (lang !== "en") return CITY_LABEL[value] ? `${CITY_LABEL[value]} ${value}` : value;
  return OPT[value] ?? CITY_LABEL[value] ?? value;
}

export function Onboarding() {
  const [lang] = useLang();
  const to = useTo();
  const demo = useDemo();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<OnboardingForm>(wantangForm);
  const [pack, setPack] = useState<ReturnType<typeof generate> | null>(null);
  const show = fieldVisibility(form.productLine);
  const patch = (partial: Partial<OnboardingForm>) =>
    setForm((current) => ({ ...current, ...partial }));

  const finish = () => {
    const next = generate(form);
    setPack(next);
    if (!next.config) return;
    const slug = next.config.placeholders.MERCHANT_SLUG ?? "scene";
    const id = `scene-${slug}`;
    if (!demo.extraBots.some((bot) => bot.id === id)) {
      demo.registerScene({
        id,
        name: next.config.placeholders.MERCHANT_NAME ?? slug,
        role: tx(lang, "场景", "Scene"),
        sceneId: slug,
        status: "等批",
        modelSummary: tx(lang, "已配置的模型", "Configured model"),
        skillSummary: tx(lang, "开通表", "Onboarding"),
        description: tx(lang, "等批。", "Waiting."),
      });
    }
  };

  return (
    <main className="page stack">
      <div className="row" style={{ justifyContent: "space-between" }}>
        <h1>{tx(lang, "开通新模特", "New scene")}</h1>
        <Link to={to("/studio/bots")}>{tx(lang, "返回", "Back")}</Link>
      </div>
      <ol className="steps">
        {[0, 1, 2, 3, 4].map((index) => (
          <li key={index} className={index === step ? "on mono" : "mono"}>
            {index + 1}
          </li>
        ))}
      </ol>
      {step === 0 ? (
        <section className="stack">
          <div className="lines">
            <button
              type="button"
              className={form.productLine === "sensitive" ? "line on" : "line"}
              onClick={() => patch({ productLine: "sensitive" })}
            >
              <strong>{tx(lang, "敏感行业", "Sensitive industry")}</strong>
            </button>
            <button
              type="button"
              className={form.productLine === "build_service" ? "line on dim" : "line dim"}
              onClick={() => patch({ productLine: "build_service" })}
            >
              <strong>{tx(lang, "普通商家搭建服务", "Standard setup")}</strong>
            </button>
          </div>
          <Field label={tx(lang, "商家名", "Business name")}>
            <input
              value={form.merchantName}
              onChange={(event) => patch({ merchantName: event.target.value })}
            />
          </Field>
          <Field label={tx(lang, "英文标识（MERCHANT_SLUG）", "English ID (MERCHANT_SLUG)")}>
            <input value={form.slug} onChange={(event) => patch({ slug: event.target.value })} />
          </Field>
          <Field label={tx(lang, "老板称呼", "What the team should call you")}>
            <input
              value={form.ownerName}
              onChange={(event) => patch({ ownerName: event.target.value })}
            />
          </Field>
          <Field label={tx(lang, "业务类型 / 行业", "What you do")}>
            <input
              value={form.industry}
              onChange={(event) => patch({ industry: event.target.value })}
            />
          </Field>
          {show.regulations ? (
            <Field label={tx(lang, "行业年龄/牌照限制", "Age or licence limits")}>
              <input
                value={form.regulations}
                onChange={(event) => patch({ regulations: event.target.value })}
              />
            </Field>
          ) : null}
        </section>
      ) : null}
      {step === 1 ? (
        <section className="stack">
          <Checks
            lang={lang}
            label={tx(lang, "主营城市", "Cities")}
            options={[...CITIES]}
            selected={form.cities}
            onChange={(cities) => patch({ cities })}
          />
          <Field label={tx(lang, "时区", "Time zone")}>
            <select
              value={form.timezone}
              onChange={(event) => patch({ timezone: event.target.value })}
            >
              {TIMEZONES.map((zone) => (
                <option key={zone}>{zone}</option>
              ))}
            </select>
          </Field>
          <Field label={tx(lang, "每天给老板发工作摘要的时间", "Daily summary time")}>
            <input
              type="time"
              value={form.briefTime}
              onChange={(event) => patch({ briefTime: event.target.value })}
            />
          </Field>
          {show.slotsNote ? (
            <p className="muted">
              {tx(
                lang,
                "档期就是你的生意开关。这里不填营业时间。",
                "Your calendar is the switch. No shop hours here.",
              )}
            </p>
          ) : null}
          {show.hours ? (
            <>
              <Checks
                lang={lang}
                label={tx(lang, "营业时间", "Opening hours")}
                options={DAYS.map((day) => day[0])}
                labels={DAYS.map((day) => opt(lang, day[1]))}
                selected={form.days}
                onChange={(days) => patch({ days })}
              />
              <div className="row">
                <Field label={tx(lang, "开门", "Opens")}>
                  <input
                    type="time"
                    value={form.open}
                    onChange={(event) => patch({ open: event.target.value })}
                  />
                </Field>
                <Field label={tx(lang, "关门", "Closes")}>
                  <input
                    type="time"
                    value={form.close}
                    onChange={(event) => patch({ close: event.target.value })}
                  />
                </Field>
              </div>
            </>
          ) : null}
        </section>
      ) : null}
      {step === 2 ? (
        <section className="stack">
          <div className="chips">
            {GUEST_LANGS.map((value) => (
              <button
                key={value}
                type="button"
                className={form.guestLang === value ? "chip on" : "chip"}
                onClick={() => patch({ guestLang: value })}
              >
                {opt(lang, value)}
              </button>
            ))}
          </div>
          <Field label={tx(lang, "队伍内部工作语言", "Team language")}>
            <select
              value={form.teamLang}
              onChange={(event) => patch({ teamLang: event.target.value })}
            >
              {GUEST_LANGS.map((value) => (
                <option key={value} value={value}>
                  {opt(lang, value)}
                </option>
              ))}
            </select>
          </Field>
          <Checks
            lang={lang}
            label={tx(lang, "客人联系渠道", "Channels")}
            options={CHANNELS}
            selected={form.channels}
            onChange={(channels) => patch({ channels })}
          />
          <Field label={tx(lang, "网站地址", "Website")}>
            <input
              value={form.siteUrl}
              onChange={(event) => patch({ siteUrl: event.target.value })}
            />
          </Field>
          {show.notifyPhone ? (
            <Field label={tx(lang, "订单通知手机号", "Order notification mobile")}>
              <input
                value={form.notifyPhone}
                onChange={(event) => patch({ notifyPhone: event.target.value })}
              />
            </Field>
          ) : null}
        </section>
      ) : null}
      {step === 3 ? (
        <OfferStep
          lang={lang}
          form={form}
          patch={patch}
          showWays={show.serviceWays}
          showLock={show.lock}
          showPrices={show.startPrices}
        />
      ) : null}
      {step === 4 ? (
        <section className="stack">
          <Field label={tx(lang, "工作区目录（WORKSPACE）", "Workspace folder")}>
            <input
              value={form.workspace}
              onChange={(event) => patch({ workspace: event.target.value })}
            />
          </Field>
          <Field
            label={tx(lang, "模板仓库地址（TEMPLATE_REPO_URL，可选）", "Template repository URL")}
          >
            <input
              value={form.templateRepo}
              onChange={(event) => patch({ templateRepo: event.target.value })}
            />
          </Field>
          <p className="muted">
            {tx(
              lang,
              "单笔花费上限和现金流目标不在这里问。",
              "Spend limit and cash target are asked later.",
            )}
          </p>
          <button type="button" className="btn pri" onClick={finish}>
            {tx(lang, "生成仓库字段", "Generate workspace fields")}
          </button>
          {pack && pack.errors.length > 0 ? <p className="bad">{pack.errors.join("、")}</p> : null}
          {pack?.config ? <Output lang={lang} pack={pack} /> : null}
        </section>
      ) : null}
      <div className="row">
        {step > 0 ? (
          <button type="button" className="btn ghost" onClick={() => setStep((value) => value - 1)}>
            {tx(lang, "上一步", "Back")}
          </button>
        ) : null}
        {step < 4 ? (
          <button
            type="button"
            className="btn pri"
            disabled={step === 0 && !form.productLine}
            onClick={() => setStep((value) => value + 1)}
          >
            {tx(lang, "下一步", "Next")}
          </button>
        ) : null}
      </div>
    </main>
  );
}

function OfferStep({
  lang,
  form,
  patch,
  showWays,
  showLock,
  showPrices,
}: {
  lang: Lang;
  form: OnboardingForm;
  patch: (partial: Partial<OnboardingForm>) => void;
  showWays: boolean;
  showLock: boolean;
  showPrices: boolean;
}) {
  const services = showWays ? SERVICES_SENSITIVE : SERVICES_BUILD;
  return (
    <section className="stack">
      <Checks
        lang={lang}
        label={tx(lang, showWays ? "预约时长" : "提供的服务", showWays ? "Length" : "Services")}
        options={services}
        selected={form.services}
        onChange={(next) => patch({ services: next })}
      />
      {showWays ? (
        <Checks
          lang={lang}
          label={tx(lang, "服务方式", "How you work")}
          options={SERVICE_WAYS}
          selected={form.serviceWays}
          onChange={(serviceWays) => patch({ serviceWays })}
        />
      ) : null}
      {showPrices ? (
        <div className="chips">
          {PRICE_SENSITIVE.map((value) => (
            <button
              key={value}
              type="button"
              className={form.priceMode === value ? "chip on" : "chip"}
              onClick={() => patch({ priceMode: value })}
            >
              {opt(lang, value)}
            </button>
          ))}
        </div>
      ) : (
        <Checks
          lang={lang}
          label={tx(lang, "价格怎么对客人说", "How you talk about price")}
          options={PRICES_BUILD}
          selected={form.pricesBuild}
          onChange={(pricesBuild) => patch({ pricesBuild })}
        />
      )}
      {showPrices && form.priceMode === "前台展示起步价"
        ? form.services.map((service) => (
            <Field key={service} label={opt(lang, service)}>
              <input
                value={form.start[service] ?? ""}
                onChange={(event) =>
                  patch({ start: { ...form.start, [service]: event.target.value } })
                }
              />
            </Field>
          ))
        : null}
      {showPrices
        ? form.services.map((service) => (
            <Field
              key={`floor-${service}`}
              label={`${tx(lang, "最少", "Minimum")} ${opt(lang, service)}`}
            >
              <input
                value={form.floor[service] ?? ""}
                onChange={(event) =>
                  patch({ floor: { ...form.floor, [service]: event.target.value } })
                }
              />
            </Field>
          ))
        : null}
      <Checks
        lang={lang}
        label={tx(lang, "支付方式", "Payment methods")}
        options={PAYS}
        selected={form.pays}
        onChange={(pays) => patch({ pays })}
      />
      {form.pays.includes("PayID") ? (
        <Field label={tx(lang, "PayID 账号", "PayID")}>
          <input value={form.payId} onChange={(event) => patch({ payId: event.target.value })} />
        </Field>
      ) : null}
      {showWays ? (
        <div className="stack">
          <span>{tx(lang, "客人怎么预约", "How clients book")}</span>
          <button
            type="button"
            className={form.bookSite ? "chip on" : "chip"}
            onClick={() => patch({ bookSite: !form.bookSite })}
          >
            {tx(lang, "客人在网站查看档期后预约", "Book from the page")}
          </button>
          {BOOK_REPLIES.map((value) => (
            <button
              key={value}
              type="button"
              className={form.bookReply === value ? "chip on" : "chip"}
              onClick={() => patch({ bookReply: value })}
            >
              {opt(lang, value)}
            </button>
          ))}
          {BOOK_PAYS.map((value) => (
            <button
              key={value}
              type="button"
              className={form.bookPay === value ? "chip on" : "chip"}
              onClick={() => patch({ bookPay: value })}
            >
              {opt(lang, value)}
            </button>
          ))}
        </div>
      ) : null}
      {showLock ? (
        <div className="chips">
          {LOCKS.map((value) => (
            <button
              key={value}
              type="button"
              className={form.lock === value ? "chip on" : "chip"}
              onClick={() => patch({ lock: value })}
            >
              {opt(lang, value)}
            </button>
          ))}
        </div>
      ) : null}
    </section>
  );
}

function Output({ lang, pack }: { lang: Lang; pack: NonNullable<ReturnType<typeof generate>> }) {
  const json = JSON.stringify(pack.config, null, 2);
  return (
    <div className="stack" data-testid="onboarding-output">
      <h2>{tx(lang, "字段对照（占位符 → 值）", "Field mapping")}</h2>
      <table>
        <tbody>
          {pack.rows.map(([key, value]) => (
            <tr key={key}>
              <td>
                <code>{`{{${key}}}`}</code>
              </td>
              <td>{value || tx(lang, "（空）", "(empty)")}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>merchant-config.json</h2>
      <button type="button" className="btn pri" onClick={() => download(json)}>
        {tx(lang, "下载 merchant-config.json", "Download merchant-config.json")}
      </button>
      <pre>{json}</pre>
      <h2>client-context/owner.md</h2>
      <pre>{pack.owner}</pre>
      <h2>client-context/offering.md</h2>
      <pre>{pack.offering}</pre>
    </div>
  );
}

function download(json: string) {
  const url = URL.createObjectURL(new Blob([json], { type: "application/json" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = "merchant-config.json";
  link.click();
  URL.revokeObjectURL(url);
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="field">
      <span>{label}</span>
      {children}
    </div>
  );
}

function Checks({
  lang,
  label,
  options,
  selected,
  onChange,
  labels,
}: {
  lang: Lang;
  label: string;
  options: string[];
  selected: string[];
  onChange: (next: string[]) => void;
  labels?: string[];
}) {
  return (
    <div className="stack">
      <span>{label}</span>
      <div className="chips">
        {options.map((option, index) => {
          const on = selected.includes(option);
          return (
            <button
              key={option}
              type="button"
              className={on ? "chip on" : "chip"}
              onClick={() =>
                onChange(on ? selected.filter((item) => item !== option) : [...selected, option])
              }
            >
              {labels?.[index] ?? opt(lang, option)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
