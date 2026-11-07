/** Mock records for the operations demo. Nothing here is a live account. */

export type Lang = "zh" | "en";

export type AgentId = "reception" | "records" | "promo" | "payments";

export type AgentStatus = "working" | "waiting" | "idle";

export type DraftTag = "可一键发" | "需本人回复";

export type TaskStatus = "排队" | "执行中" | "完成" | "等批";

export type GuestId = "jason" | "ajie" | "leo" | "tom";

export const PAYEE_NAME = "晚棠";

export const PAYID_ACCOUNT = "wantang@example.com";

export const PUBLIC_PROFILE_URL = "https://mrlootbox.com/models/wantang";

export const COLLECTED_CENTS = 245000;

export const STARTING_POINTS = 120;

export type Draft = {
  id: string;
  agentId: AgentId;
  guestId: GuestId | null;
  tag: DraftTag;
  body: string;
  state: "open" | "done";
  confirmed: boolean;
  edited: boolean;
};

export type ChatMessage = {
  id: string;
  role: "guest" | "her";
  text: string;
  /** Guest column hides her line until this time. 0 means already visible. */
  guestVisibleAt: number;
};

export type DemoBot = {
  id: string;
  name: string;
  role: string;
  sceneId: string | null;
  status: string;
  modelSummary: string;
  skillSummary: string;
  description: string;
};

export type DemoMemory = { id: string; text: string; source: string };

export type DemoSkill = { id: string; name: string; summary: string };

export type DemoRoutine = { id: string; name: string; trigger: string; summary: string };

export type DemoTool = { id: string; name: string; status: string; summary: string };

export type DemoComputer = { id: string; name: string; status: string; summary: string };

export type DemoGuest = {
  id: GuestId;
  name: string;
  when: string;
  duration: string;
  place: string;
  budget: string;
  source: string;
  trust: string;
  paid: boolean;
};

export type TaskCard = {
  id: string;
  agent: string;
  title: string;
  status: TaskStatus;
  step: number;
  total: number;
  outputRef: string;
  output: string;
};

export const AGENT_ORDER: AgentId[] = ["reception", "records", "promo", "payments"];

export function tx(lang: Lang, zh: string, en: string): string {
  return lang === "en" ? en : zh;
}

export function agentName(id: AgentId, lang: Lang): string {
  const names: Record<AgentId, [string, string]> = {
    reception: ["接待", "Reception"],
    records: ["档案", "Records"],
    promo: ["推广", "Promotion"],
    payments: ["收款", "Payments"],
  };
  const pair = names[id];
  return lang === "en" ? pair[1] : pair[0];
}

export function statusLabel(status: AgentStatus, lang: Lang): string {
  if (status === "working") return tx(lang, "在做", "Working");
  if (status === "waiting") return tx(lang, "等她确认", "Waiting for her");
  return tx(lang, "空闲", "Idle");
}

export function canSend(draft: Pick<Draft, "tag" | "confirmed" | "edited">): boolean {
  if (draft.tag === "可一键发") return true;
  return draft.confirmed || draft.edited;
}

/** 3–12 seconds. Longer drafts wait longer. `random` is 0–1. */
export function typingDelayMs(text: string, random = Math.random()): number {
  const span = 3000 + Math.min(7000, text.length * 40);
  const jitter = Math.floor(random * 2000);
  return Math.min(12000, Math.max(3000, span + jitter - 1000));
}

