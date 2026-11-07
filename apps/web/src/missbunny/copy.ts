export type Lang = "zh" | "en";

export const LANG_STORAGE_KEY = "missbunny.lang";

export function parseLang(value: unknown): Lang {
  return value === "en" ? "en" : "zh";
}

type Line = readonly [string, string];

export type Copy = {
  operatingSystem: string;
  tryDemo: string;
  kicker: string;
  hero: string;
  priceTagline: string;
  priceSupport: string;
  heroDetail: string;
  metaDescription: string;
  lines: readonly Line[];
  join: string;
  joinReason: string;
  selfRun: string;
  chooseSelfRun: string;
  joined: string;
  continue: string;
  language: string;
  demoTitle: string;
  demoIntro: string;
  steps: readonly string[];
  browseAsGuest: string;
  wantangDeposit: string;
  chengyuePhone: string;
  openEngine: string;
  opening: string;
  serviceClosed: string;
  browse: string;
  bookings: string;
  today: string;
  profile: string;
  role: string;
  guest: string;
  model: string;
  whichProfile: string;
  newProfile: string;
  switchToModel: string;
  readiness: string;
  followSteps: string;
  finishProfile: string;
  engineRunning: string;
  deposit: string;
  depositOn: (amount: string) => string;
  phoneOnly: string;
  requireDeposit: string;
  amount: string;
  save: string;
  incomeToday: string;
  demoLedger: string;
  monthlyFee: string;
  recentIncome: (amount: string) => string;
  usageBand: string;
  held: (label: string) => string;
  badge: string;
  handOff: string;
  illConfirm: string;
  waiting: string;
  noneWaiting: string;
  confirmReceived: string;
  notReceived: string;
  recentBookings: string;
  noneYet: string;
  markComplete: string;
  notFinished: string;
  noMatches: string;
  available: string;
  plans: string;
  payment: string;
  book: string;
  desk: string;
  demoBalance: string;
  topUp: string;
  topUpTitle: string;
  topUpOther: string;
  customAmount: string;
  topUpMin: string;
  topUpCredit: string;
  topUpDue: string;
  topUpPay: (amount: string) => string;
  topUpDone: string;
  topUpClose: string;
  topUpDemo: string;
  ahaGuest: string;
  ahaReply: string;
  ahaSteps: readonly [string, string, string];
  ahaPending: string;
  ahaConfirmed: string;
  ahaReceived: string;
  ahaContactHidden: string;
  ahaContactOpen: string;
  ahaContact: string;
  ahaLedger: string;
};

