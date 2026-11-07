/** Missbunny demo domain. Pure data and transitions; no I/O. */

export const INVITE_CODE = "MB-DEMO";
export const PAYMENT_WINDOW_MS = 30 * 60 * 1000;
export const PHOTO_GOAL = 3;
export const DEMO_USER_ID = "demo-guest";
export const DEMO_USER_NAME = "陈予安";

export const CITIES = ["墨尔本", "悉尼", "布里斯班", "珀斯", "阿德莱德"] as const;
export const LANGUAGES = ["中文", "English", "粤语", "日本語"] as const;
export const BOOKING_SLOTS = ["周四 19:00", "周五 19:30", "周六 18:00", "周日 20:00"] as const;

export type PaymentKind = "payid" | "bank";
export type ContactChannel = "wechat" | "telegram" | "whatsapp" | "sms";
export type Contacts = Partial<Record<ContactChannel, string>>;

export type PaymentMethod = {
  id: string;
  kind: PaymentKind;
  label: string;
  accountName: string;
  reference: string;
};

export type Profile = {
  id: string;
  slug: string;
  stageName: string;
  city: string;
  languages: string[];
  services: string;
  availability: string;
  bio: string;
  photoCount: number;
  paymentMethods: PaymentMethod[];
  contacts: Contacts;
  published: boolean;
  engineStarted: boolean;
};

export type ProfileDraft = {
  stageName: string;
  city: string;
  languages: string[];
  services: string;
  availability: string;
  bio: string;
  photoCount: number;
  paymentMethods: PaymentMethod[];
  contacts: Contacts;
};

export type OrderStatus =
  | "PENDING_PAYMENT"
  | "AWAITING_MODEL_CONFIRM"
  | "CONFIRMED"
  | "COMPLETED"
  | "CANCELLED"
  | "DISPUTED";

export type Order = {
  id: string;
  profileId: string;
  userId: string;
  startsAt: string;
  paymentMethodId: string;
  status: OrderStatus;
  note: string;
  screenshotAttached: boolean;
  createdAt: string;
  updatedAt: string;
};

export type AuditEntry = {
  id: string;
  orderId: string;
  at: string;
  actor: "user" | "model" | "system";
  action: string;
};

export type EngineEntry = {
  id: string;
  profileId: string;
  at: string;
  text: string;
};

export type InquiryTopic = "availability" | "city" | "services" | "price" | "agency";

export type InquiryStatus = "drafted" | "needs_model" | "handed_off" | "booked";

export type Inquiry = {
  id: string;
  profileId: string;
  guestName: string;
  topic: InquiryTopic;
  question: string;
  draft: string;
  needsConfirm: boolean;
  status: InquiryStatus;
  orderId: string;
  at: string;
};

/** Shown on the model's feed. The reply underneath may only quote her profile. */
export const ANSWER_BADGE = "只用你资料里的内容回答，不编";
export const NEEDS_CONFIRM = "需要你确认";

/** Demo monthly cost: model usage in the stated band, plus a tool fee. */
export const MONTHLY_TOKEN = 420;
export const MONTHLY_TOKEN_LOW = 300;
export const MONTHLY_TOKEN_HIGH = 600;
export const MONTHLY_TOOL = 80;
export const MONTHLY_FEE = MONTHLY_TOKEN + MONTHLY_TOOL;

export type Session = {
  role: "user" | "model";
  userId: string;
  userName: string;
  modelId: string;
  inviteAccepted: boolean;
};

export type DemoState = {
  session: Session;
  profiles: Profile[];
  orders: Order[];
  audits: AuditEntry[];
  engineLog: EngineEntry[];
  inquiries: Inquiry[];
};

export type PublicProfile = {
  id: string;
  slug: string;
  stageName: string;
  city: string;
  languages: string[];
  services: string;
  availability: string;
  bio: string;
  photoCount: number;
  paymentLabels: string[];
};

export type Gap = { id: string; suggestion: string };

export type Assessment = { score: number; ready: boolean; gaps: Gap[] };

export type EngineStep = { id: string; text: string };

export type LedgerDay = { date: string; amount: number };

export type OrderView = {
  id: string;
  profileId: string;
  stageName: string;
  city: string;
  startsAt: string;
  status: OrderStatus;
  statusLabel: string;
  note: string;
  screenshotAttached: boolean;
  createdAt: string;
  paymentLabel: string;
  payment: { label: string; accountName: string; reference: string } | null;
  contacts: Contacts | null;
  audits: AuditEntry[];
};