export function formatAud(cents: number): string {
  const amount = cents / 100;
  const text = Number.isInteger(amount) ? String(amount) : amount.toFixed(2);
  return `A$${text.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
}

export function pendingCount(drafts: Draft[], paymentPending: boolean): number {
  const draftsWaiting = drafts.filter(
    (draft) => draft.state === "open" && draft.tag === "需本人回复",
  ).length;
  return draftsWaiting + (paymentPending ? 1 : 0);
}

export function agentStatus(id: AgentId, drafts: Draft[], paymentPending: boolean): AgentStatus {
  const open = drafts.filter((draft) => draft.agentId === id && draft.state === "open");
  if (id === "payments") return paymentPending ? "waiting" : "idle";
  if (id === "records") return "working";
  if (id === "promo") return open.length > 0 ? "waiting" : "idle";
  if (open.some((draft) => draft.tag === "需本人回复")) return "waiting";
  if (open.length > 0) return "working";
  return "idle";
}

export function agentLine(id: AgentId, drafts: Draft[], lang: Lang): string {
  const status = agentStatus(id, drafts, false);
  if (id === "reception" && status === "waiting") {
    return tx(lang, "砍价和定金等她拍板", "Price and deposit are waiting on her");
  }
  if (id === "reception") return tx(lang, "在回档期", "Answering availability");
  if (id === "records") return tx(lang, "在整理 Leo 的档案", "Updating Leo's file");
  if (id === "promo" && status === "waiting") {
    return tx(lang, "周五晚的动态等她确认", "Friday's post is waiting on her");
  }
  if (id === "promo") return tx(lang, "没有待发的动态", "Nothing queued");
  return tx(lang, "没有待核对的付款", "No payment to check");
}

export const seedBots: DemoBot[] = [
  {
    id: "chief",
    name: "总管",
    role: "协调",
    sceneId: null,
    status: "空闲",
    modelSummary: "已配置的模型",
    skillSummary: "把活分下去",
    description: "运营 OS 的协调 bot。场景里的四个角色不是上限。",
  },
  {
    id: "reception",
    name: "接待",
    role: "起草",
    sceneId: "missbunny",
    status: "等她确认",
    modelSummary: "已配置的模型",
    skillSummary: "用她的口吻回档期和价格",
    description: "客人看到的句子由她发出。",
  },
  {
    id: "records",
    name: "档案",
    role: "建档",
    sceneId: "missbunny",
    status: "在做",
    modelSummary: "已配置的模型",
    skillSummary: "汇总时间、地点、预算和信誉",
    description: "信誉差时才要她决定接不接。",
  },
  {
    id: "promo",
    name: "推广",
    role: "起草",
    sceneId: "missbunny",
    status: "等她确认",
    modelSummary: "已配置的模型",
    skillSummary: "写动态，发出前等她点头",
    description: "每条推广都先停在她这里。",
  },
  {
    id: "payments",
    name: "收款",
    role: "核对",
    sceneId: "missbunny",
    status: "空闲",
    modelSummary: "已配置的模型",
    skillSummary: "核对到账，再解锁私域",
    description: "不发起真实扣款。",
  },
  {
    id: "watch",
    name: "巡检",
    role: "只读",
    sceneId: null,
    status: "空闲",
    modelSummary: "待确认",
    skillSummary: "只读检查，未接入",
    description: "真实任务未接。这里只留入口。",
  },
];

export const seedMemories: DemoMemory[] = [
  { id: "m1", text: "晚棠只在悉尼和墨尔本见客。", source: "档案" },
  { id: "m2", text: "定了又取消，定金不退，除非她本人改口。", source: "接待" },
  { id: "m3", text: "砍价、犹豫、特殊要求都先交给她。", source: "接待" },
];

export const seedSkills: DemoSkill[] = [
  { id: "s1", name: "用她的口吻回档期", summary: "先答有没有空，再问时间。不提自己是谁在写。" },
  { id: "s2", name: "核对一笔到账", summary: "对照户名和金额。对上了才解锁。" },
];

export const seedRoutines: DemoRoutine[] = [
  {
    id: "r1",
    name: "每天的工作摘要",
    trigger: "21:30 Australia/Melbourne",
    summary: "汇总待确认和到账。不会真的发送。",
  },
  {
    id: "r2",
    name: "见面前提醒",
    trigger: "见面时间减 2 小时",
    summary: "Tom 周六 20:00，18:00 提醒她看一眼。",
  },
];

export const seedTools: DemoTool[] = [
  { id: "t1", name: "目录站点", status: "未连接", summary: "待确认。不采集凭据。" },
  { id: "t2", name: "短信", status: "未连接", summary: "待确认。不会发短信。" },
  { id: "t3", name: "日历", status: "未连接", summary: "待确认。档期只在这台演示里。" },
];

export const seedComputers: DemoComputer[] = [
  { id: "c1", name: "共享电脑", status: "未启动", summary: "待确认。不会打开真实环境。" },
  { id: "c2", name: "私人电脑", status: "未启动", summary: "待确认。" },
];

export const seedGuests: DemoGuest[] = [
  {
    id: "jason",
    name: "Jason",
    when: "周五晚",
    duration: "未定",
    place: "悉尼",
    budget: "未说",
    source: "mrlootbox.com",
    trust: "无不良记录",
    paid: false,
  },
  {
    id: "ajie",
    name: "阿杰",
    when: "未定",
    duration: "2 小时",
    place: "悉尼",
    budget: "想低于 A$1,100",
    source: "mrlootbox.com",
    trust: "无不良记录",
    paid: false,
  },
  {
    id: "leo",
    name: "Leo",
    when: "未定",
    duration: "未定",
    place: "悉尼",
    budget: "在问定金",
    source: "mrlootbox.com",
    trust: "无爽约，问能不能退",
    paid: false,
  },
  {
    id: "tom",
    name: "Tom",
    when: "周六 20:00",
    duration: "1 小时",
    place: "悉尼",
    budget: "A$600 已付",
    source: "mrlootbox.com",
    trust: "已付款",
    paid: true,
  },
];

export const seedMessages: Record<GuestId, ChatMessage[]> = {
  jason: [{ id: "j1", role: "guest", text: "这周五晚上有空吗？", guestVisibleAt: 0 }],
  ajie: [{ id: "a1", role: "guest", text: "两小时 1100，能不能少一点？", guestVisibleAt: 0 }],
  leo: [{ id: "l1", role: "guest", text: "定金能退吗？", guestVisibleAt: 0 }],
  tom: [
    { id: "t1", role: "guest", text: "周六晚上见。", guestVisibleAt: 0 },
    { id: "t2", role: "her", text: "周六晚上见。到了我发你位置。", guestVisibleAt: 0 },
  ],
};

export const seedDrafts: Draft[] = [
  {
    id: "d-jason",
    agentId: "reception",
    guestId: "jason",
    tag: "可一键发",
    body: "周五晚有的，悉尼。你想约几点？",
    state: "open",
    confirmed: false,
    edited: false,
  },
  {
    id: "d-ajie",
    agentId: "reception",
    guestId: "ajie",
    tag: "需本人回复",
    body: "两小时就这个数。再少我排不开。你定了我就留。",
    state: "open",
    confirmed: false,
    edited: false,
  },
  {
    id: "d-leo",
    agentId: "reception",
    guestId: "leo",
    tag: "需本人回复",
    body: "定了又取消，定金不退。你要是还不确定，先别付。",
    state: "open",
    confirmed: false,
    edited: false,
  },
  {
    id: "d-promo",
    agentId: "promo",
    guestId: null,
    tag: "需本人回复",
    body: "本周五晚有空档",
    state: "open",
    confirmed: false,
    edited: false,
  },
];

export const seedTasks: TaskCard[] = [
  {
    id: "live-reception",
    agent: "接待",
    title: "回复 Jason 的档期",
    status: "执行中",
    step: 2,
    total: 3,
    outputRef: "out-jason",
    output: "周五晚有的，悉尼。你想约几点？",
  },
  {
    id: "live-records",
    agent: "档案",
    title: "整理 Leo 的档案",
    status: "完成",
    step: 2,
    total: 2,
    outputRef: "out-leo",
    output: "客人 Leo\n来源 mrlootbox.com\n问题 定金能退吗\n信誉 无爽约",
  },
  {
    id: "promo-friday",
    agent: "推广",
    title: "写周末推送草稿",
    status: "等批",
    step: 4,
    total: 4,
    outputRef: "out-promo",
    output: "本周五晚有空档",
  },
  {
    id: "pay-tom",
    agent: "收款",
    title: "核对 Tom 的到账",
    status: "排队",
    step: 1,
    total: 3,
    outputRef: "out-tom",
    output: "1 看到付款通知\n2 对照户名 晚棠\n3 金额 A$600",
  },
];

export const PRICE_CENTS: Record<string, number> = {
  "1小时": 60000,
  "2小时": 110000,
  过夜: 240000,
};

export function tomSummary(lang: Lang): string {
  return tx(
    lang,
    "Tom，周六 20:00，悉尼，1 小时，A$600。",
    "Tom, Sat 20:00, Sydney, 1 hour, A$600.",
  );
}

export function tomReminder(lang: Lang): string {
  return tx(lang, "见面两小时前再看一眼。", "Look again two hours before.");
}

export function timelineSeed(lang: Lang): string[] {
  return [
    tx(lang, "接待接到 Jason 的档期问题", "Reception took Jason's availability question"),
    tx(lang, "档案记下 Leo 在问定金", "Records noted Leo asked about the deposit"),
    tx(lang, "Tom 已解锁，转她私域", "Tom is unlocked, moved to her private channels"),
  ];
}

const GUEST_FORBIDDEN = /\b(bot|bots|agent|agents|ai|assistant)\b|机器人|助理|人工智能/i;

export function guestCopyLeak(text: string): boolean {
  return GUEST_FORBIDDEN.test(text);
}