const zh: Copy = {
  operatingSystem: "运营系统",
  tryDemo: "试用演示",
  kicker: "AI that works while you sleep",
  hero: "你睡觉，AI 也在帮你干活",
  priceTagline: "开张不要钱，看店要钱。",
  priceSupport:
    "AI 员工搭建和工具免费，每月 A$300–600 只付看店：回客人、筛单、收定金、记账，不乱说。",
  heroDetail: "只服务澳洲的独立模特。不服务经纪公司。",
  metaDescription: "Miss Bunny OS，澳洲独立模特的运营系统。你睡觉，AI 也在帮你干活。",
  lines: [
    ["24 小时回复询问", "She sleeps. Replies keep going."],
    ["预约有人看着", "Bookings stay in view."],
    ["只用你写过的资料回答", "拿不准，就标「需要你确认」。"],
    ["钱进你自己的 PayID", "我们不经手。"],
    ["每天的工作和入账，都看得见", "演示账本。"],
    ["月费是 AI 用量", "大约 A$300–600。"],
    ["客人留下电话就能约", "订金默认是 0。要收，就在设置里打开 PayID 订金。"],
  ],
  join: "入驻",
  joinReason: "搜索流量不够。AI 员工要每天有稳定的询问。",
  selfRun: "自运营",
  chooseSelfRun: "先选择自运营",
  joined: "入驻完成（演示）",
  continue: "继续",
  language: "语言",
  demoTitle: "missbunny",
  demoIntro: "只服务澳洲的独立模特，不服务经纪公司。私人、克制、由你决定。",
  steps: [
    "浏览主页不需要登录。",
    "晚棠要求电话，并收一笔 PayID 订金（演示）。她确认到账后，联系方式才出现。",
    "澄月不收订金。留下电话就可以预约，联系方式随预约出现。",
    "右上角切换到模特，用订金开关在两种规则之间换。",
    "待付款订单里可以用「模拟超时」；她可以点「未收到」。",
  ],
  browseAsGuest: "以客人浏览",
  wantangDeposit: "晚棠 · PayID 订金",
  chengyuePhone: "澄月 · 只留电话",
  openEngine: "以模特查看引擎",
  opening: "正在打开",
  serviceClosed: "演示服务没有打开",
  browse: "浏览",
  bookings: "预约",
  today: "今日",
  profile: "档案",
  role: "身份",
  guest: "客人",
  model: "模特",
  whichProfile: "档案",
  newProfile: "新的档案",
  switchToModel: "切换到模特身份",
  readiness: "准备度",
  followSteps: "跟着这几步，引擎会替你接住已经邀请的客人。",
  finishProfile: "去完善档案",
  engineRunning: "引擎运行中",
  deposit: "订金",
  depositOn: (amount) => `PayID ${amount}（演示）`,
  phoneOnly: "只留电话",
  requireDeposit: "需要 PayID 订金",
  amount: "金额",
  save: "保存",
  incomeToday: "今日入账",
  demoLedger: "演示账本",
  monthlyFee: "月费",
  recentIncome: (amount) => `近七日入账 ${amount}`,
  usageBand: "AI 用量，大约 A$300–600 · 演示",
  held: (label) => `入账进入她配置的 ${label}（演示）`,
  badge: "只用你资料里的内容回答，不编",
  handOff: "交给预约",
  illConfirm: "我来确认",
  waiting: "待确认",
  noneWaiting: "没有等待确认的预约",
  confirmReceived: "确认到账",
  notReceived: "未收到",
  recentBookings: "最近的预约",
  noneYet: "还没有",
  markComplete: "标记完成",
  notFinished: "没有完成",
  noMatches: "没有匹配的主页",
  available: "可约",
  plans: "安排",
  payment: "收款",
  book: "预约",
  desk: "模特后台",
  demoBalance: "演示余额",
  topUp: "充值",
  topUpTitle: "充值额度",
  topUpOther: "其他",
  customAmount: "其他金额",
  topUpMin: "至少 A$50",
  topUpCredit: "将增加的额度",
  topUpDue: "应付",
  topUpPay: (amount) => `现在支付 ${amount}`,
  topUpDone: "已记入演示余额",
  topUpClose: "完成",
  topUpDemo: "演示，不会扣款。",
  ahaGuest: "周四晚上还有空吗？想约一次私人晚宴。",
  ahaReply:
    "周四到周日傍晚之后可以。私人晚宴可以安排。请先用 PayID 付 A$100 订金（演示）。到账后我再发联系方式。",
  ahaSteps: [
    "客人刚发来一条询问。",
    "AI 正在用她的口吻回复，并确认这是不是一次预约。",
    "AI 正在向客人收取 PayID 订金。",
  ],
  ahaPending: "待付订金 · PayID A$100（演示）",
  ahaConfirmed: "订金已确认 · PayID A$100（演示）",
  ahaReceived: "已收款",
  ahaContactHidden: "客人的联系方式尚未开放",
  ahaContactOpen: "客人的联系方式已开放",
  ahaContact: "0400 000 222（演示）",
  ahaLedger: "账本记入 PayID 订金 A$100（演示）",
};