export type ModelChoice = {
  id: string;
  stageName: string;
  city: string;
  engineStarted: boolean;
  published: boolean;
};

const STATUS_LABEL: Record<OrderStatus, string> = {
  PENDING_PAYMENT: "待付款",
  AWAITING_MODEL_CONFIRM: "待确认到账",
  CONFIRMED: "已确认",
  COMPLETED: "已完成",
  CANCELLED: "已取消",
  DISPUTED: "未确认到账",
};

const CONTACT_CHANNELS: ContactChannel[] = ["wechat", "telegram", "whatsapp", "sms"];

export function statusLabel(status: OrderStatus): string {
  return STATUS_LABEL[status];
}

export function emptyDraft(): ProfileDraft {
  return {
    stageName: "",
    city: "",
    languages: ["中文"],
    services: "",
    availability: "",
    bio: "",
    photoCount: 0,
    paymentMethods: [],
    contacts: {},
  };
}

export function draftFromProfile(profile: Profile): ProfileDraft {
  return {
    stageName: profile.stageName,
    city: profile.city,
    languages: [...profile.languages],
    services: profile.services,
    availability: profile.availability,
    bio: profile.bio,
    photoCount: profile.photoCount,
    paymentMethods: profile.paymentMethods.map((method) => ({ ...method })),
    contacts: { ...profile.contacts },
  };
}

