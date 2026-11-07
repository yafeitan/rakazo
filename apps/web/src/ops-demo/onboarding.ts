/** Pure port of the merchant onboarding form. It never sends a request. */

export type ProductLine = "sensitive" | "build_service" | "";

export type OnboardingForm = {
  productLine: ProductLine;
  merchantName: string;
  slug: string;
  ownerName: string;
  industry: string;
  regulations: string;
  cities: string[];
  cityOther: string;
  timezone: string;
  briefTime: string;
  days: string[];
  open: string;
  close: string;
  guestLang: string;
  teamLang: string;
  channels: string[];
  channelOther: string;
  siteUrl: string;
  notifyPhone: string;
  services: string[];
  serviceOther: string;
  serviceWays: string[];
  priceMode: string;
  priceExtra: boolean;
  pricesBuild: string[];
  start: Record<string, string>;
  floor: Record<string, string>;
  pays: string[];
  payOther: string;
  payId: string;
  bookSite: boolean;
  bookReply: string;
  bookPay: string;
  bookOther: string;
  booksBuild: string[];
  lock: string;
  workspace: string;
  templateRepo: string;
};

export const CITIES = [
  "Sydney",
  "Melbourne",
  "Brisbane",
  "Adelaide",
  "Perth",
  "Canberra",
  "Hobart",
  "Gold Coast",
  "Auckland",
] as const;

export const CITY_LABEL: Record<string, string> = {
  Sydney: "悉尼",
  Melbourne: "墨尔本",
  Brisbane: "布里斯班",
  Adelaide: "阿德莱德",
  Perth: "珀斯",
  Canberra: "堪培拉",
  Hobart: "霍巴特",
  "Gold Coast": "黄金海岸",
  Auckland: "奥克兰",
};

export const TIMEZONES = [
  "Australia/Sydney",
  "Australia/Melbourne",
  "Australia/Brisbane",
  "Australia/Adelaide",
  "Australia/Perth",
  "Australia/Hobart",
  "Pacific/Auckland",
  "Asia/Shanghai",
  "Asia/Hong_Kong",
  "Asia/Singapore",
];

export const CHANNELS = ["网站咨询", "Telegram", "短信", "WhatsApp", "邮件", "电话"];

export const DAYS: Array<[string, string]> = [
  ["1", "周一"],
  ["2", "周二"],
  ["3", "周三"],
  ["4", "周四"],
  ["5", "周五"],
  ["6", "周六"],
  ["0", "周日"],
];

export const SERVICES_SENSITIVE = ["1小时", "2小时", "过夜", "长期伴游"];
export const SERVICE_WAYS = ["上门", "工作室"];
export const SERVICES_BUILD = ["基础护理", "美甲", "按摩理疗", "到店服务", "上门服务"];
export const PAYS = ["PayID", "银行转账", "现金"];

export const PRICE_SENSITIVE = ["前台展示起步价", "不公开具体价格，询价后由老板确认"];
export const PRICE_EXTRA = "未列出的价格一律转老板";
export const PRICES_BUILD = ["有可对客人说的价目", "询价后报价，未确认的转老板"];

export const BOOK_REPLIES = ["客服出草稿，你确认后再回复客人", "客服可以直接回复客人"];
export const BOOK_PAYS = ["先付定金再确认档期", "预约不需要定金，只要电话确认"];
export const LOCKS = ["客人付定金即可锁单，不用再问我", "收钱前必须先问我有没有空"];
export const GUEST_LANGS = ["中文", "English", "中文 + English"];

const LINE_LABEL: Record<string, string> = {
  sensitive: "敏感行业",
  build_service: "普通商家搭建服务",
};

export function fieldVisibility(line: ProductLine) {
  const sensitive = line === "sensitive";
  return {
    regulations: sensitive,
    hours: line === "build_service",
    slotsNote: sensitive,
    notifyPhone: sensitive,
    serviceWays: sensitive,
    startPrices: sensitive,
    floorPrices: sensitive,
    lock: sensitive,
    siteRequired: line === "build_service",
  };
}