const en: Copy = {
  operatingSystem: "Operating system",
  tryDemo: "Try the demo",
  kicker: "AI that works while you sleep",
  hero: "You sleep. The AI keeps working.",
  priceTagline: "Opening shop is free. Minding the shop is what you pay for.",
  priceSupport:
    "AI employee setup and tools are free. A$300–600 a month pays only for minding the shop: answering guests, screening bookings, collecting deposits, keeping the books, not making things up.",
  heroDetail: "For independent models in Australia. Not for agencies.",
  metaDescription:
    "Miss Bunny OS, an operating system for independent models in Australia. You sleep. The AI keeps working.",
  lines: [
    ["Inquiries get a reply, day and night", "She sleeps. Replies keep going."],
    ["Someone watches the bookings", "They stay in view."],
    ["Answers only from what you wrote", "If it isn’t there, it’s marked “Needs you to confirm.”"],
    ["Money goes to your own PayID", "We never hold it."],
    ["The day’s work and income stay visible", "Demo ledger."],
    ["The monthly fee is AI usage", "About A$300–600."],
    [
      "A phone number is enough to book",
      "The deposit starts at 0. To require one, turn on a PayID deposit in settings.",
    ],
  ],
  join: "Join",
  joinReason:
    "Search traffic is not enough. The AI employee needs a steady stream of inquiries every day.",
  selfRun: "Self-run",
  chooseSelfRun: "Choose self-run first",
  joined: "Joined (demo)",
  continue: "Continue",
  language: "Language",
  demoTitle: "missbunny",
  demoIntro:
    "For independent models in Australia, not agencies. Private, discreet, and hers to decide.",
  steps: [
    "Browsing a profile does not need a sign-in.",
    "Wantang asks for a phone number and a PayID deposit (demo). Contacts appear after she confirms the money arrived.",
    "Chengyue takes no deposit. A phone number books, and contacts appear with the booking.",
    "Switch to the model at the top right, and use the deposit switch to move between the two rules.",
    "A pending payment can be timed out. She can mark it as not received.",
  ],
  browseAsGuest: "Browse as a guest",
  wantangDeposit: "Wantang · PayID deposit",
  chengyuePhone: "Chengyue · phone only",
  openEngine: "Open the engine as the model",
  opening: "Opening",
  serviceClosed: "The demo service is not open",
  browse: "Browse",
  bookings: "Bookings",
  today: "Today",
  profile: "Profile",
  role: "Role",
  guest: "Guest",
  model: "Model",
  whichProfile: "Profile",
  newProfile: "New profile",
  switchToModel: "Switch to the model",
  readiness: "Readiness",
  followSteps: "Follow these steps and the engine takes the guests you already invited.",
  finishProfile: "Finish the profile",
  engineRunning: "Engine is running",
  deposit: "Deposit",
  depositOn: (amount) => `PayID ${amount} (demo)`,
  phoneOnly: "Phone only",
  requireDeposit: "Require a PayID deposit",
  amount: "Amount",
  save: "Save",
  incomeToday: "Today’s income",
  demoLedger: "Demo ledger",
  monthlyFee: "Monthly fee",
  recentIncome: (amount) => `Last 7 days ${amount}`,
  usageBand: "AI usage, about A$300–600 · demo",
  held: (label) => `Income goes to the ${label} she set up (demo)`,
  badge: "Answers only from your profile. Nothing invented.",
  handOff: "Hand to booking",
  illConfirm: "I’ll confirm",
  waiting: "Waiting to confirm",
  noneWaiting: "Nothing waiting",
  confirmReceived: "Confirm received",
  notReceived: "Not received",
  recentBookings: "Recent bookings",
  noneYet: "None yet",
  markComplete: "Mark complete",
  notFinished: "Didn’t finish",
  noMatches: "No matching profiles",
  available: "Available",
  plans: "Plans",
  payment: "Payment",
  book: "Book",
  desk: "Model desk",
  demoBalance: "Demo balance",
  topUp: "Top up",
  topUpTitle: "Top up credits",
  topUpOther: "Other",
  customAmount: "Custom amount",
  topUpMin: "At least A$50",
  topUpCredit: "Credit to add",
  topUpDue: "Total due",
  topUpPay: (amount) => `Pay ${amount} now`,
  topUpDone: "Added to the demo balance",
  topUpClose: "Done",
  topUpDemo: "Demo. No charge.",
  ahaGuest: "Are you free Thursday evening? I’d like a private dinner.",
  ahaReply:
    "Thursday to Sunday, after dusk, works. A private dinner is fine. Please send the A$100 PayID deposit first (demo). I’ll send contact details once it arrives.",
  ahaSteps: [
    "A guest just sent an inquiry.",
    "The AI is answering in her voice and checking that this is a booking.",
    "The AI is asking the guest for the PayID deposit.",
  ],
  ahaPending: "Deposit pending · PayID A$100 (demo)",
  ahaConfirmed: "Deposit confirmed · PayID A$100 (demo)",
  ahaReceived: "Payment received",
  ahaContactHidden: "The guest’s contact details are still closed",
  ahaContactOpen: "The guest’s contact details are open",
  ahaContact: "0400 000 222 (demo)",
  ahaLedger: "Ledger records the PayID deposit A$100 (demo)",
};

export const copy: Record<Lang, Copy> = { zh, en };

const QUESTIONS: Record<string, string> = {
  "lead-time": "Are you free Thursday evening?",
  "lead-price": "What do you charge tonight?",
  "lead-booked": "I would like a dinner companion.",
};

const DRAFTS: Record<string, string> = {
  "lead-time": "Available: Thursday to Sunday, after dusk.",
  "lead-booked": "Private dinners, event attendance, and quiet trips around the city.",
};

const GUESTS: Record<string, string> = {
  "周宁（演示）": "Zhou Ning (demo)",
  "林可（演示）": "Lin Ke (demo)",
  "陈予安（演示）": "Chen Yu'an (demo)",
};

const ENGINE: Record<string, string> = {
  阅读了档案: "Read the profile",
  "核对了照片、可约时间和收款方式": "Checked photos, availability, and how she is paid",
  发布了主页: "Published the page",
  开始为已邀请的客人匹配: "Started matching guests she already invited",
  核对了可约时间: "Checked availability",
  主页保持可浏览: "The page stays open to browse",
};

const GAPS: Record<string, string> = {
  name: "Add a stage name",
  city: "Choose a city",
  languages: "Choose at least one language",
  services: "Write a few lines about what you offer",
  availability: "Add the times you are free",
  payment: "Add at least one way to be paid",
};

const STATUS: Record<string, string> = {
  PENDING_PAYMENT: "Awaiting payment",
  AWAITING_MODEL_CONFIRM: "Waiting for her to confirm",
  CONFIRMED: "Confirmed",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
  DISPUTED: "Not confirmed",
};

