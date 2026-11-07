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
  bookHeading: (name: string) => string;
  bookDepositNote: string;
  bookPhoneNote: string;
  fieldTime: string;
  fieldPhone: string;
  phonePlaceholder: string;
  createOrderLabel: string;
  pageMissing: string;
  noBookings: string;
  orderMissing: string;
  guestPhoneLine: (phone: string) => string;
  depositDue: (amount: string, label: string) => string;
  noDeposit: string;
  fieldNote: string;
  attachShot: string;
  iPaid: string;
  waitingConfirm: string;
  contactsReleased: string;
  channelWechat: string;
  channelSms: string;
  record: string;
  demoMenu: string;
  simulateTimeout: string;
  desk: string;
  fieldName: string;
  fieldCity: string;
  fieldWhen: string;
  fieldServices: string;
  fieldPay: string;
  stillNeed: (list: string) => string;
  needBind: (list: string) => string;
  openingDesk: string;
  bindX: string;
  boundX: string;
  bindIvy: string;
  boundIvy: string;
  bindCatch: string;
  boundCatch: string;
  bindRequired: string;
  bindOptional: string;
  marketRule: string;
  publicLink: string;
  workNow: string;
  workSteps: readonly string[];
  seedBanner: string;
  seedLink: string;
  agentsLabel: string;
  agentGuest: string;
  agentFile: string;
  agentPush: string;
  agentPay: string;
  statusWorking: string;
  statusWaiting: string;
  statusIdle: string;
  awaitingCount: string;
  confirmPush: string;
  pushDraft: string;
  guestSteps: readonly string[];
  fileSteps: readonly string[];
  pushSteps: readonly string[];
  paySteps: readonly string[];
  guestSees: string;
  typingNow: string;
  oneTap: string;
  needsHer: string;
  sendReply: string;
  editDraft: string;
  confirmMine: string;
  unlocked: string;
  paidReminder: string;
  helperWho: string;
  collected: string;
  pendingDeposits: string;
  usage: (count: number) => string;
  feed: string;
  todayDid: string;
  updateProfile: string;
  adjustSchedule: string;
  push: string;
  profileSaved: string;
  scheduleSaved: string;
  pushed: string;
  guestAsk: string;
  agentReply: (draft: { availability: string; services: string; payment: string }) => string;
  agentDeposit: (payment: string) => string;
  guestArrived: string;
  replied: string;
  startedWork: string;
  qualified: string;
  askedDeposit: string;
  depositRecorded: string;
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
  bookHeading: (name) => `预约 ${name}`,
  bookDepositNote: "需要 PayID 订金（演示）",
  bookPhoneNote: "留下电话即可预约（演示）",
  fieldTime: "时间",
  fieldPhone: "电话",
  phonePlaceholder: "04xx（演示）",
  createOrderLabel: "生成订单",
  pageMissing: "找不到主页",
  noBookings: "还没有预约",
  orderMissing: "找不到订单",
  guestPhoneLine: (phone) => `电话 ${phone}`,
  depositDue: (amount, label) => `订金 ${amount}（演示）· ${label}`,
  noDeposit: "未收订金",
  fieldNote: "备注",
  attachShot: "附上截图",
  iPaid: "我已付款",
  waitingConfirm: "等待她确认到账。",
  contactsReleased: "她确认收款了",
  channelWechat: "微信",
  channelSms: "短信",
  record: "记录",
  demoMenu: "演示",
  simulateTimeout: "模拟超时",
  desk: "运营",
  fieldName: "艺名",
  fieldCity: "城市",
  fieldWhen: "可约",
  fieldServices: "安排",
  fieldPay: "收款方式",
  stillNeed: (list) => `还要填写${list}`,
  needBind: (list) => `还要绑定${list}`,
  openingDesk: "正在打开工作台",
  bindX: "绑定 X（演示）",
  boundX: "X 已绑定（演示）",
  bindIvy: "绑定 Ivy（演示）",
  boundIvy: "Ivy 已绑定（演示）",
  bindCatch: "绑定 Catch（演示）",
  boundCatch: "Catch 已绑定（演示）",
  bindRequired: "必选",
  bindOptional: "可选",
  marketRule: "中文市场要绑定 Catch 和 X。",
  publicLink: "她的公开链接",
  workNow: "AI 正在做",
  workSteps: [
    "正在读她的档案",
    "正在把公开主页写到 mrlootbox.com",
    "正在准备今天的 X 帖子草稿",
    "正在查看 Catch 和 X 的询问",
    "起草回复",
    "等她确认",
    "整理已付客人资料",
    "正在安排下一次推送",
  ],
  seedBanner: "这是演示模特，还没走入驻。",
  seedLink: "去入驻",
  agentsLabel: "员工",
  agentGuest: "接待",
  agentFile: "档案",
  agentPush: "推广",
  agentPay: "收款",
  statusWorking: "在做",
  statusWaiting: "等她确认",
  statusIdle: "空闲",
  awaitingCount: "待确认",
  confirmPush: "确认推送",
  pushDraft: "今晚可约。私人晚宴。",
  guestSteps: ["起草回复", "等她确认", "正在看下一条询问"],
  fileSteps: ["正在读她的档案", "正在把公开主页写到 mrlootbox.com", "正在更新今天的时间"],
  pushSteps: ["正在准备今天的 X 帖子草稿", "正在安排下一次推送"],
  paySteps: ["正在核对 PayID", "整理已付客人资料"],
  guestSees: "客人看到的",
  typingNow: "正在输入…",
  oneTap: "可一键发",
  needsHer: "需本人回复",
  sendReply: "发送",
  editDraft: "改一下",
  confirmMine: "本人确认",
  unlocked: "已解锁，转她私域（短信/WhatsApp/微信）",
  paidReminder: "这位客人已付款，加他",
  helperWho: "演示客人 · 0400 000 222（演示）",
  collected: "本月已收",
  pendingDeposits: "待收订金",
  usage: (count) => `今日用量 ${count}`,
  feed: "正在进行",
  todayDid: "今天 AI 做的",
  updateProfile: "更新档案",
  adjustSchedule: "调整时间",
  push: "推一次",
  profileSaved: "档案已更新（演示）",
  scheduleSaved: "可约时间已调整（演示）",
  pushed: "已按目标推了一次（演示）",
  guestAsk: "现在有空吗？想约一次。",
  agentReply: (draft) =>
    `${draft.availability}可以。${draft.services}。请用${draft.payment}付 A$100 订金（演示）。到账后发联系方式。`,
  agentDeposit: (payment) => `正在请客人用${payment}付订金。`,
  guestArrived: "收到一条询问",
  replied: "用她的口吻回复了",
  startedWork: "开始干活",
  qualified: "确认这是一次预约",
  askedDeposit: "向客人要了订金",
  depositRecorded: "订金已入账",
  demoBalance: "剩余点数",
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
  bookHeading: (name) => `Book ${name}`,
  bookDepositNote: "PayID deposit required (demo)",
  bookPhoneNote: "Leave a phone number to book (demo)",
  fieldTime: "Time",
  fieldPhone: "Phone",
  phonePlaceholder: "04xx (demo)",
  createOrderLabel: "Create order",
  pageMissing: "Page not found",
  noBookings: "No bookings yet",
  orderMissing: "Order not found",
  guestPhoneLine: (phone) => `Phone ${phone}`,
  depositDue: (amount, label) => `Deposit ${amount} (demo) · ${label}`,
  noDeposit: "No deposit",
  fieldNote: "Note",
  attachShot: "Attach a screenshot",
  iPaid: "I've paid",
  waitingConfirm: "Waiting for her to confirm.",
  contactsReleased: "She confirmed the payment",
  channelWechat: "WeChat",
  channelSms: "SMS",
  record: "Record",
  demoMenu: "Demo",
  simulateTimeout: "Simulate timeout",
  desk: "Operations",
  fieldName: "Name",
  fieldCity: "City",
  fieldWhen: "Hours",
  fieldServices: "Plans",
  fieldPay: "How you get paid",
  stillNeed: (list) => `Still needed: ${list}`,
  needBind: (list) => `Still bind ${list}`,
  openingDesk: "Opening the workspace",
  bindX: "Connect X (demo)",
  boundX: "X connected (demo)",
  bindIvy: "Connect Ivy (demo)",
  boundIvy: "Ivy connected (demo)",
  bindCatch: "Connect Catch (demo)",
  boundCatch: "Catch connected (demo)",
  bindRequired: "Required",
  bindOptional: "Optional",
  marketRule: "The English market requires Ivy and X.",
  publicLink: "Her public link",
  workNow: "Agent working now",
  workSteps: [
    "Reading her profile",
    "Writing her public profile at mrlootbox.com",
    "Preparing today's X post draft",
    "Checking Ivy and X inquiries",
    "Drafting a reply",
    "Waiting for her to confirm",
    "Organizing the paid guest’s details",
    "Planning the next push",
  ],
  seedBanner: "This is a demo model, before onboarding.",
  seedLink: "Fill in onboarding",
  agentsLabel: "Staff",
  agentGuest: "Reception",
  agentFile: "Profile",
  agentPush: "Promotion",
  agentPay: "Payments",
  statusWorking: "Working",
  statusWaiting: "Waiting for her",
  statusIdle: "Idle",
  awaitingCount: "To confirm",
  confirmPush: "Confirm the push",
  pushDraft: "Free tonight. Private dinners.",
  guestSteps: ["Drafting a reply", "Waiting for her to confirm", "Reading the next inquiry"],
  fileSteps: [
    "Reading her profile",
    "Writing her public profile at mrlootbox.com",
    "Updating today's schedule",
  ],
  pushSteps: ["Preparing today's X post draft", "Planning the next push"],
  paySteps: ["Checking PayID", "Organizing the paid guest's details"],
  guestSees: "What the guest sees",
  typingNow: "typing…",
  oneTap: "One tap",
  needsHer: "Needs her reply",
  sendReply: "Send",
  editDraft: "Edit",
  confirmMine: "I'll send this",
  unlocked: "Unlocked. Move him to her private channel (SMS / WhatsApp / WeChat).",
  paidReminder: "This guest paid. Add him.",
  helperWho: "Demo guest · 0400 000 222 (demo)",
  collected: "Collected this month",
  pendingDeposits: "Pending deposits",
  usage: (count) => `Used today ${count}`,
  feed: "Live",
  todayDid: "Today the AI did this",
  updateProfile: "Update profile",
  adjustSchedule: "Adjust schedule",
  push: "Push",
  profileSaved: "Profile updated (demo)",
  scheduleSaved: "Hours adjusted (demo)",
  pushed: "Pushed toward her goal (demo)",
  guestAsk: "Are you free now? I’d like to book.",
  agentReply: (draft) =>
    `${draft.availability} works. ${draft.services}. Please pay the A$100 deposit by ${draft.payment} (demo). Contact details follow once it arrives.`,
  agentDeposit: (payment) => `Asking the guest to pay the deposit by ${payment}.`,
  guestArrived: "Received an inquiry",
  replied: "Replied in her voice",
  startedWork: "Started working",
  qualified: "Checked that this is a booking",
  askedDeposit: "Asked the guest for the deposit",
  depositRecorded: "Deposit recorded",
  demoBalance: "Points left",
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