export function dayKey(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

function createId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function hash(input: string): number {
  let value = 0;
  for (const char of input) value = (value * 33 + char.charCodeAt(0)) >>> 0;
  return value;
}

export function templateBio(draft: ProfileDraft): string {
  const name = draft.stageName.trim() || "她";
  const city = draft.city.trim() || "澳洲";
  const languages = draft.languages.length > 0 ? draft.languages.join("、") : "中文";
  const when = draft.availability.trim() || "时间由她确认";
  const services = draft.services.trim();
  const serviceLine = services ? `她目前安排：${services}。` : "她只接受已经邀请的私人安排。";
  return `${name}在${city}独立工作，使用${languages}。可约：${when}。${serviceLine}联系方式在她确认收款之后才会开放。`;
}

export function assess(draft: ProfileDraft): Assessment {
  const gaps: Gap[] = [];
  let score = 0;
  if (draft.stageName.trim()) score += 10;
  else gaps.push({ id: "name", suggestion: "填写艺名" });
  if (draft.city.trim()) score += 10;
  else gaps.push({ id: "city", suggestion: "选择所在城市" });
  if (draft.languages.length > 0) score += 10;
  else gaps.push({ id: "languages", suggestion: "至少选择一种语言" });
  if (draft.services.trim().length >= 8) score += 15;
  else gaps.push({ id: "services", suggestion: "用几句话写下服务说明" });
  if (draft.availability.trim()) score += 15;
  else gaps.push({ id: "availability", suggestion: "填写可约时间" });
  if (draft.paymentMethods.length > 0) score += 20;
  else gaps.push({ id: "payment", suggestion: "至少设置一种收款方式" });
  const photosNeeded = Math.max(0, PHOTO_GOAL - draft.photoCount);
  if (photosNeeded === 0) score += 20;
  else gaps.push({ id: "photos", suggestion: `再添加 ${photosNeeded} 张照片` });
  return { score, ready: gaps.length === 0, gaps };
}

export function engineSteps(ready: boolean): EngineStep[] {
  const steps: EngineStep[] = [
    { id: "read", text: "正在阅读档案" },
    { id: "photos", text: "正在核对照片" },
    { id: "availability", text: "正在核对可约时间" },
    { id: "payment", text: "正在核对收款方式" },
    { id: "score", text: ready ? "准备度已满足" : "列出未完成的条件" },
  ];
  if (!ready) return steps;
  steps.push(
    { id: "page", text: "正在生成主页" },
    { id: "publish", text: "正在发布" },
    { id: "match", text: "正在匹配已邀请的客人" },
    { id: "live", text: "引擎已开始为你工作" },
  );
  return steps;
}

export function toPublicProfile(profile: Profile): PublicProfile {
  return {
    id: profile.id,
    slug: profile.slug,
    stageName: profile.stageName,
    city: profile.city,
    languages: profile.languages,
    services: profile.services,
    availability: profile.availability,
    bio: profile.bio,
    photoCount: profile.photoCount,
    paymentLabels: profile.paymentMethods.map((method) => method.label),
  };
}

export function searchProfiles(state: DemoState, query: string): PublicProfile[] {
  const needle = query.trim().toLowerCase();
  return state.profiles
    .filter((profile) => profile.published)
    .filter((profile) => {
      if (!needle) return true;
      const haystack = [
        profile.stageName,
        profile.city,
        profile.languages.join(" "),
        profile.services,
        profile.bio,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(needle);
    })
    .map(toPublicProfile);
}

export function modelChoices(state: DemoState): ModelChoice[] {
  return state.profiles.map((profile) => ({
    id: profile.id,
    stageName: profile.stageName,
    city: profile.city,
    engineStarted: profile.engineStarted,
    published: profile.published,
  }));
}

function cleanDraft(draft: ProfileDraft): ProfileDraft {
  const languages = LANGUAGES.filter((language) => draft.languages.includes(language));
  const city = CITIES.find((item) => item === draft.city.trim()) ?? "";
  const paymentMethods = draft.paymentMethods
    .filter(
      (method) =>
        (method.kind === "payid" || method.kind === "bank") && method.reference.trim().length > 0,
    )
    .slice(0, 4)
    .map((method) => ({
      id: method.id.trim() || createId("pay"),
      kind: method.kind,
      label: method.kind === "payid" ? "PayID" : "银行转账",
      accountName: method.accountName.trim().slice(0, 40) || "收款人",
      reference: method.reference.trim().slice(0, 60),
    }));
  const contacts: Contacts = {};
  for (const channel of CONTACT_CHANNELS) {
    const value = draft.contacts[channel]?.trim().slice(0, 60);
    if (value) contacts[channel] = value;
  }
  return {
    stageName: draft.stageName.trim().slice(0, 40),
    city,
    languages: [...languages],
    services: draft.services.trim().slice(0, 400),
    availability: draft.availability.trim().slice(0, 200),
    bio: draft.bio.trim().slice(0, 800),
    photoCount: Math.max(0, Math.min(8, Math.floor(draft.photoCount) || 0)),
    paymentMethods,
    contacts,
  };
}

function slugFor(state: DemoState, stageName: string): string {
  const base =
    stageName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "")
      .slice(0, 24) || "model";
  let slug = base;
  let salt = 1;
  while (state.profiles.some((profile) => profile.slug === slug)) {
    salt += 1;
    slug = `${base}-${salt}`;
  }
  return slug;
}

export function ledger(
  profile: Profile,
  now = new Date(),
): {
  days: LedgerDay[];
  total: number;
  today: number;
} {
  const amounts = [0, 320, 480, 0, 640, 410, 860];
  const days: LedgerDay[] = [];
  for (let ago = 6; ago >= 0; ago -= 1) {
    const date = new Date(now);
    date.setDate(date.getDate() - ago);
    const key = dayKey(date);
    const picked = amounts[hash(`${profile.id}:${key}`) % amounts.length] ?? 0;
    const amount = profile.engineStarted ? (ago === 0 && picked === 0 ? 640 : picked) : 0;
    days.push({ date: key, amount });
  }
  const total = days.reduce((sum, day) => sum + day.amount, 0);
  return { days, total, today: days.at(-1)?.amount ?? 0 };
}

export function formatAud(amount: number): string {
  return `A$${amount.toLocaleString("en-AU")}`;
}

/** A reply may quote city, services, or availability. Anything else waits for her. */
export function replyFromProfile(
  profile: Pick<Profile, "city" | "services" | "availability">,
  topic: InquiryTopic,
): { draft: string; needsConfirm: boolean } {
  if (topic === "availability" && profile.availability.trim()) {
    return { draft: `可约：${profile.availability.trim()}`, needsConfirm: false };
  }
  if (topic === "city" && profile.city.trim()) {
    return { draft: `在${profile.city.trim()}独立工作。`, needsConfirm: false };
  }
  if (topic === "services" && profile.services.trim().length >= 8) {
    return { draft: profile.services.trim(), needsConfirm: false };
  }
  return { draft: "", needsConfirm: true };
}

export function presentInquiry(inquiry: Inquiry) {
  return {
    id: inquiry.id,
    guestName: inquiry.guestName,
    question: inquiry.question,
    draft: inquiry.needsConfirm ? "" : inquiry.draft,
    needsConfirm: inquiry.needsConfirm,
    status: inquiry.status,
    orderId: inquiry.orderId,
    label: inquiry.needsConfirm
      ? NEEDS_CONFIRM
      : inquiry.status === "booked"
        ? "已变成预约"
        : "已起草",
  };
}

export function pricingQuote(recentIncome: number) {
  return {
    token: MONTHLY_TOKEN,
    tokenLow: MONTHLY_TOKEN_LOW,
    tokenHigh: MONTHLY_TOKEN_HIGH,
    tool: MONTHLY_TOOL,
    monthly: MONTHLY_FEE,
    recentIncome,
  };
}

function profileById(state: DemoState, id: string): Profile | undefined {
  return state.profiles.find((profile) => profile.id === id);
}

function orderById(state: DemoState, id: string): Order | undefined {
  return state.orders.find((order) => order.id === id);
}

export function setRole(
  state: DemoState,
  role: "user" | "model",
  modelId: string,
): DemoState | null {
  if (role === "user") {
    const nextModel = profileById(state, modelId)?.id ?? state.session.modelId;
    return {
      ...state,
      session: {
        ...state.session,
        role,
        modelId: profileById(state, nextModel) ? nextModel : (state.profiles[0]?.id ?? ""),
      },
    };
  }
  if (modelId === "" || modelId === "new") {
    return { ...state, session: { ...state.session, role, modelId: "" } };
  }
  if (!profileById(state, modelId)) return null;
  return { ...state, session: { ...state.session, role, modelId } };
}

export function acceptInvite(state: DemoState, code: string): DemoState | null {
  if (code.trim().toUpperCase() !== INVITE_CODE) return null;
  return { ...state, session: { ...state.session, inviteAccepted: true } };
}

export function applyTimeouts(state: DemoState, now = new Date()): DemoState {
  let next = state;
  for (const order of state.orders) {
    if (order.status !== "PENDING_PAYMENT") continue;
    if (now.getTime() - Date.parse(order.createdAt) < PAYMENT_WINDOW_MS) continue;
    const updated = transition(next, order.id, "CANCELLED", "system", "付款超时，订单取消", now);
    if (updated) next = updated;
  }
  return next;
}

function transition(
  state: DemoState,
  orderId: string,
  status: OrderStatus,
  actor: AuditEntry["actor"],
  action: string,
  now: Date,
  patch: Partial<Pick<Order, "note" | "screenshotAttached">> = {},
): DemoState | null {
  const order = orderById(state, orderId);
  if (!order) return null;
  const updated: Order = {
    ...order,
    ...patch,
    status,
    updatedAt: now.toISOString(),
  };
  const audit: AuditEntry = {
    id: createId("audit"),
    orderId,
    at: now.toISOString(),
    actor,
    action,
  };
  return {
    ...state,
    orders: state.orders.map((item) => (item.id === orderId ? updated : item)),
    audits: [...state.audits, audit],
  };
}

function canUser(state: DemoState, order: Order): boolean {
  return state.session.role === "user" && state.session.userId === order.userId;
}

function canModel(state: DemoState, order: Order): boolean {
  return state.session.role === "model" && state.session.modelId === order.profileId;
}

export function createOrder(
  state: DemoState,
  input: { slug: string; startsAt: string; paymentMethodId: string; code?: string },
  now = new Date(),
): { ok: true; state: DemoState; orderId: string } | { ok: false; error: string } {
  if (state.session.role !== "user") return { ok: false, error: "请以客人身份预约" };
  let next = state;
  if (!next.session.inviteAccepted) {
    const accepted = input.code ? acceptInvite(next, input.code) : null;
    if (!accepted) return { ok: false, error: "需要邀请码" };
    next = accepted;
  }
  const profile = next.profiles.find((item) => item.slug === input.slug && item.published);
  if (!profile) return { ok: false, error: "找不到可预约的主页" };
  const method = profile.paymentMethods.find((item) => item.id === input.paymentMethodId);
  if (!method) return { ok: false, error: "请选择她配置的收款方式" };
  const startsAt = input.startsAt.trim().slice(0, 40);
  if (!startsAt) return { ok: false, error: "请选择时间" };
  const order: Order = {
    id: createId("order"),
    profileId: profile.id,
    userId: next.session.userId,
    startsAt,
    paymentMethodId: method.id,
    status: "PENDING_PAYMENT",
    note: "",
    screenshotAttached: false,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  };
  const audit: AuditEntry = {
    id: createId("audit"),
    orderId: order.id,
    at: now.toISOString(),
    actor: "user",
    action: "创建订单",
  };
  return {
    ok: true,
    orderId: order.id,
    state: { ...next, orders: [...next.orders, order], audits: [...next.audits, audit] },
  };
}

export function markPaid(
  state: DemoState,
  orderId: string,
  input: { note?: string; screenshotAttached?: boolean },
  now = new Date(),
): DemoState | null {
  const order = orderById(state, orderId);
  if (!order || !canUser(state, order) || order.status !== "PENDING_PAYMENT") return null;
  return transition(state, orderId, "AWAITING_MODEL_CONFIRM", "user", "客人表示已付款", now, {
    note: (input.note ?? "").trim().slice(0, 200),
    screenshotAttached: Boolean(input.screenshotAttached),
  });
}

export function confirmReceived(
  state: DemoState,
  orderId: string,
  now = new Date(),
): DemoState | null {
  const order = orderById(state, orderId);
  if (!order || !canModel(state, order) || order.status !== "AWAITING_MODEL_CONFIRM") return null;
  return transition(state, orderId, "CONFIRMED", "model", "模特确认到账", now);
}

export function disputeOrder(
  state: DemoState,
  orderId: string,
  now = new Date(),
): DemoState | null {
  const order = orderById(state, orderId);
  if (!order || !canModel(state, order) || order.status !== "AWAITING_MODEL_CONFIRM") return null;
  return transition(state, orderId, "DISPUTED", "model", "模特表示未收到", now);
}

export function simulateTimeout(
  state: DemoState,
  orderId: string,
  now = new Date(),
): DemoState | null {
  const order = orderById(state, orderId);
  if (!order) return null;
  if (order.status !== "PENDING_PAYMENT") return null;
  if (!canUser(state, order) && !canModel(state, order)) return null;
  return transition(state, orderId, "CANCELLED", "user", "付款超时，订单取消", now);
}

export function completeOrder(
  state: DemoState,
  orderId: string,
  now = new Date(),
): DemoState | null {
  const order = orderById(state, orderId);
  if (!order || !canModel(state, order) || order.status !== "CONFIRMED") return null;
  return transition(state, orderId, "COMPLETED", "model", "订单完成", now);
}

export function presentOrder(state: DemoState, order: Order, detail: boolean): OrderView | null {
  if (!canUser(state, order) && !canModel(state, order)) return null;
  const profile = profileById(state, order.profileId);
  const method = profile?.paymentMethods.find((item) => item.id === order.paymentMethodId);
  const released =
    canUser(state, order) && (order.status === "CONFIRMED" || order.status === "COMPLETED");
  return {
    id: order.id,
    profileId: order.profileId,
    stageName: profile?.stageName ?? "",
    city: profile?.city ?? "",
    startsAt: order.startsAt,
    status: order.status,
    statusLabel: statusLabel(order.status),
    note: order.note,
    screenshotAttached: order.screenshotAttached,
    createdAt: order.createdAt,
    paymentLabel: method?.label ?? "",
    payment:
      detail && method
        ? { label: method.label, accountName: method.accountName, reference: method.reference }
        : null,
    contacts: released && profile ? { ...profile.contacts } : null,
    audits: detail ? state.audits.filter((entry) => entry.orderId === order.id) : [],
  };
}

export function listOrders(state: DemoState): OrderView[] {
  return state.orders
    .filter((order) => canUser(state, order) || canModel(state, order))
    .sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt))
    .flatMap((order) => {
      const view = presentOrder(state, order, false);
      return view ? [view] : [];
    });
}