const NOTES: Record<string, string> = {
  已按备注转账: "Transferred with the reference",
  演示询问: "Demo inquiry",
};

const WEEKDAY: Record<string, string> = {
  周一: "Mon",
  周二: "Tue",
  周三: "Wed",
  周四: "Thu",
  周五: "Fri",
  周六: "Sat",
  周日: "Sun",
};

type GapRow = { id: string; suggestion: string };
type InquiryRow = {
  id: string;
  guestName: string;
  question: string;
  draft: string;
  needsConfirm: boolean;
  status: string;
  label: string;
};
type OrderRow = {
  status: string;
  statusLabel: string;
  note: string;
  startsAt: string;
  paymentLabel: string;
};
type EngineRow = { text: string };

export type LocalizableDashboard = {
  badge: string;
  assessment: { gaps: GapRow[] };
  engineLog: EngineRow[];
  inquiries: InquiryRow[];
  awaiting: OrderRow[];
  recent: OrderRow[];
};

function englishGap(gap: GapRow): string {
  const photos = gap.suggestion.match(/再添加 (\d+) 张照片/);
  if (gap.id === "photos" && photos) return `Add ${photos[1]} more photos`;
  return GAPS[gap.id] ?? gap.suggestion;
}

function englishWhen(value: string): string {
  return value.replace(/周[一二三四五六日]/, (day) => WEEKDAY[day] ?? day);
}

function englishInquiry(inquiry: InquiryRow): InquiryRow {
  return {
    ...inquiry,
    guestName: GUESTS[inquiry.guestName] ?? inquiry.guestName,
    question: QUESTIONS[inquiry.id] ?? inquiry.question,
    draft: inquiry.draft ? (DRAFTS[inquiry.id] ?? inquiry.draft) : "",
    label: inquiry.needsConfirm
      ? "Needs you to confirm"
      : inquiry.status === "booked"
        ? "Now a booking"
        : "Drafted",
  };
}

function englishOrder<T extends OrderRow>(order: T): T {
  const paymentLabel = order.paymentLabel === "银行转账" ? "Bank transfer" : order.paymentLabel;
  return {
    ...order,
    statusLabel: STATUS[order.status] ?? order.statusLabel,
    note: NOTES[order.note] ?? order.note,
    startsAt: englishWhen(order.startsAt),
    paymentLabel,
  };
}

type PublicText = {
  slug: string;
  stageName: string;
  city: string;
  languages: string[];
  services: string;
  availability: string;
  bio: string;
  paymentLabels: string[];
};

const PUBLIC_EN: Record<string, Omit<PublicText, "slug">> = {
  wantang: {
    stageName: "Wantang",
    city: "Melbourne",
    languages: ["Chinese", "English"],
    services: "Private dinner company, event attendance, and quiet trips around the city.",
    availability: "Thursday to Sunday, after dusk",
    bio: "Wantang works independently in Melbourne. She keeps evenings for guests she has already invited, for private dinners and quiet trips around the city. Contact details open after she confirms payment.",
    paymentLabels: ["PayID"],
  },
  chengyue: {
    stageName: "Chengyue",
    city: "Sydney",
    languages: ["Chinese", "Cantonese", "English"],
    services: "Travel company, private dinners, and gallery or event attendance.",
    availability: "Wednesday to Saturday, after 4pm",
    bio: "Chengyue works independently in Sydney and only sees guests she has already invited. She joins trips, dinners, and quiet evenings. Contact details open after she confirms payment.",
    paymentLabels: ["Bank transfer"],
  },
  ali: {
    stageName: "Ali",
    city: "Brisbane",
    languages: ["Chinese"],
    services: "",
    availability: "",
    bio: "",
    paymentLabels: [],
  },
};

/** English wording for the seeded public profiles. Stored profiles stay Chinese. */
export function localizePublicProfile<T extends PublicText>(profile: T, lang: Lang): T {
  if (lang !== "en") return profile;
  const translated = PUBLIC_EN[profile.slug];
  if (!translated) return profile;
  return { ...profile, ...translated };
}

/** English is a view of the same dashboard. Stored demo data stays Chinese. */
export function localizeDashboard<T extends LocalizableDashboard>(view: T, lang: Lang): T {
  if (lang === "zh") return view;
  return {
    ...view,
    badge: en.badge,
    assessment: {
      ...view.assessment,
      gaps: view.assessment.gaps.map((gap) => ({ ...gap, suggestion: englishGap(gap) })),
    },
    engineLog: view.engineLog.map((entry) => ({
      ...entry,
      text: ENGINE[entry.text] ?? entry.text,
    })),
    inquiries: view.inquiries.map(englishInquiry),
    awaiting: view.awaiting.map(englishOrder),
    recent: view.recent.map(englishOrder),
  };
}