export function emptyForm(): OnboardingForm {
  return {
    productLine: "",
    merchantName: "",
    slug: "",
    ownerName: "",
    industry: "",
    regulations: "",
    cities: [],
    cityOther: "",
    timezone: "Australia/Sydney",
    briefTime: "07:00",
    days: [],
    open: "10:00",
    close: "20:00",
    guestLang: "",
    teamLang: "中文",
    channels: [],
    channelOther: "",
    siteUrl: "",
    notifyPhone: "",
    services: [],
    serviceOther: "",
    serviceWays: [],
    priceMode: "",
    priceExtra: false,
    pricesBuild: [],
    start: {},
    floor: {},
    pays: [],
    payOther: "",
    payId: "",
    bookSite: false,
    bookReply: "",
    bookPay: "",
    bookOther: "",
    booksBuild: [],
    lock: "",
    workspace: "",
    templateRepo: "",
  };
}

export function wantangForm(): OnboardingForm {
  return {
    ...emptyForm(),
    productLine: "sensitive",
    merchantName: "晚棠",
    slug: "wantang",
    ownerName: "晚棠",
    industry: "敏感行业·个人模特",
    regulations: "18+",
    cities: ["Melbourne", "Sydney"],
    timezone: "Australia/Melbourne",
    briefTime: "21:30",
    guestLang: "中文 + English",
    teamLang: "中文",
    channels: ["Telegram", "短信", "WhatsApp"],
    siteUrl: "https://mrlootbox.com/models/wantang",
    services: ["1小时", "2小时", "过夜"],
    serviceWays: ["上门"],
    priceMode: "前台展示起步价",
    start: { "1小时": "A$600", "2小时": "A$1,100", 过夜: "A$2,400" },
    floor: { "1小时": "A$500", "2小时": "A$950", 过夜: "A$2,000" },
    pays: ["PayID"],
    payId: "wantang@example.com",
    bookSite: true,
    bookReply: "客服出草稿，你确认后再回复客人",
    lock: "收钱前必须先问我有没有空",
    workspace: "wantang",
  };
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

function splitExtra(value: string): string[] {
  return value
    .split(/[,，、]/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function packAmt(kind: Record<string, string>, services: string[], other: string): string {
  const parts = SERVICES_SENSITIVE.filter((label) => services.includes(label) && kind[label]).map(
    (label) => `${label} ${kind[label]}`,
  );
  if (other && kind.其他) parts.push(`其他 ${kind.其他}`);
  return parts.join("；");
}

export type GeneratedConfig = {
  schema_version: 3;
  generated_at: string;
  product_line: ProductLine;
  product_line_label: string;
  placeholders: Record<string, string>;
  notes: {
    secrets: string;
    ask_later: string[];
    included_scope: string;
    draft_only: boolean;
  };
};

export type GeneratedPack = {
  errors: string[];
  config: GeneratedConfig | null;
  rows: Array<[string, string]>;
  owner: string;
  offering: string;
};

export function generate(form: OnboardingForm, now = new Date().toISOString()): GeneratedPack {
  const line = form.productLine;
  const cities = [...form.cities, ...splitExtra(form.cityOther)];
  const channels = [...form.channels, ...splitExtra(form.channelOther)];
  const services = [...form.services, ...splitExtra(form.serviceOther)];
  const sensitive = line === "sensitive";
  const dayText = DAYS.filter((day) => form.days.includes(day[0]))
    .map((day) => day[1])
    .join("、");
  const hours =
    form.days.length && form.open && form.close ? `${dayText} ${form.open}–${form.close}` : "";
  const businessHours = sensitive
    ? "按每位模特单独配置档期，不设统一营业时间。后台按人设置：日期、开始时间、跨度（可跨天）、结束时间，操作为开放或屏蔽。"
    : hours;
  const cron = sensitive ? "ASK" : hoursCron(form.open, form.close);
  const priceList = sensitive
    ? [form.priceMode, form.priceExtra ? PRICE_EXTRA : ""].filter(Boolean).join("；")
    : form.pricesBuild.join("；");
  const booking = sensitive
    ? [
        form.bookSite ? "客人在网站查看档期后预约" : "",
        form.bookReply,
        form.bookPay,
        form.bookOther,
      ]
        .filter(Boolean)
        .join("；")
    : [...form.booksBuild, form.bookOther].filter(Boolean).join("；");
  const scope = sensitive
    ? "询价草稿（只出草稿不直发）、档期确认转老板"
    : "询价草稿、新订单提醒、网站/SEO 巡检";
  const placeholders: Record<string, string> = {
    MERCHANT_NAME: form.merchantName.trim(),
    MERCHANT_SLUG: form.slug.trim(),
    OWNER_NAME: form.ownerName.trim(),
    INDUSTRY: form.industry.trim(),
    LOCAL_REGULATIONS: sensitive
      ? form.regulations.trim() || "无特殊限制（待老板确认）"
      : form.regulations.trim() || "不适用",
    CITY: cities.join("、"),
    TIMEZONE: form.timezone.trim(),
    LANGUAGES: form.guestLang,
    TEAM_LANGUAGE: form.teamLang,
    CHANNELS: channels.join("、"),
    BUSINESS_HOURS: businessHours,
    BUSINESS_HOURS_CRON: cron,
    BRIEF_TIME: form.briefTime || "07:00",
    SITE_URL: form.siteUrl.trim(),
    SERVICES: [...services, ...form.serviceWays].filter(Boolean).join("；"),
    PRICE_LIST: priceList || "ASK（未确认前询价一律转老板）",
    START_PRICES: sensitive ? packAmt(form.start, form.services, form.serviceOther) : "不适用",
    FLOOR_PRICES: sensitive
      ? packAmt(form.floor, form.services, form.serviceOther) || "ASK（开通后可补）"
      : "不适用",
    BOOKING_METHOD: booking || "ASK",
    LOCK_RULE: sensitive ? form.lock || "ASK" : "不适用",
    ORDER_NOTIFY_PHONE: sensitive ? form.notifyPhone.trim() : "不适用",
    PAYMENT_METHODS: [...form.pays, ...splitExtra(form.payOther)].filter(Boolean).join("；"),
    PAYID_ACCOUNT: form.pays.includes("PayID") ? form.payId.trim() : "",
    WORKSPACE: form.workspace.trim(),
    TEMPLATE_REPO_URL: form.templateRepo.trim() || "（老板上传压缩包）",
    SPEND_LIMIT: "ASK",
    CASHFLOW_TARGET: "ASK",
  };

  const errors: string[] = [];
  if (!line) errors.push("产品线");
  if (!placeholders.MERCHANT_NAME) errors.push("商家名");
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(placeholders.MERCHANT_SLUG ?? "")) errors.push("英文标识");
  if (!placeholders.OWNER_NAME) errors.push("老板称呼");
  if (!placeholders.INDUSTRY) errors.push("行业");
  if (!cities.length) errors.push("主营城市");
  if (
    line === "build_service" &&
    !(form.days.length && form.open && form.close && form.close > form.open)
  ) {
    errors.push("营业时间");
  }
  if (!placeholders.LANGUAGES) errors.push("对客语言");
  if (!channels.length) errors.push("渠道");
  const urlOk =
    line === "build_service"
      ? /^https?:\/\/\S+$/.test(placeholders.SITE_URL ?? "")
      : !placeholders.SITE_URL || /^https?:\/\/\S+$/.test(placeholders.SITE_URL);
  if (!urlOk) errors.push("网站地址");
  if (sensitive ? services.length === 0 : !placeholders.SERVICES) errors.push("服务");
  if (sensitive && form.serviceWays.length === 0) errors.push("服务方式");
  if (sensitive && !form.bookReply) errors.push("谁确认回复");
  if (sensitive && (!form.lock || form.lock === "ASK")) errors.push("锁单授权");
  const phone = placeholders.ORDER_NOTIFY_PHONE ?? "";
  if (sensitive && phone && !/^[0-9+\s()-]{8,20}$/.test(phone)) errors.push("订单通知手机号");
  if (!placeholders.WORKSPACE) errors.push("工作区目录");

  if (errors.length || !line) {
    return { errors, config: null, rows: [], owner: "", offering: "" };
  }

  const config: GeneratedConfig = {
    schema_version: 3,
    generated_at: now,
    product_line: line,
    product_line_label: LINE_LABEL[line] ?? "",
    placeholders,
    notes: {
      secrets: "不在此文件中。开通后用安全密钥卡单独处理。",
      ask_later: [
        "SPEND_LIMIT",
        "CASHFLOW_TARGET",
        "定金规则",
        "取消/改期规则",
        "转人工话术",
        "签名",
      ],
      included_scope: scope,
      draft_only: sensitive,
    },
  };

  const rows = Object.entries(placeholders);
  const owner = ownerDoc(placeholders, cities, scope, sensitive);
  const offering = offeringDoc(placeholders, scope, sensitive);
  return { errors: [], config, rows, owner, offering };
}

function hoursCron(open: string, close: string): string {
  if (!open || !close) return "";
  const openHour = Number(open.split(":")[0]);
  const closeHour = Number(close.split(":")[0]);
  return closeHour > openHour ? `${openHour}-${closeHour - 1}` : `${openHour}`;
}

function ownerDoc(
  ph: Record<string, string>,
  cities: string[],
  scope: string,
  sensitive: boolean,
): string {
  const lineKnown = sensitive
    ? `- **产品线:** ${LINE_LABEL.sensitive}。客服只出草稿，不直接给客人发消息。`
    : `- **产品线:** ${LINE_LABEL.build_service}。本单范围：${scope}。`;
  const notify =
    sensitive && ph.ORDER_NOTIFY_PHONE ? `- **订单通知手机号:** ${ph.ORDER_NOTIFY_PHONE}\n` : "";
  const pay = ph.PAYMENT_METHODS
    ? `- **支付方式:** ${ph.PAYMENT_METHODS}${ph.PAYID_ACCOUNT ? `（PayID：${ph.PAYID_ACCOUNT}）` : ""}\n`
    : "";
  const floor =
    sensitive && ph.FLOOR_PRICES && ph.FLOOR_PRICES !== "ASK（开通后可补）"
      ? `- **最低收费（不对客人说，钱都归你）:** ${ph.FLOOR_PRICES}\n`
      : "";
  const lock =
    sensitive && ph.LOCK_RULE && ph.LOCK_RULE !== "ASK" ? `- **锁单授权:** ${ph.LOCK_RULE}\n` : "";
  const site = ph.SITE_URL ? `- **网站地址:** ${ph.SITE_URL}\n` : "";
  return `# Owner: ${ph.OWNER_NAME}, ${ph.MERCHANT_NAME}

Setup 把本文件复制到 ${ph.WORKSPACE}/context/owner.md。getting-started 技能先确认 Known，再逐条问 ASK。联系方式只写工作区副本。

## Known
${lineKnown}
- **Business:** ${ph.MERCHANT_NAME}，行业 ${ph.INDUSTRY}。
- **Owner:** ${ph.OWNER_NAME}。
- **城市/时区:** ${cities.map((city) => `${city} / ${ph.TIMEZONE}`).join("\n  ")}
- **语言:** ${ph.LANGUAGES}（团队内部：${ph.TEAM_LANGUAGE}）。
- **渠道:** ${ph.CHANNELS}。
${notify}${pay}- **工作日与营业时间:** ${ph.BUSINESS_HOURS}。
- **早报时间:** ${ph.BRIEF_TIME}（当地时间）。
${floor}${lock}${site}## ASK
- **热客是立即通知还是进早报:** ASK.
- **单笔花费上限:** ASK.
- **现金流目标:** ASK.
- **有无助手/员工接人工单:** ASK.
${ph.SITE_URL ? "" : "- **网站地址（如有）:** ASK.\n"}`;
}

function offeringDoc(ph: Record<string, string>, scope: string, sensitive: boolean): string {
  const how = sensitive ? "预约方式" : "咨询回复方式";
  const pay = ph.PAYMENT_METHODS
    ? `- **支付方式:** ${ph.PAYMENT_METHODS}${ph.PAYID_ACCOUNT ? `（${ph.PAYID_ACCOUNT}）` : ""}\n`
    : "";
  const start = sensitive && ph.START_PRICES ? `\n- **前台起步价:** ${ph.START_PRICES}` : "";
  return `# Offering: ${ph.MERCHANT_NAME}

## May say（已确认口径）
- **服务:** ${ph.SERVICES}
- **价格:** ${ph.PRICE_LIST}${start}
${pay}- **服务区域:** ${ph.CITY}
- **${how}:** ${ph.BOOKING_METHOD}
- **本单范围:** ${scope}

## Never say
- 未列出的价格、折扣、保证。
- 员工/服务人员的私人信息。
- 最低收费、底价（不对客人说）。
${sensitive ? "- 不承诺档期一定有，不保证效果。\n" : ""}
## ASK
- **定金规则:** ASK.
- **取消/改期规则:** ASK.
- **转人工的话术:** ASK.
- **签名:** ASK.
`;
}

export function configFilename(): string {
  return "merchant-config.json";
}