export function commitEngine(
  state: DemoState,
  draft: ProfileDraft,
  now = new Date(),
):
  | { ok: true; state: DemoState; profileId: string; assessment: Assessment }
  | { ok: false; error: string } {
  if (state.session.role !== "model") return { ok: false, error: "请以模特身份继续" };
  const cleaned = cleanDraft(draft);
  if (!cleaned.bio) cleaned.bio = templateBio(cleaned);
  const assessment = assess(cleaned);
  const existing = state.session.modelId ? profileById(state, state.session.modelId) : undefined;
  const profile: Profile = existing
    ? {
        ...existing,
        ...cleaned,
        published: assessment.ready,
        engineStarted: assessment.ready,
      }
    : {
        id: createId("model"),
        slug: slugFor(state, cleaned.stageName),
        ...cleaned,
        published: assessment.ready,
        engineStarted: assessment.ready,
      };
  const profiles = existing
    ? state.profiles.map((item) => (item.id === profile.id ? profile : item))
    : [...state.profiles, profile];
  const engineLog = assessment.ready
    ? [
        ...state.engineLog,
        ...[
          "阅读了档案",
          "核对了照片、可约时间和收款方式",
          "发布了主页",
          "开始为已邀请的客人匹配",
        ].map((text) => ({
          id: createId("engine"),
          profileId: profile.id,
          at: now.toISOString(),
          text,
        })),
      ]
    : state.engineLog.filter((entry) => entry.profileId !== profile.id);
  return {
    ok: true,
    profileId: profile.id,
    assessment,
    state: {
      ...state,
      profiles,
      engineLog,
      session: { ...state.session, role: "model", modelId: profile.id },
    },
  };
}