const NAMES: Record<string, string> = {
  晚棠: "Wantang",
  澄月: "Chengyue",
  阿梨: "Ali",
  陈予安: "Chen Yu'an",
};

export function localizePerson(name: string, lang: Lang): string {
  if (lang !== "en") return name;
  return NAMES[name] ?? name;
}

const PAY_LABEL: Record<string, string> = {
  银行转账: "Bank transfer",
};

const AUDIT: Record<string, string> = {
  创建订单: "Order created",
  客人表示已付款: "Guest said they paid",
  模特确认到账: "She confirmed the payment",
  模特表示未收到: "She said it did not arrive",
  "付款超时，订单取消": "Payment timed out. Order cancelled",
  订单完成: "Order completed",
};

const ERRORS: Record<string, string> = {
  找不到主页: "Page not found",
  没有完成: "Didn't finish",
  找不到订单: "Order not found",
  请留下电话: "Leave a phone number",
  请选择时间: "Choose a time",
  找不到可预约的主页: "That page is not open for booking",
  "她还没有设置 PayID": "She has not set up PayID",
  请以客人身份预约: "Switch to the guest to book",
  这个订单不能这样变更: "This order cannot change that way",
};

/** Weekday labels for a stored slot such as 周四 19:00. The stored value stays Chinese. */
export function localizeSlot(value: string, lang: Lang): string {
  if (lang !== "en") return value;
  return englishWhen(value);
}

export function guestMessage(message: string, lang: Lang): string {
  if (lang !== "en") return message;
  return ERRORS[message] ?? message;
}

type GuestOrder = {
  stageName: string;
  startsAt: string;
  status: string;
  statusLabel: string;
  note: string;
  paymentLabel: string;
  payment: { label: string; accountName: string; reference: string; amount: number } | null;
  audits: { action: string }[];
};

/** English is a view of the same order. Stored orders stay Chinese. */
export function localizeOrderView<T extends GuestOrder>(order: T, lang: Lang): T {
  if (lang !== "en") return order;
  const paymentLabel = PAY_LABEL[order.paymentLabel] ?? order.paymentLabel;
  return {
    ...order,
    stageName: NAMES[order.stageName] ?? order.stageName,
    startsAt: englishWhen(order.startsAt),
    statusLabel: STATUS[order.status] ?? order.statusLabel,
    note: NOTES[order.note] ?? order.note,
    paymentLabel,
    payment: order.payment
      ? {
          ...order.payment,
          label: PAY_LABEL[order.payment.label] ?? order.payment.label,
        }
      : null,
    audits: order.audits.map((entry) => ({
      ...entry,
      action: AUDIT[entry.action] ?? entry.action,
    })),
  };
}

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
