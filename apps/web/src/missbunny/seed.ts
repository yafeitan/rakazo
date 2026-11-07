import type { AuditEntry, DemoState, EngineEntry, Order, Profile } from "./domain.js";
import { DEMO_USER_ID, DEMO_USER_NAME } from "./domain.js";

export const PRIVATE_MARKERS = [
  "wx-wantang-private",
  "tg-wantang-private",
  "wa-wantang-private",
  "0400000001",
  "payid-wantang-private",
  "wx-chengyue-private",
  "bank-chengyue-private",
  "wx-ali-private",
] as const;

function lines(profileId: string, texts: string[], at: string): EngineEntry[] {
  return texts.map((text, index) => ({
    id: `engine-${profileId}-${index}`,
    profileId,
    at,
    text,
  }));
}

/** Fictional people and contacts. Nothing here is a real account. */
export function seedState(now = new Date()): DemoState {
  const at = now.toISOString();
  const ago = (minutes: number) => new Date(now.getTime() - minutes * 60_000).toISOString();
  const wantang: Profile = {
    id: "wantang",
    slug: "wantang",
    stageName: "晚棠",
    city: "墨尔本",
    languages: ["中文", "English"],
    services: "私人晚宴陪同、活动出席、安静的城市随行。",
    availability: "周四至周日，傍晚之后",
    bio: "晚棠在墨尔本独立工作。她把晚上留给已经邀请的客人，陪同私人晚宴和安静的城市出行。联系方式在确认收款后开放。",
    photoCount: 4,
    paymentMethods: [
      {
        id: "pay-wantang",
        kind: "payid",
        label: "PayID",
        accountName: "晚棠",
        reference: "payid-wantang-private",
      },
    ],
    contacts: {
      wechat: "wx-wantang-private",
      telegram: "tg-wantang-private",
      whatsapp: "wa-wantang-private",
      sms: "0400000001",
    },
    published: true,
    engineStarted: true,
  };
  const chengyue: Profile = {
    id: "chengyue",
    slug: "chengyue",
    stageName: "澄月",
    city: "悉尼",
    languages: ["中文", "粤语", "English"],
    services: "出差随行、私人晚宴、画廊与活动出席。",
    availability: "周三至周六，下午四点后",
    bio: "澄月在悉尼独立工作，只见已经邀请的客人。她陪同出差、晚宴和安静的夜间活动。联系方式在确认收款后开放。",
    photoCount: 3,
    paymentMethods: [
      {
        id: "pay-chengyue",
        kind: "bank",
        label: "银行转账",
        accountName: "澄月",
        reference: "bank-chengyue-private",
      },
    ],
    contacts: { wechat: "wx-chengyue-private", telegram: "tg-chengyue-private" },
    published: true,
    engineStarted: true,
  };
  const ali: Profile = {
    id: "ali",
    slug: "ali",
    stageName: "阿梨",
    city: "布里斯班",
    languages: ["中文"],
    services: "",
    availability: "",
    bio: "",
    photoCount: 1,
    paymentMethods: [],
    contacts: { wechat: "wx-ali-private" },
    published: false,
    engineStarted: false,
  };
  const orders: Order[] = [
    {
      id: "order-pending",
      profileId: "wantang",
      userId: DEMO_USER_ID,
      startsAt: "周五 19:30",
      paymentMethodId: "pay-wantang",
      status: "PENDING_PAYMENT",
      note: "",
      screenshotAttached: false,
      createdAt: ago(8),
      updatedAt: ago(8),
    },
    {
      id: "order-awaiting",
      profileId: "wantang",
      userId: DEMO_USER_ID,
      startsAt: "周六 18:00",
      paymentMethodId: "pay-wantang",
      status: "AWAITING_MODEL_CONFIRM",
      note: "已按备注转账",
      screenshotAttached: true,
      createdAt: ago(40),
      updatedAt: ago(12),
    },
    {
      id: "order-confirmed",
      profileId: "wantang",
      userId: DEMO_USER_ID,
      startsAt: "周四 19:00",
      paymentMethodId: "pay-wantang",
      status: "CONFIRMED",
      note: "",
      screenshotAttached: false,
      createdAt: ago(180),
      updatedAt: ago(90),
    },
  ];
  const audits: AuditEntry[] = [
    {
      id: "audit-pending",
      orderId: "order-pending",
      at: ago(8),
      actor: "user",
      action: "创建订单",
    },
    {
      id: "audit-awaiting-create",
      orderId: "order-awaiting",
      at: ago(40),
      actor: "user",
      action: "创建订单",
    },
    {
      id: "audit-awaiting-paid",
      orderId: "order-awaiting",
      at: ago(12),
      actor: "user",
      action: "客人表示已付款",
    },
    {
      id: "audit-confirmed",
      orderId: "order-confirmed",
      at: ago(90),
      actor: "model",
      action: "模特确认到账",
    },
  ];
  return {
    session: {
      role: "user",
      userId: DEMO_USER_ID,
      userName: DEMO_USER_NAME,
      modelId: "wantang",
      inviteAccepted: false,
    },
    profiles: [wantang, chengyue, ali],
    orders,
    audits,
    engineLog: [
      ...lines(
        "wantang",
        ["阅读了档案", "发布了主页", "把一位预约放进待确认", "更新了账本"],
        at,
      ),
      ...lines("chengyue", ["核对了可约时间", "主页保持可浏览"], at),
    ],
  };
}