export function checkout(
  state: DemoState,
  slug: string,
): {
  profile: PublicProfile;
  needsInvite: boolean;
  methods: PaymentMethod[];
} | null {
  const profile = state.profiles.find((item) => item.slug === slug && item.published);
  if (!profile) return null;
  return {
    profile: toPublicProfile(profile),
    needsInvite: !state.session.inviteAccepted,
    methods: state.session.inviteAccepted
      ? profile.paymentMethods.map((method) => ({ ...method }))
      : [],
  };
}

export function ownProfile(state: DemoState): Profile | null {
  if (state.session.role !== "model" || !state.session.modelId) return null;
  const profile = profileById(state, state.session.modelId);
  return profile
    ? {
        ...profile,
        contacts: { ...profile.contacts },
        paymentMethods: profile.paymentMethods.map((method) => ({ ...method })),
      }
    : null;
}

function ownInquiry(state: DemoState, id: string): Inquiry | undefined {
  if (state.session.role !== "model") return undefined;
  return state.inquiries.find(
    (inquiry) => inquiry.id === id && inquiry.profileId === state.session.modelId,
  );
}

/** She has seen a question the profile cannot answer. The draft stays empty. */
export function acknowledgeInquiry(state: DemoState, id: string): DemoState | null {
  const inquiry = ownInquiry(state, id);
  if (!inquiry) return null;
  if (inquiry.status !== "needs_model") return null;
  return {
    ...state,
    inquiries: state.inquiries.map((item) =>
      item.id === id ? { ...item, status: "handed_off", draft: "", needsConfirm: true } : item,
    ),
  };
}

/** Turns a simulated inquiry into a pending booking. Contacts stay off the order. */
export function bookInquiry(
  state: DemoState,
  id: string,
  now = new Date(),
): { ok: true; state: DemoState; orderId: string } | { ok: false; error: string } {
  const inquiry = ownInquiry(state, id);
  if (!inquiry) return { ok: false, error: "找不到这条询问" };
  if (inquiry.needsConfirm && inquiry.status === "needs_model") {
    return { ok: false, error: NEEDS_CONFIRM };
  }
  if (inquiry.status === "booked") return { ok: false, error: "已经变成预约" };
  const profile = profileById(state, inquiry.profileId);
  const method = profile?.paymentMethods[0];
  if (!profile || !method) return { ok: false, error: "至少设置一种收款方式" };
  const order: Order = {
    id: createId("order"),
    profileId: profile.id,
    userId: DEMO_USER_ID,
    startsAt: "周四 19:00",
    paymentMethodId: method.id,
    status: "PENDING_PAYMENT",
    note: "演示询问",
    screenshotAttached: false,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  };
  const audit: AuditEntry = {
    id: createId("audit"),
    orderId: order.id,
    at: now.toISOString(),
    actor: "model",
    action: "询问交给预约",
  };
  return {
    ok: true,
    orderId: order.id,
    state: {
      ...state,
      orders: [...state.orders, order],
      audits: [...state.audits, audit],
      inquiries: state.inquiries.map((item) =>
        item.id === id ? { ...item, status: "booked", orderId: order.id } : item,
      ),
    },
  };
}

export function dashboard(state: DemoState, now = new Date()) {
  const profile = ownProfile(state);
  if (!profile) return null;
  const assessment = assess(draftFromProfile(profile));
  const today = dayKey(now);
  const books = ledger(profile, now);
  return {
    profile,
    assessment,
    ledger: books,
    pricing: pricingQuote(books.total),
    heldLabel: profile.paymentMethods[0]?.label ?? "",
    badge: ANSWER_BADGE,
    engineLog: state.engineLog.filter(
      (entry) => entry.profileId === profile.id && dayKey(new Date(entry.at)) === today,
    ),
    inquiries: state.inquiries
      .filter((inquiry) => inquiry.profileId === profile.id)
      .map(presentInquiry),
    awaiting: listOrders(state).filter((order) => order.status === "AWAITING_MODEL_CONFIRM"),
    recent: listOrders(state).filter((order) => order.status !== "AWAITING_MODEL_CONFIRM"),
  };
}
