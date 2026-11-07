// src/missbunny/copy.ts
function parseLang(value) {
  return value === "en" ? "en" : "zh";
}
var en = {
  operatingSystem: "Operating system",
  tryDemo: "Try the demo",
  kicker: "AI that works while you sleep",
  hero: "You sleep. The AI keeps working.",
  priceTagline: "Opening shop is free. Minding the shop is what you pay for.",
  priceSupport: "AI employee setup and tools are free. A$300\u2013600 a month pays only for minding the shop: answering guests, screening bookings, collecting deposits, keeping the books, not making things up.",
  heroDetail: "For independent models in Australia. Not for agencies.",
  metaDescription: "Miss Bunny OS, an operating system for independent models in Australia. You sleep. The AI keeps working.",
  lines: [
    ["Inquiries get a reply, day and night", "She sleeps. Replies keep going."],
    ["Someone watches the bookings", "They stay in view."],
    ["Answers only from what you wrote", "If it isn\u2019t there, it\u2019s marked \u201CNeeds you to confirm.\u201D"],
    ["Money goes to your own PayID", "We never hold it."],
    ["The day\u2019s work and income stay visible", "Demo ledger."],
    ["The monthly fee is AI usage", "About A$300\u2013600."],
    [
      "A phone number is enough to book",
      "The deposit starts at 0. To require one, turn on a PayID deposit in settings."
    ]
  ],
  join: "Join",
  joinReason: "Search traffic is not enough. The AI employee needs a steady stream of inquiries every day.",
  selfRun: "Self-run",
  chooseSelfRun: "Choose self-run first",
  joined: "Joined (demo)",
  continue: "Continue",
  language: "Language",
  demoTitle: "missbunny",
  demoIntro: "For independent models in Australia, not agencies. Private, discreet, and hers to decide.",
  steps: [
    "Browsing a profile does not need a sign-in.",
    "Wantang asks for a phone number and a PayID deposit (demo). Contacts appear after she confirms the money arrived.",
    "Chengyue takes no deposit. A phone number books, and contacts appear with the booking.",
    "Switch to the model at the top right, and use the deposit switch to move between the two rules.",
    "A pending payment can be timed out. She can mark it as not received."
  ],
  browseAsGuest: "Browse as a guest",
  wantangDeposit: "Wantang \xB7 PayID deposit",
  chengyuePhone: "Chengyue \xB7 phone only",
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
  incomeToday: "Today\u2019s income",
  demoLedger: "Demo ledger",
  monthlyFee: "Monthly fee",
  recentIncome: (amount) => `Last 7 days ${amount}`,
  usageBand: "AI usage, about A$300\u2013600 \xB7 demo",
  held: (label) => `Income goes to the ${label} she set up (demo)`,
  badge: "Answers only from your profile. Nothing invented.",
  handOff: "Hand to booking",
  illConfirm: "I\u2019ll confirm",
  waiting: "Waiting to confirm",
  noneWaiting: "Nothing waiting",
  confirmReceived: "Confirm received",
  notReceived: "Not received",
  recentBookings: "Recent bookings",
  noneYet: "None yet",
  markComplete: "Mark complete",
  notFinished: "Didn\u2019t finish",
  noMatches: "No matching profiles",
  available: "Available",
  plans: "Plans",
  payment: "Payment",
  book: "Book",
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
  guestAsk: "Are you free now? I\u2019d like to book.",
  agentReply: (draft) => `${draft.availability} works. ${draft.services}. Please pay the A$100 deposit by ${draft.payment} (demo). Contact details follow once it arrives.`,
  agentDeposit: (payment) => `Asking the guest to pay the deposit by ${payment}.`,
  guestArrived: "Received an inquiry",
  replied: "Replied in her voice",
  startedWork: "Started working",
  qualified: "Checked that this is a booking",
  askedDeposit: "Asked the guest for the deposit",
  depositRecorded: "Deposit recorded",
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
  ahaGuest: "Are you free Thursday evening? I\u2019d like a private dinner.",
  ahaReply: "Thursday to Sunday, after dusk, works. A private dinner is fine. Please send the A$100 PayID deposit first (demo). I\u2019ll send contact details once it arrives.",
  ahaSteps: [
    "A guest just sent an inquiry.",
    "The AI is answering in her voice and checking that this is a booking.",
    "The AI is asking the guest for the PayID deposit."
  ],
  ahaPending: "Deposit pending \xB7 PayID A$100 (demo)",
  ahaConfirmed: "Deposit confirmed \xB7 PayID A$100 (demo)",
  ahaReceived: "Payment received",
  ahaContactHidden: "The guest\u2019s contact details are still closed",
  ahaContactOpen: "The guest\u2019s contact details are open",
  ahaContact: "0400 000 222 (demo)",
  ahaLedger: "Ledger records the PayID deposit A$100 (demo)"
};
var QUESTIONS = {
  "lead-time": "Are you free Thursday evening?",
  "lead-price": "What do you charge tonight?",
  "lead-booked": "I would like a dinner companion."
};
var DRAFTS = {
  "lead-time": "Available: Thursday to Sunday, after dusk.",
  "lead-booked": "Private dinners, event attendance, and quiet trips around the city."
};
var GUESTS = {
  "\u5468\u5B81\uFF08\u6F14\u793A\uFF09": "Zhou Ning (demo)",
  "\u6797\u53EF\uFF08\u6F14\u793A\uFF09": "Lin Ke (demo)",
  "\u9648\u4E88\u5B89\uFF08\u6F14\u793A\uFF09": "Chen Yu'an (demo)"
};
var ENGINE = {
  \u9605\u8BFB\u4E86\u6863\u6848: "Read the profile",
  "\u6838\u5BF9\u4E86\u7167\u7247\u3001\u53EF\u7EA6\u65F6\u95F4\u548C\u6536\u6B3E\u65B9\u5F0F": "Checked photos, availability, and how she is paid",
  \u53D1\u5E03\u4E86\u4E3B\u9875: "Published the page",
  \u5F00\u59CB\u4E3A\u5DF2\u9080\u8BF7\u7684\u5BA2\u4EBA\u5339\u914D: "Started matching guests she already invited",
  \u6838\u5BF9\u4E86\u53EF\u7EA6\u65F6\u95F4: "Checked availability",
  \u4E3B\u9875\u4FDD\u6301\u53EF\u6D4F\u89C8: "The page stays open to browse"
};
var GAPS = {
  name: "Add a stage name",
  city: "Choose a city",
  languages: "Choose at least one language",
  services: "Write a few lines about what you offer",
  availability: "Add the times you are free",
  payment: "Add at least one way to be paid"
};
var STATUS = {
  PENDING_PAYMENT: "Awaiting payment",
  AWAITING_MODEL_CONFIRM: "Waiting for her to confirm",
  CONFIRMED: "Confirmed",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
  DISPUTED: "Not confirmed"
};
var NOTES = {
  \u5DF2\u6309\u5907\u6CE8\u8F6C\u8D26: "Transferred with the reference",
  \u6F14\u793A\u8BE2\u95EE: "Demo inquiry"
};
var WEEKDAY = {
  \u5468\u4E00: "Mon",
  \u5468\u4E8C: "Tue",
  \u5468\u4E09: "Wed",
  \u5468\u56DB: "Thu",
  \u5468\u4E94: "Fri",
  \u5468\u516D: "Sat",
  \u5468\u65E5: "Sun"
};
function englishGap(gap) {
  const photos = gap.suggestion.match(/再添加 (\d+) 张照片/);
  if (gap.id === "photos" && photos) return `Add ${photos[1]} more photos`;
  return GAPS[gap.id] ?? gap.suggestion;
}
function englishWhen(value) {
  return value.replace(/周[一二三四五六日]/, (day) => WEEKDAY[day] ?? day);
}
function englishInquiry(inquiry) {
  return {
    ...inquiry,
    guestName: GUESTS[inquiry.guestName] ?? inquiry.guestName,
    question: QUESTIONS[inquiry.id] ?? inquiry.question,
    draft: inquiry.draft ? DRAFTS[inquiry.id] ?? inquiry.draft : "",
    label: inquiry.needsConfirm ? "Needs you to confirm" : inquiry.status === "booked" ? "Now a booking" : "Drafted"
  };
}
function englishOrder(order) {
  const paymentLabel = order.paymentLabel === "\u94F6\u884C\u8F6C\u8D26" ? "Bank transfer" : order.paymentLabel;
  return {
    ...order,
    statusLabel: STATUS[order.status] ?? order.statusLabel,
    note: NOTES[order.note] ?? order.note,
    startsAt: englishWhen(order.startsAt),
    paymentLabel
  };
}
var PUBLIC_EN = {
  wantang: {
    stageName: "Wantang",
    city: "Melbourne",
    languages: ["Chinese", "English"],
    services: "Private dinner company, event attendance, and quiet trips around the city.",
    availability: "Thursday to Sunday, after dusk",
    bio: "Wantang works independently in Melbourne. She keeps evenings for guests she has already invited, for private dinners and quiet trips around the city. Contact details open after she confirms payment.",
    paymentLabels: ["PayID"]
  },
  chengyue: {
    stageName: "Chengyue",
    city: "Sydney",
    languages: ["Chinese", "Cantonese", "English"],
    services: "Travel company, private dinners, and gallery or event attendance.",
    availability: "Wednesday to Saturday, after 4pm",
    bio: "Chengyue works independently in Sydney and only sees guests she has already invited. She joins trips, dinners, and quiet evenings. Contact details open after she confirms payment.",
    paymentLabels: ["Bank transfer"]
  },
  ali: {
    stageName: "Ali",
    city: "Brisbane",
    languages: ["Chinese"],
    services: "",
    availability: "",
    bio: "",
    paymentLabels: []
  }
};
function localizePublicProfile(profile, lang) {
  if (lang !== "en") return profile;
  const translated = PUBLIC_EN[profile.slug];
  if (!translated) return profile;
  return { ...profile, ...translated };
}
function localizeDashboard(view, lang) {
  if (lang === "zh") return view;
  return {
    ...view,
    badge: en.badge,
    assessment: {
      ...view.assessment,
      gaps: view.assessment.gaps.map((gap) => ({ ...gap, suggestion: englishGap(gap) }))
    },
    engineLog: view.engineLog.map((entry) => ({
      ...entry,
      text: ENGINE[entry.text] ?? entry.text
    })),
    inquiries: view.inquiries.map(englishInquiry),
    awaiting: view.awaiting.map(englishOrder),
    recent: view.recent.map(englishOrder)
  };
}

// src/missbunny/domain.ts
var PAYMENT_WINDOW_MS = 30 * 60 * 1e3;
var PHOTO_GOAL = 3;
var DEMO_USER_ID = "demo-guest";
var DEMO_USER_NAME = "\u9648\u4E88\u5B89";
var CITIES = ["\u58A8\u5C14\u672C", "\u6089\u5C3C", "\u5E03\u91CC\u65AF\u73ED", "\u73C0\u65AF", "\u963F\u5FB7\u83B1\u5FB7"];
var LANGUAGES = ["\u4E2D\u6587", "English", "\u7CA4\u8BED", "\u65E5\u672C\u8A9E"];
var ANSWER_BADGE = "\u53EA\u7528\u4F60\u8D44\u6599\u91CC\u7684\u5185\u5BB9\u56DE\u7B54\uFF0C\u4E0D\u7F16";
var NEEDS_CONFIRM = "\u9700\u8981\u4F60\u786E\u8BA4";
var MONTHLY_TOKEN = 420;
var MONTHLY_TOKEN_LOW = 300;
var MONTHLY_TOKEN_HIGH = 600;
var MONTHLY_FEE = MONTHLY_TOKEN;
var STATUS_LABEL = {
  PENDING_PAYMENT: "\u5F85\u4ED8\u6B3E",
  AWAITING_MODEL_CONFIRM: "\u5F85\u786E\u8BA4\u5230\u8D26",
  CONFIRMED: "\u5DF2\u786E\u8BA4",
  COMPLETED: "\u5DF2\u5B8C\u6210",
  CANCELLED: "\u5DF2\u53D6\u6D88",
  DISPUTED: "\u672A\u786E\u8BA4\u5230\u8D26"
};
var CONTACT_CHANNELS = ["wechat", "telegram", "whatsapp", "sms"];
function statusLabel(status) {
  return STATUS_LABEL[status];
}
function draftFromProfile(profile) {
  return {
    stageName: profile.stageName,
    city: profile.city,
    languages: [...profile.languages],
    services: profile.services,
    availability: profile.availability,
    bio: profile.bio,
    photoCount: profile.photoCount,
    paymentMethods: profile.paymentMethods.map((method) => ({ ...method })),
    contacts: { ...profile.contacts }
  };
}
function dayKey(date) {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}
function createId(prefix) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}
function hash(input) {
  let value = 0;
  for (const char of input) value = value * 33 + char.charCodeAt(0) >>> 0;
  return value;
}
function templateBio(draft) {
  const name = draft.stageName.trim() || "\u5979";
  const city = draft.city.trim() || "\u6FB3\u6D32";
  const languages = draft.languages.length > 0 ? draft.languages.join("\u3001") : "\u4E2D\u6587";
  const when = draft.availability.trim() || "\u65F6\u95F4\u7531\u5979\u786E\u8BA4";
  const services = draft.services.trim();
  const serviceLine = services ? `\u5979\u76EE\u524D\u5B89\u6392\uFF1A${services}\u3002` : "\u5979\u53EA\u63A5\u53D7\u5DF2\u7ECF\u9080\u8BF7\u7684\u79C1\u4EBA\u5B89\u6392\u3002";
  return `${name}\u5728${city}\u72EC\u7ACB\u5DE5\u4F5C\uFF0C\u4F7F\u7528${languages}\u3002\u53EF\u7EA6\uFF1A${when}\u3002${serviceLine}\u8054\u7CFB\u65B9\u5F0F\u5728\u5979\u786E\u8BA4\u6536\u6B3E\u4E4B\u540E\u624D\u4F1A\u5F00\u653E\u3002`;
}
function assess(draft) {
  const gaps = [];
  let score = 0;
  if (draft.stageName.trim()) score += 10;
  else gaps.push({ id: "name", suggestion: "\u586B\u5199\u827A\u540D" });
  if (draft.city.trim()) score += 10;
  else gaps.push({ id: "city", suggestion: "\u9009\u62E9\u6240\u5728\u57CE\u5E02" });
  if (draft.languages.length > 0) score += 10;
  else gaps.push({ id: "languages", suggestion: "\u81F3\u5C11\u9009\u62E9\u4E00\u79CD\u8BED\u8A00" });
  if (draft.services.trim().length >= 8) score += 15;
  else gaps.push({ id: "services", suggestion: "\u7528\u51E0\u53E5\u8BDD\u5199\u4E0B\u670D\u52A1\u8BF4\u660E" });
  if (draft.availability.trim()) score += 15;
  else gaps.push({ id: "availability", suggestion: "\u586B\u5199\u53EF\u7EA6\u65F6\u95F4" });
  if (draft.paymentMethods.length > 0) score += 20;
  else gaps.push({ id: "payment", suggestion: "\u81F3\u5C11\u8BBE\u7F6E\u4E00\u79CD\u6536\u6B3E\u65B9\u5F0F" });
  const photosNeeded = Math.max(0, PHOTO_GOAL - draft.photoCount);
  if (photosNeeded === 0) score += 20;
  else gaps.push({ id: "photos", suggestion: `\u518D\u6DFB\u52A0 ${photosNeeded} \u5F20\u7167\u7247` });
  return { score, ready: gaps.length === 0, gaps };
}
function engineSteps(ready) {
  const steps = [
    { id: "read", text: "\u6B63\u5728\u9605\u8BFB\u6863\u6848" },
    { id: "photos", text: "\u6B63\u5728\u6838\u5BF9\u7167\u7247" },
    { id: "availability", text: "\u6B63\u5728\u6838\u5BF9\u53EF\u7EA6\u65F6\u95F4" },
    { id: "payment", text: "\u6B63\u5728\u6838\u5BF9\u6536\u6B3E\u65B9\u5F0F" },
    { id: "score", text: ready ? "\u51C6\u5907\u5EA6\u5DF2\u6EE1\u8DB3" : "\u5217\u51FA\u672A\u5B8C\u6210\u7684\u6761\u4EF6" }
  ];
  if (!ready) return steps;
  steps.push(
    { id: "page", text: "\u6B63\u5728\u751F\u6210\u4E3B\u9875" },
    { id: "publish", text: "\u6B63\u5728\u53D1\u5E03" },
    { id: "match", text: "\u6B63\u5728\u5339\u914D\u5DF2\u9080\u8BF7\u7684\u5BA2\u4EBA" },
    { id: "live", text: "\u5F15\u64CE\u5DF2\u5F00\u59CB\u4E3A\u4F60\u5DE5\u4F5C" }
  );
  return steps;
}
function toPublicProfile(profile) {
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
    paymentLabels: profile.paymentMethods.map((method) => method.label)
  };
}
function searchProfiles(state, query) {
  const needle = query.trim().toLowerCase();
  return state.profiles.filter((profile) => profile.published).filter((profile) => {
    if (!needle) return true;
    const haystack = [
      profile.stageName,
      profile.city,
      profile.languages.join(" "),
      profile.services,
      profile.bio
    ].join(" ").toLowerCase();
    return haystack.includes(needle);
  }).map(toPublicProfile);
}
function modelChoices(state) {
  return state.profiles.map((profile) => ({
    id: profile.id,
    stageName: profile.stageName,
    city: profile.city,
    engineStarted: profile.engineStarted,
    published: profile.published
  }));
}
function cleanDraft(draft) {
  const languages = LANGUAGES.filter((language) => draft.languages.includes(language));
  const city = CITIES.find((item) => item === draft.city.trim()) ?? "";
  const paymentMethods = draft.paymentMethods.filter(
    (method) => (method.kind === "payid" || method.kind === "bank") && method.reference.trim().length > 0
  ).slice(0, 4).map((method) => ({
    id: method.id.trim() || createId("pay"),
    kind: method.kind,
    label: method.kind === "payid" ? "PayID" : "\u94F6\u884C\u8F6C\u8D26",
    accountName: method.accountName.trim().slice(0, 40) || "\u6536\u6B3E\u4EBA",
    reference: method.reference.trim().slice(0, 60)
  }));
  const contacts = {};
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
    contacts
  };
}
function slugFor(state, stageName) {
  const base = stageName.toLowerCase().replace(/[^a-z0-9]+/g, "").slice(0, 24) || "model";
  let slug = base;
  let salt = 1;
  while (state.profiles.some((profile) => profile.slug === slug)) {
    salt += 1;
    slug = `${base}-${salt}`;
  }
  return slug;
}
function ledger(profile, now = /* @__PURE__ */ new Date()) {
  const amounts = [0, 320, 480, 0, 640, 410, 860];
  const days = [];
  for (let ago = 6; ago >= 0; ago -= 1) {
    const date = new Date(now);
    date.setDate(date.getDate() - ago);
    const key2 = dayKey(date);
    const picked = amounts[hash(`${profile.id}:${key2}`) % amounts.length] ?? 0;
    const amount = profile.engineStarted ? ago === 0 && picked === 0 ? 640 : picked : 0;
    days.push({ date: key2, amount });
  }
  const total = days.reduce((sum, day) => sum + day.amount, 0);
  return { days, total, today: days.at(-1)?.amount ?? 0 };
}
function replyFromProfile(profile, topic) {
  if (topic === "availability" && profile.availability.trim()) {
    return { draft: `\u53EF\u7EA6\uFF1A${profile.availability.trim()}`, needsConfirm: false };
  }
  if (topic === "city" && profile.city.trim()) {
    return { draft: `\u5728${profile.city.trim()}\u72EC\u7ACB\u5DE5\u4F5C\u3002`, needsConfirm: false };
  }
  if (topic === "services" && profile.services.trim().length >= 8) {
    return { draft: profile.services.trim(), needsConfirm: false };
  }
  return { draft: "", needsConfirm: true };
}
function presentInquiry(inquiry) {
  return {
    id: inquiry.id,
    guestName: inquiry.guestName,
    question: inquiry.question,
    draft: inquiry.needsConfirm ? "" : inquiry.draft,
    needsConfirm: inquiry.needsConfirm,
    status: inquiry.status,
    orderId: inquiry.orderId,
    label: inquiry.needsConfirm ? NEEDS_CONFIRM : inquiry.status === "booked" ? "\u5DF2\u53D8\u6210\u9884\u7EA6" : "\u5DF2\u8D77\u8349"
  };
}
function pricingQuote(recentIncome) {
  return {
    token: MONTHLY_TOKEN,
    tokenLow: MONTHLY_TOKEN_LOW,
    tokenHigh: MONTHLY_TOKEN_HIGH,
    monthly: MONTHLY_FEE,
    recentIncome
  };
}
function profileById(state, id) {
  return state.profiles.find((profile) => profile.id === id);
}
function orderById(state, id) {
  return state.orders.find((order) => order.id === id);
}
function setRole(state, role, modelId) {
  if (role === "user") {
    const nextModel = profileById(state, modelId)?.id ?? state.session.modelId;
    return {
      ...state,
      session: {
        ...state.session,
        role,
        modelId: profileById(state, nextModel) ? nextModel : state.profiles[0]?.id ?? ""
      }
    };
  }
  if (modelId === "" || modelId === "new") {
    return { ...state, session: { ...state.session, role, modelId: "" } };
  }
  if (!profileById(state, modelId)) return null;
  return { ...state, session: { ...state.session, role, modelId } };
}
function guestPhone(value) {
  const compact = value.trim().replace(/[^\d+]/g, "");
  const digits = compact.replace(/\D/g, "").length;
  if (digits < 8 || digits > 15) return null;
  return compact.slice(0, 16);
}
function payidMethod(profile) {
  return profile.paymentMethods.find((method) => method.kind === "payid");
}
function setDeposit(state, amount) {
  if (state.session.role !== "model" || !state.session.modelId) {
    return { ok: false, error: "\u8BF7\u5207\u6362\u5230\u6A21\u7279" };
  }
  if (!Number.isInteger(amount) || amount < 0 || amount > 5e3) {
    return { ok: false, error: "\u8BA2\u91D1\u91D1\u989D\u65E0\u6548" };
  }
  const profile = profileById(state, state.session.modelId);
  if (!profile) return { ok: false, error: "\u6CA1\u6709\u8FD9\u4E2A\u6863\u6848" };
  if (amount > 0 && !payidMethod(profile)) return { ok: false, error: "\u5148\u5728\u6863\u6848\u91CC\u6DFB\u52A0 PayID" };
  return {
    ok: true,
    state: {
      ...state,
      profiles: state.profiles.map(
        (item) => item.id === profile.id ? { ...item, depositAmount: amount } : item
      )
    }
  };
}
function applyTimeouts(state, now = /* @__PURE__ */ new Date()) {
  let next = state;
  for (const order of state.orders) {
    if (order.status !== "PENDING_PAYMENT") continue;
    if (now.getTime() - Date.parse(order.createdAt) < PAYMENT_WINDOW_MS) continue;
    const updated = transition(next, order.id, "CANCELLED", "system", "\u4ED8\u6B3E\u8D85\u65F6\uFF0C\u8BA2\u5355\u53D6\u6D88", now);
    if (updated) next = updated;
  }
  return next;
}
function transition(state, orderId, status, actor, action, now, patch = {}) {
  const order = orderById(state, orderId);
  if (!order) return null;
  const updated = {
    ...order,
    ...patch,
    status,
    updatedAt: now.toISOString()
  };
  const audit = {
    id: createId("audit"),
    orderId,
    at: now.toISOString(),
    actor,
    action
  };
  return {
    ...state,
    orders: state.orders.map((item) => item.id === orderId ? updated : item),
    audits: [...state.audits, audit]
  };
}
function canUser(state, order) {
  return state.session.role === "user" && state.session.userId === order.userId;
}
function canModel(state, order) {
  return state.session.role === "model" && state.session.modelId === order.profileId;
}
function createOrder(state, input, now = /* @__PURE__ */ new Date()) {
  if (state.session.role !== "user") return { ok: false, error: "\u8BF7\u4EE5\u5BA2\u4EBA\u8EAB\u4EFD\u9884\u7EA6" };
  const phone = guestPhone(input.phone);
  if (!phone) return { ok: false, error: "\u8BF7\u7559\u4E0B\u7535\u8BDD" };
  const profile = state.profiles.find((item) => item.slug === input.slug && item.published);
  if (!profile) return { ok: false, error: "\u627E\u4E0D\u5230\u53EF\u9884\u7EA6\u7684\u4E3B\u9875" };
  const startsAt = input.startsAt.trim().slice(0, 40);
  if (!startsAt) return { ok: false, error: "\u8BF7\u9009\u62E9\u65F6\u95F4" };
  const deposit = profile.depositAmount;
  const method = deposit > 0 ? payidMethod(profile) : void 0;
  if (deposit > 0 && !method) return { ok: false, error: "\u5979\u8FD8\u6CA1\u6709\u8BBE\u7F6E PayID" };
  const order = {
    id: createId("order"),
    profileId: profile.id,
    userId: state.session.userId,
    startsAt,
    paymentMethodId: method?.id ?? "",
    guestPhone: phone,
    depositAmount: deposit,
    status: deposit > 0 ? "PENDING_PAYMENT" : "CONFIRMED",
    note: "",
    screenshotAttached: false,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString()
  };
  const audit = {
    id: createId("audit"),
    orderId: order.id,
    at: now.toISOString(),
    actor: "user",
    action: "\u521B\u5EFA\u8BA2\u5355"
  };
  return {
    ok: true,
    orderId: order.id,
    state: { ...state, orders: [...state.orders, order], audits: [...state.audits, audit] }
  };
}
function markPaid(state, orderId, input, now = /* @__PURE__ */ new Date()) {
  const order = orderById(state, orderId);
  if (!order || !canUser(state, order) || order.status !== "PENDING_PAYMENT") return null;
  return transition(state, orderId, "AWAITING_MODEL_CONFIRM", "user", "\u5BA2\u4EBA\u8868\u793A\u5DF2\u4ED8\u6B3E", now, {
    note: (input.note ?? "").trim().slice(0, 200),
    screenshotAttached: Boolean(input.screenshotAttached)
  });
}
function confirmReceived(state, orderId, now = /* @__PURE__ */ new Date()) {
  const order = orderById(state, orderId);
  if (!order || !canModel(state, order) || order.status !== "AWAITING_MODEL_CONFIRM") return null;
  return transition(state, orderId, "CONFIRMED", "model", "\u6A21\u7279\u786E\u8BA4\u5230\u8D26", now);
}
function disputeOrder(state, orderId, now = /* @__PURE__ */ new Date()) {
  const order = orderById(state, orderId);
  if (!order || !canModel(state, order) || order.status !== "AWAITING_MODEL_CONFIRM") return null;
  return transition(state, orderId, "DISPUTED", "model", "\u6A21\u7279\u8868\u793A\u672A\u6536\u5230", now);
}
function simulateTimeout(state, orderId, now = /* @__PURE__ */ new Date()) {
  const order = orderById(state, orderId);
  if (!order) return null;
  if (order.status !== "PENDING_PAYMENT") return null;
  if (!canUser(state, order) && !canModel(state, order)) return null;
  return transition(state, orderId, "CANCELLED", "user", "\u4ED8\u6B3E\u8D85\u65F6\uFF0C\u8BA2\u5355\u53D6\u6D88", now);
}
function completeOrder(state, orderId, now = /* @__PURE__ */ new Date()) {
  const order = orderById(state, orderId);
  if (!order || !canModel(state, order) || order.status !== "CONFIRMED") return null;
  return transition(state, orderId, "COMPLETED", "model", "\u8BA2\u5355\u5B8C\u6210", now);
}
function presentOrder(state, order, detail) {
  if (!canUser(state, order) && !canModel(state, order)) return null;
  const profile = profileById(state, order.profileId);
  const method = profile?.paymentMethods.find((item) => item.id === order.paymentMethodId);
  const released = canUser(state, order) && (order.status === "CONFIRMED" || order.status === "COMPLETED");
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
    guestPhone: order.guestPhone,
    depositAmount: order.depositAmount,
    payment: detail && method && order.depositAmount > 0 ? {
      label: method.label,
      accountName: method.accountName,
      reference: method.reference,
      amount: order.depositAmount
    } : null,
    contacts: released && profile ? { ...profile.contacts } : null,
    audits: detail ? state.audits.filter((entry) => entry.orderId === order.id) : []
  };
}
function listOrders(state) {
  return state.orders.filter((order) => canUser(state, order) || canModel(state, order)).sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt)).flatMap((order) => {
    const view = presentOrder(state, order, false);
    return view ? [view] : [];
  });
}
function refreshInquiries(state, profile) {
  return state.inquiries.map((inquiry) => {
    if (inquiry.profileId !== profile.id || inquiry.status === "booked") return inquiry;
    const reply = replyFromProfile(profile, inquiry.topic);
    const status = reply.needsConfirm ? "needs_model" : inquiry.status === "needs_model" ? "drafted" : inquiry.status;
    return { ...inquiry, draft: reply.draft, needsConfirm: reply.needsConfirm, status };
  });
}
function commitEngine(state, draft, now = /* @__PURE__ */ new Date()) {
  if (state.session.role !== "model") return { ok: false, error: "\u8BF7\u4EE5\u6A21\u7279\u8EAB\u4EFD\u7EE7\u7EED" };
  const cleaned = cleanDraft(draft);
  if (!cleaned.bio) cleaned.bio = templateBio(cleaned);
  const assessment = assess(cleaned);
  const existing = state.session.modelId ? profileById(state, state.session.modelId) : void 0;
  const profile = existing ? {
    ...existing,
    ...cleaned,
    published: assessment.ready,
    engineStarted: assessment.ready
  } : {
    id: createId("model"),
    slug: slugFor(state, cleaned.stageName),
    ...cleaned,
    depositAmount: 0,
    published: assessment.ready,
    engineStarted: assessment.ready
  };
  const profiles = existing ? state.profiles.map((item) => item.id === profile.id ? profile : item) : [...state.profiles, profile];
  const engineLog = assessment.ready ? [
    ...state.engineLog,
    ...[
      "\u9605\u8BFB\u4E86\u6863\u6848",
      "\u6838\u5BF9\u4E86\u7167\u7247\u3001\u53EF\u7EA6\u65F6\u95F4\u548C\u6536\u6B3E\u65B9\u5F0F",
      "\u53D1\u5E03\u4E86\u4E3B\u9875",
      "\u5F00\u59CB\u4E3A\u5DF2\u9080\u8BF7\u7684\u5BA2\u4EBA\u5339\u914D"
    ].map((text) => ({
      id: createId("engine"),
      profileId: profile.id,
      at: now.toISOString(),
      text
    }))
  ] : state.engineLog.filter((entry) => entry.profileId !== profile.id);
  return {
    ok: true,
    profileId: profile.id,
    assessment,
    state: {
      ...state,
      profiles,
      engineLog,
      inquiries: refreshInquiries(state, profile),
      session: { ...state.session, role: "model", modelId: profile.id }
    }
  };
}
function checkout(state, slug) {
  const profile = state.profiles.find((item) => item.slug === slug && item.published);
  if (!profile) return null;
  return {
    profile: toPublicProfile(profile),
    depositAmount: profile.depositAmount,
    payid: profile.depositAmount > 0 ? payidMethod(profile) ?? null : null
  };
}
function ownProfile(state) {
  if (state.session.role !== "model" || !state.session.modelId) return null;
  const profile = profileById(state, state.session.modelId);
  return profile ? {
    ...profile,
    contacts: { ...profile.contacts },
    paymentMethods: profile.paymentMethods.map((method) => ({ ...method }))
  } : null;
}
function ownInquiry(state, id) {
  if (state.session.role !== "model") return void 0;
  return state.inquiries.find(
    (inquiry) => inquiry.id === id && inquiry.profileId === state.session.modelId
  );
}
function acknowledgeInquiry(state, id) {
  const inquiry = ownInquiry(state, id);
  if (!inquiry) return null;
  if (inquiry.status !== "needs_model") return null;
  return {
    ...state,
    inquiries: state.inquiries.map(
      (item) => item.id === id ? { ...item, status: "handed_off", draft: "", needsConfirm: true } : item
    )
  };
}
function bookInquiry(state, id, now = /* @__PURE__ */ new Date()) {
  const inquiry = ownInquiry(state, id);
  if (!inquiry) return { ok: false, error: "\u627E\u4E0D\u5230\u8FD9\u6761\u8BE2\u95EE" };
  if (inquiry.needsConfirm && inquiry.status === "needs_model") {
    return { ok: false, error: NEEDS_CONFIRM };
  }
  if (inquiry.status === "booked") return { ok: false, error: "\u5DF2\u7ECF\u53D8\u6210\u9884\u7EA6" };
  const profile = profileById(state, inquiry.profileId);
  if (!profile) return { ok: false, error: "\u627E\u4E0D\u5230\u8FD9\u6761\u8BE2\u95EE" };
  const method = profile.depositAmount > 0 ? payidMethod(profile) : void 0;
  if (profile.depositAmount > 0 && !method) return { ok: false, error: "\u5148\u5728\u6863\u6848\u91CC\u6DFB\u52A0 PayID" };
  const order = {
    id: createId("order"),
    profileId: profile.id,
    userId: DEMO_USER_ID,
    startsAt: "\u5468\u56DB 19:00",
    paymentMethodId: method?.id ?? "",
    guestPhone: "0400000099",
    depositAmount: profile.depositAmount,
    status: profile.depositAmount > 0 ? "PENDING_PAYMENT" : "CONFIRMED",
    note: "\u6F14\u793A\u8BE2\u95EE",
    screenshotAttached: false,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString()
  };
  const audit = {
    id: createId("audit"),
    orderId: order.id,
    at: now.toISOString(),
    actor: "model",
    action: "\u8BE2\u95EE\u4EA4\u7ED9\u9884\u7EA6"
  };
  return {
    ok: true,
    orderId: order.id,
    state: {
      ...state,
      orders: [...state.orders, order],
      audits: [...state.audits, audit],
      inquiries: state.inquiries.map(
        (item) => item.id === id ? { ...item, status: "booked", orderId: order.id } : item
      )
    }
  };
}
function dashboard(state, now = /* @__PURE__ */ new Date()) {
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
    depositAmount: profile.depositAmount,
    badge: ANSWER_BADGE,
    engineLog: state.engineLog.filter(
      (entry) => entry.profileId === profile.id && dayKey(new Date(entry.at)) === today
    ),
    inquiries: state.inquiries.filter((inquiry) => inquiry.profileId === profile.id).map(presentInquiry),
    awaiting: listOrders(state).filter((order) => order.status === "AWAITING_MODEL_CONFIRM"),
    recent: listOrders(state).filter((order) => order.status !== "AWAITING_MODEL_CONFIRM")
  };
}

// src/missbunny/seed.ts
function lines(profileId, texts, at) {
  return texts.map((text, index) => ({
    id: `engine-${profileId}-${index}`,
    profileId,
    at,
    text
  }));
}
function seedState(now = /* @__PURE__ */ new Date()) {
  const at = now.toISOString();
  const ago = (minutes) => new Date(now.getTime() - minutes * 6e4).toISOString();
  const wantang = {
    id: "wantang",
    slug: "wantang",
    stageName: "\u665A\u68E0",
    city: "\u58A8\u5C14\u672C",
    languages: ["\u4E2D\u6587", "English"],
    services: "\u79C1\u4EBA\u665A\u5BB4\u966A\u540C\u3001\u6D3B\u52A8\u51FA\u5E2D\u3001\u5B89\u9759\u7684\u57CE\u5E02\u968F\u884C\u3002",
    availability: "\u5468\u56DB\u81F3\u5468\u65E5\uFF0C\u508D\u665A\u4E4B\u540E",
    bio: "\u665A\u68E0\u5728\u58A8\u5C14\u672C\u72EC\u7ACB\u5DE5\u4F5C\u3002\u5979\u628A\u665A\u4E0A\u7559\u7ED9\u5DF2\u7ECF\u9080\u8BF7\u7684\u5BA2\u4EBA\uFF0C\u966A\u540C\u79C1\u4EBA\u665A\u5BB4\u548C\u5B89\u9759\u7684\u57CE\u5E02\u51FA\u884C\u3002\u8054\u7CFB\u65B9\u5F0F\u5728\u786E\u8BA4\u6536\u6B3E\u540E\u5F00\u653E\u3002",
    photoCount: 4,
    paymentMethods: [
      {
        id: "pay-wantang",
        kind: "payid",
        label: "PayID",
        accountName: "\u665A\u68E0",
        reference: "payid-wantang-private"
      }
    ],
    contacts: {
      wechat: "wx-wantang-private",
      telegram: "tg-wantang-private",
      whatsapp: "wa-wantang-private",
      sms: "0400000001"
    },
    depositAmount: 100,
    published: true,
    engineStarted: true
  };
  const chengyue = {
    id: "chengyue",
    slug: "chengyue",
    stageName: "\u6F84\u6708",
    city: "\u6089\u5C3C",
    languages: ["\u4E2D\u6587", "\u7CA4\u8BED", "English"],
    services: "\u51FA\u5DEE\u968F\u884C\u3001\u79C1\u4EBA\u665A\u5BB4\u3001\u753B\u5ECA\u4E0E\u6D3B\u52A8\u51FA\u5E2D\u3002",
    availability: "\u5468\u4E09\u81F3\u5468\u516D\uFF0C\u4E0B\u5348\u56DB\u70B9\u540E",
    bio: "\u6F84\u6708\u5728\u6089\u5C3C\u72EC\u7ACB\u5DE5\u4F5C\uFF0C\u53EA\u89C1\u5DF2\u7ECF\u9080\u8BF7\u7684\u5BA2\u4EBA\u3002\u5979\u966A\u540C\u51FA\u5DEE\u3001\u665A\u5BB4\u548C\u5B89\u9759\u7684\u591C\u95F4\u6D3B\u52A8\u3002\u8054\u7CFB\u65B9\u5F0F\u5728\u786E\u8BA4\u6536\u6B3E\u540E\u5F00\u653E\u3002",
    photoCount: 3,
    paymentMethods: [
      {
        id: "pay-chengyue",
        kind: "bank",
        label: "\u94F6\u884C\u8F6C\u8D26",
        accountName: "\u6F84\u6708",
        reference: "bank-chengyue-private"
      }
    ],
    contacts: { wechat: "wx-chengyue-private", telegram: "tg-chengyue-private" },
    depositAmount: 0,
    published: true,
    engineStarted: true
  };
  const ali = {
    id: "ali",
    slug: "ali",
    stageName: "\u963F\u68A8",
    city: "\u5E03\u91CC\u65AF\u73ED",
    languages: ["\u4E2D\u6587"],
    services: "",
    availability: "",
    bio: "",
    photoCount: 1,
    paymentMethods: [],
    contacts: { wechat: "wx-ali-private" },
    depositAmount: 0,
    published: false,
    engineStarted: false
  };
  const orders = [
    {
      id: "order-pending",
      profileId: "wantang",
      userId: DEMO_USER_ID,
      startsAt: "\u5468\u4E94 19:30",
      paymentMethodId: "pay-wantang",
      guestPhone: "0412000111",
      depositAmount: 100,
      status: "PENDING_PAYMENT",
      note: "",
      screenshotAttached: false,
      createdAt: ago(8),
      updatedAt: ago(8)
    },
    {
      id: "order-awaiting",
      profileId: "wantang",
      userId: DEMO_USER_ID,
      startsAt: "\u5468\u516D 18:00",
      paymentMethodId: "pay-wantang",
      guestPhone: "0412000222",
      depositAmount: 100,
      status: "AWAITING_MODEL_CONFIRM",
      note: "\u5DF2\u6309\u5907\u6CE8\u8F6C\u8D26",
      screenshotAttached: true,
      createdAt: ago(40),
      updatedAt: ago(12)
    },
    {
      id: "order-confirmed",
      profileId: "wantang",
      userId: DEMO_USER_ID,
      startsAt: "\u5468\u56DB 19:00",
      paymentMethodId: "pay-wantang",
      guestPhone: "0412000333",
      depositAmount: 100,
      status: "CONFIRMED",
      note: "",
      screenshotAttached: false,
      createdAt: ago(180),
      updatedAt: ago(90)
    }
  ];
  const audits = [
    {
      id: "audit-pending",
      orderId: "order-pending",
      at: ago(8),
      actor: "user",
      action: "\u521B\u5EFA\u8BA2\u5355"
    },
    {
      id: "audit-awaiting-create",
      orderId: "order-awaiting",
      at: ago(40),
      actor: "user",
      action: "\u521B\u5EFA\u8BA2\u5355"
    },
    {
      id: "audit-awaiting-paid",
      orderId: "order-awaiting",
      at: ago(12),
      actor: "user",
      action: "\u5BA2\u4EBA\u8868\u793A\u5DF2\u4ED8\u6B3E"
    },
    {
      id: "audit-confirmed",
      orderId: "order-confirmed",
      at: ago(90),
      actor: "model",
      action: "\u6A21\u7279\u786E\u8BA4\u5230\u8D26"
    }
  ];
  return {
    session: {
      role: "user",
      userId: DEMO_USER_ID,
      userName: DEMO_USER_NAME,
      modelId: "wantang"
    },
    profiles: [wantang, chengyue, ali],
    orders,
    audits,
    engineLog: [...lines("chengyue", ["\u6838\u5BF9\u4E86\u53EF\u7EA6\u65F6\u95F4", "\u4E3B\u9875\u4FDD\u6301\u53EF\u6D4F\u89C8"], at)],
    inquiries: inquiriesFor(wantang, at)
  };
}
function inquiriesFor(profile, at) {
  const time = replyFromProfile(profile, "availability");
  const visit = replyFromProfile(profile, "services");
  const price = replyFromProfile(profile, "price");
  return [
    {
      id: "lead-time",
      profileId: profile.id,
      guestName: "\u5468\u5B81\uFF08\u6F14\u793A\uFF09",
      topic: "availability",
      question: "\u5468\u56DB\u665A\u4E0A\u8FD8\u6709\u7A7A\u5417\uFF1F",
      draft: time.draft,
      needsConfirm: time.needsConfirm,
      status: "drafted",
      orderId: "",
      at
    },
    {
      id: "lead-price",
      profileId: profile.id,
      guestName: "\u6797\u53EF\uFF08\u6F14\u793A\uFF09",
      topic: "price",
      question: "\u4ECA\u665A\u600E\u4E48\u6536\u8D39\uFF1F",
      draft: price.draft,
      needsConfirm: price.needsConfirm,
      status: "needs_model",
      orderId: "",
      at
    },
    {
      id: "lead-booked",
      profileId: profile.id,
      guestName: "\u9648\u4E88\u5B89\uFF08\u6F14\u793A\uFF09",
      topic: "services",
      question: "\u60F3\u7EA6\u4E00\u6B21\u665A\u5BB4\u966A\u540C\u3002",
      draft: visit.draft,
      needsConfirm: visit.needsConfirm,
      status: "booked",
      orderId: "order-confirmed",
      at
    }
  ];
}

// src/missbunny/public-profile.ts
var DEFAULT_PUBLIC_PROFILE_BASE_URL = "https://mrlootbox.com";
function publicProfileBaseUrl(env) {
  const fromProcess = typeof process !== "undefined" ? process.env.PUBLIC_PROFILE_BASE_URL?.trim() : void 0;
  const configured = env?.PUBLIC_PROFILE_BASE_URL?.trim() || fromProcess;
  return (configured || DEFAULT_PUBLIC_PROFILE_BASE_URL).replace(/\/$/, "");
}
function publicProfileUrl(slug, lang = "zh") {
  const base = `${publicProfileBaseUrl()}/${slug}`;
  return lang === "en" ? `${base}?lang=en` : base;
}
function publicProfileSlug(pathname) {
  const match = pathname.match(/^\/p\/([a-z0-9-]+)\/?$/);
  return match?.[1] ?? null;
}
function escapeHtml(value) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}
function profileFor(slug, lang) {
  const profile = seedState().profiles.find((item) => item.slug === slug && item.published);
  if (!profile) return null;
  return localizePublicProfile(toPublicProfile(profile), lang);
}
function linkCodeModules(value) {
  const size = 33;
  const grid = Array.from({ length: size }, () => Array.from({ length: size }, () => false));
  const finder = (row, col) => {
    for (let y = 0; y < 7; y += 1) {
      for (let x = 0; x < 7; x += 1) {
        const edge = x === 0 || y === 0 || x === 6 || y === 6;
        const core = x >= 2 && x <= 4 && y >= 2 && y <= 4;
        grid[row + y][col + x] = edge || core;
      }
    }
  };
  finder(0, 0);
  finder(0, size - 7);
  finder(size - 7, 0);
  let bit = 0;
  const bytes = Array.from(new TextEncoder().encode(value));
  for (let row = 0; row < size; row += 1) {
    for (let col = 0; col < size; col += 1) {
      if (grid[row]?.[col]) continue;
      const reserved = row < 8 && col < 8 || row < 8 && col > size - 9 || row > size - 9 && col < 8;
      if (reserved) continue;
      const byte = bytes[Math.floor(bit / 8)] ?? 0;
      grid[row][col] = (byte >> bit % 8 & 1) === 1;
      bit += 1;
    }
  }
  return grid;
}
function linkCodeSvg(url) {
  const modules = linkCodeModules(url);
  const cell = 4;
  const size = modules.length * cell;
  const rects = modules.flatMap(
    (row, y) => row.map(
      (on, x) => on ? `<rect x="${x * cell}" y="${y * cell}" width="${cell}" height="${cell}"/>` : ""
    )
  ).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="168" height="168" role="img" aria-label="${escapeHtml(url)}"><title>${escapeHtml(url)}</title><rect width="100%" height="100%" fill="#fff"/>${rects.replaceAll("<rect ", '<rect fill="#111" ')}</svg>`;
}
function renderPublicProfileHtml(slug, lang = "zh") {
  const profile = profileFor(slug, lang);
  if (!profile) return null;
  const url = publicProfileUrl(slug, lang);
  const other = publicProfileUrl(slug, lang === "en" ? "zh" : "en");
  const copyLabel = lang === "en" ? "Copy link" : "\u590D\u5236\u94FE\u63A5";
  const copied = lang === "en" ? "Copied" : "\u5DF2\u590D\u5236";
  const zhLabel = "\u4E2D\u6587";
  const enLabel = "EN";
  const hours = lang === "en" ? "Hours" : "\u53EF\u7EA6";
  const plans = lang === "en" ? "Plans" : "\u5B89\u6392";
  const html = `<!doctype html>
<html lang="${lang === "en" ? "en" : "zh-CN"}">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>${escapeHtml(profile.stageName)}</title>
<link rel="canonical" href="${escapeHtml(url)}"/>
<meta property="og:url" content="${escapeHtml(url)}"/>
<meta property="og:title" content="${escapeHtml(profile.stageName)}"/>
<meta property="og:description" content="${escapeHtml(profile.bio)}"/>
<style>
  body { margin: 0; font: 18px/1.5 system-ui, sans-serif; color: #111; background: #fff; }
  main { max-width: 40rem; margin: 0 auto; padding: 2rem 1.25rem 3rem; }
  h1 { font-size: 2.5rem; font-weight: 500; margin: 0; }
  p { margin: 0.5rem 0 0; }
  .muted { color: #5c5c5c; }
  a { color: inherit; }
  button { font: inherit; margin-top: 1rem; }
  section { margin-top: 1.5rem; }
  h2 { font-size: 1rem; font-weight: 500; margin: 0; }
</style>
</head>
<body>
<main>
  <p class="muted"><a href="${escapeHtml(other)}">${lang === "en" ? zhLabel : enLabel}</a></p>
  <h1>${escapeHtml(profile.stageName)}</h1>
  <p class="muted">${escapeHtml(profile.city)} \xB7 ${escapeHtml(profile.languages.join(" \xB7 "))}</p>
  <p>${escapeHtml(profile.bio)}</p>
  <section><h2>${hours}</h2><p>${escapeHtml(profile.availability)}</p></section>
  <section><h2>${plans}</h2><p>${escapeHtml(profile.services)}</p></section>
  <section>
    <p><a href="${escapeHtml(url)}">${escapeHtml(url)}</a></p>
    <button type="button" id="copy">${copyLabel}</button>
    <div>${linkCodeSvg(url)}</div>
  </section>
</main>
<script>
  document.getElementById("copy").addEventListener("click", function () {
    navigator.clipboard.writeText(${JSON.stringify(url)}).then(function () {
      document.getElementById("copy").textContent = ${JSON.stringify(copied)};
    });
  });
</script>
</body>
</html>`;
  return html;
}

// ../../packages/adapters/src/pi-local-provider-id.ts
var DEFAULT_LOCAL_BASE_URL = "http://127.0.0.1:11434/v1";
function localBaseUrl(env = process.env) {
  const value = env.RAKAZO_LOCAL_MODELS_URL?.trim() || DEFAULT_LOCAL_BASE_URL;
  let url;
  try {
    url = new URL(value);
  } catch {
    throw new Error("RAKAZO_LOCAL_MODELS_URL must be an absolute HTTP(S) URL");
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("RAKAZO_LOCAL_MODELS_URL must be an absolute HTTP(S) URL");
  }
  return value;
}
function localModelIds(env = process.env) {
  return (env.RAKAZO_LOCAL_MODELS ?? "").split(",").map((id) => id.trim()).filter((id) => id.length > 0);
}

// ../../packages/adapters/src/pi-local-chat.ts
async function completeLocalChat(messages, options = {}) {
  const env = options.env ?? process.env;
  const model = localModelIds(env)[0];
  if (!model) return null;
  const base = localBaseUrl(env);
  const endpoint = new URL("chat/completions", base.endsWith("/") ? base : `${base}/`);
  const response = await (options.fetch ?? fetch)(endpoint, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ model, temperature: 0.4, messages })
  });
  if (!response.ok) throw new Error("local model request failed");
  const payload = await response.json();
  const text = payload.choices?.[0]?.message?.content?.trim() ?? "";
  return text || null;
}

// src/missbunny/server/llm.ts
async function generateProfileCopy(draft, options = {}) {
  const fallback = { bio: templateBio(draft), source: "template" };
  try {
    const text = await completeLocalChat(
      [
        {
          role: "system",
          content: "\u4F60\u4E3A\u6FB3\u6D32\u72EC\u7ACB\u6A21\u7279\u5199\u4E00\u6BB5\u514B\u5236\u3001\u79C1\u4EBA\u7684\u4E3B\u9875\u7B80\u4ECB\u3002\u7528\u4E2D\u6587\uFF0C80\u5230140\u5B57\u3002\u4E0D\u8981\u5199\u4EF7\u683C\uFF0C\u4E0D\u8981\u5199\u9732\u9AA8\u5185\u5BB9\uFF0C\u4E0D\u8981\u51FA\u73B0\u201C\u63F4\u4EA4\u201D\uFF0C\u4E0D\u8981\u5199\u6210\u7ECF\u7EAA\u516C\u53F8\u53E3\u543B\u3002\u8054\u7CFB\u65B9\u5F0F\u5728\u786E\u8BA4\u6536\u6B3E\u540E\u624D\u5F00\u653E\uFF0C\u8FD9\u53E5\u8BDD\u53EF\u4EE5\u4FDD\u7559\u3002"
        },
        {
          role: "user",
          content: JSON.stringify({
            stageName: draft.stageName,
            city: draft.city,
            languages: draft.languages,
            services: draft.services,
            availability: draft.availability
          })
        }
      ],
      { env: options.env, fetch: options.fetcher }
    );
    if (!text || text.includes("\u63F4\u4EA4")) return fallback;
    return { bio: text.slice(0, 800), source: "model" };
  } catch {
    return fallback;
  }
}

// src/missbunny/server/store.ts
import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";
var SECRET = process.env.MISSBUNNY_STATE_SECRET ?? "missbunny-demo";
function key() {
  return createHash("sha256").update(SECRET).digest();
}
function encodeState(state) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key(), iv);
  const encrypted = Buffer.concat([cipher.update(JSON.stringify(state), "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, encrypted]).toString("base64url");
}
function decodeState(token) {
  if (!token) return seedState();
  try {
    const buffer = Buffer.from(token, "base64url");
    const iv = buffer.subarray(0, 12);
    const tag = buffer.subarray(12, 28);
    const encrypted = buffer.subarray(28);
    const decipher = createDecipheriv("aes-256-gcm", key(), iv);
    decipher.setAuthTag(tag);
    const plain = Buffer.concat([decipher.update(encrypted), decipher.final()]).toString("utf8");
    const parsed = JSON.parse(plain);
    if (!parsed.session || !Array.isArray(parsed.profiles) || !Array.isArray(parsed.orders)) {
      return seedState();
    }
    if (!Array.isArray(parsed.inquiries)) parsed.inquiries = [];
    return parsed;
  } catch {
    return seedState();
  }
}

// src/missbunny/server/http.ts
var STEP_MS = 0;
function shellOf(state) {
  return { session: state.session, models: modelChoices(state) };
}
function json(state, body, status = 200) {
  return Response.json({ token: encodeState(state), shell: shellOf(state), ...body }, { status });
}
function fail(state, error, status) {
  return json(state, { error }, status);
}
function asDraft(value) {
  if (!value || typeof value !== "object") return null;
  const draft = value;
  if (typeof draft.stageName !== "string" || !Array.isArray(draft.languages)) return null;
  if (!Array.isArray(draft.paymentMethods) || typeof draft.contacts !== "object") return null;
  return draft;
}
function stringField(value) {
  return typeof value === "string" ? value : "";
}
async function dispatch(state, body) {
  const op = stringField(body.op);
  if (op === "bootstrap") return json(state, {});
  if (op === "session") {
    const role = body.role === "model" ? "model" : "user";
    const modelId = typeof body.modelId === "string" ? body.modelId : state.session.modelId;
    const next = setRole(state, role, modelId);
    if (!next) return fail(state, "\u6CA1\u6709\u8FD9\u4E2A\u6863\u6848", 404);
    return json(next, {});
  }
  if (op === "profiles") {
    const lang = parseLang(body.lang);
    return json(state, {
      profiles: searchProfiles(state, stringField(body.q)).map(
        (profile) => localizePublicProfile(profile, lang)
      )
    });
  }
  if (op === "profile") {
    const profile = state.profiles.find(
      (item) => item.slug === stringField(body.slug) && item.published
    );
    if (!profile) return fail(state, "\u627E\u4E0D\u5230\u4E3B\u9875", 404);
    return json(state, {
      profile: localizePublicProfile(toPublicProfile(profile), parseLang(body.lang))
    });
  }
  if (op === "checkout") {
    const result = checkout(state, stringField(body.slug));
    if (!result) return fail(state, "\u627E\u4E0D\u5230\u4E3B\u9875", 404);
    return json(state, {
      ...result,
      profile: localizePublicProfile(result.profile, parseLang(body.lang))
    });
  }
  if (op === "studio") {
    if (state.session.role !== "model") return fail(state, "\u8BF7\u5207\u6362\u5230\u6A21\u7279", 403);
    const profile = ownProfile(state);
    return json(state, { profile, draft: profile ? draftFromProfile(profile) : null });
  }
  if (op === "generate") {
    const draft = asDraft(body.draft);
    if (!draft) return fail(state, "\u6863\u6848\u4E0D\u5B8C\u6574", 400);
    const copy = await generateProfileCopy(draft);
    return json(state, copy);
  }
  if (op === "engine.start") {
    const draft = asDraft(body.draft);
    if (!draft) return fail(state, "\u6863\u6848\u4E0D\u5B8C\u6574", 400);
    if (body.sync === true) {
      const committed = commitEngine(state, draft);
      if (!committed.ok) return fail(state, committed.error, 403);
      return json(committed.state, {
        assessment: committed.assessment,
        steps: engineSteps(committed.assessment.ready)
      });
    }
    return { stream: true, state, draft };
  }
  if (op === "dashboard") {
    const payload = dashboardPayload(state, parseLang(body.lang));
    if (!payload) return fail(state, "\u8BF7\u5207\u6362\u5230\u6A21\u7279", 403);
    return json(state, payload);
  }
  if (op === "acknowledge") {
    const next = acknowledgeInquiry(state, stringField(body.id));
    if (!next) return fail(state, "\u8FD9\u6761\u8BE2\u95EE\u4E0D\u80FD\u8FD9\u6837\u5904\u7406", 409);
    const payload = dashboardPayload(next, parseLang(body.lang));
    if (!payload) return fail(next, "\u8BF7\u5207\u6362\u5230\u6A21\u7279", 403);
    return json(next, payload);
  }
  if (op === "bookLead") {
    const booked = bookInquiry(state, stringField(body.id));
    if (!booked.ok) return fail(state, booked.error, 409);
    const payload = dashboardPayload(booked.state, parseLang(body.lang));
    if (!payload) return fail(booked.state, "\u8BF7\u5207\u6362\u5230\u6A21\u7279", 403);
    return json(booked.state, payload);
  }
  if (op === "orders") return json(state, { orders: listOrders(state) });
  if (op === "order") {
    const order2 = state.orders.find((item) => item.id === stringField(body.id));
    if (!order2) return fail(state, "\u627E\u4E0D\u5230\u8BA2\u5355", 404);
    const view2 = presentOrder(state, order2, true);
    if (!view2) return fail(state, "\u627E\u4E0D\u5230\u8BA2\u5355", 404);
    return json(state, { order: view2 });
  }
  if (op === "setDeposit") {
    const amount = typeof body.amount === "number" ? body.amount : Number(body.amount);
    const updated = setDeposit(state, amount);
    if (!updated.ok) return fail(state, updated.error, 409);
    const payload = dashboardPayload(updated.state, parseLang(body.lang));
    if (!payload) return fail(updated.state, "\u8BF7\u5207\u6362\u5230\u6A21\u7279", 403);
    return json(updated.state, payload);
  }
  if (op === "createOrder") {
    const created = createOrder(state, {
      slug: stringField(body.slug),
      startsAt: stringField(body.startsAt),
      phone: stringField(body.phone)
    });
    if (!created.ok) return fail(state, created.error, 403);
    const order2 = created.state.orders.find((item) => item.id === created.orderId);
    const view2 = order2 ? presentOrder(created.state, order2, true) : null;
    return json(created.state, { order: view2 });
  }
  const orderId = stringField(body.id);
  const mutated = op === "pay" ? markPaid(state, orderId, {
    note: stringField(body.note),
    screenshotAttached: body.screenshotAttached === true
  }) : op === "confirm" ? confirmReceived(state, orderId) : op === "dispute" ? disputeOrder(state, orderId) : op === "timeout" ? simulateTimeout(state, orderId) : op === "complete" ? completeOrder(state, orderId) : void 0;
  if (mutated === void 0) return fail(state, "\u672A\u77E5\u64CD\u4F5C", 404);
  if (!mutated) return fail(state, "\u8FD9\u4E2A\u8BA2\u5355\u4E0D\u80FD\u8FD9\u6837\u53D8\u66F4", 409);
  const order = mutated.orders.find((item) => item.id === orderId);
  const view = order ? presentOrder(mutated, order, true) : null;
  return json(mutated, { order: view });
}
function dashboardPayload(state, lang = "zh") {
  const view = dashboard(state);
  if (!view) return null;
  const { profile, ...rest } = view;
  const localized = localizeDashboard(rest, lang);
  return {
    ...localized,
    stageName: profile.stageName,
    city: profile.city,
    published: profile.published,
    engineStarted: profile.engineStarted,
    photoCount: profile.photoCount
  };
}
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
function streamEngine(state, draft) {
  const committed = commitEngine(state, draft);
  if (!committed.ok) return fail(state, committed.error, 403);
  const steps = engineSteps(committed.assessment.ready);
  const encoder = new TextEncoder();
  const body = new ReadableStream({
    async start(controller) {
      const send2 = (event) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}

`));
      };
      send2({
        type: "result",
        token: encodeState(committed.state),
        shell: shellOf(committed.state),
        assessment: committed.assessment
      });
      for (const step of steps) {
        await delay(STEP_MS);
        send2({ type: "step", ...step });
      }
      send2({ type: "done" });
      controller.close();
    }
  });
  return new Response(body, {
    headers: {
      "content-type": "text/event-stream; charset=utf-8",
      "cache-control": "no-cache, no-transform"
    }
  });
}
function publicProfileFrom(request) {
  if (request.method !== "GET" && request.method !== "HEAD") return null;
  const url = new URL(request.url);
  const slug = url.searchParams.get("profile") || publicProfileSlug(url.pathname);
  if (!slug) return null;
  const lang = url.searchParams.get("lang") === "en" ? "en" : "zh";
  const html = renderPublicProfileHtml(slug, lang);
  if (!html) return new Response("Not found", { status: 404 });
  return new Response(request.method === "HEAD" ? null : html, {
    headers: { "content-type": "text/html; charset=utf-8" }
  });
}
async function handleMissbunny(request) {
  const page = publicProfileFrom(request);
  if (page) return page;
  if (request.method !== "POST") {
    return Response.json({ error: "\u53EA\u63A5\u53D7 POST" }, { status: 405 });
  }
  let payload;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: "\u65E0\u6CD5\u8BFB\u53D6\u8BF7\u6C42" }, { status: 400 });
  }
  const token = typeof payload.token === "string" ? payload.token : request.headers.get("x-missbunny-token");
  const state = applyTimeouts(decodeState(token));
  const result = await dispatch(state, payload);
  if (result instanceof Response) return result;
  return streamEngine(result.state, result.draft);
}

// src/missbunny/server/node-handler.ts
function isWebRequest(value) {
  return typeof Request !== "undefined" && value instanceof Request;
}
async function fromNode(req) {
  const headers = new Headers();
  for (const [key2, value] of Object.entries(req.headers ?? {})) {
    if (typeof value === "string") headers.set(key2, value);
    else if (Array.isArray(value)) headers.set(key2, value.join(", "));
  }
  const host = headers.get("host") || "localhost";
  const url = new URL(req.url || "/api/missbunny", `https://${host}`);
  let body;
  if (req.method !== "GET" && req.method !== "HEAD") {
    if (typeof req.body === "string") body = req.body;
    else if (typeof Buffer !== "undefined" && Buffer.isBuffer(req.body)) {
      body = req.body.toString("utf8");
    } else if (req.body !== void 0) {
      body = JSON.stringify(req.body);
      if (!headers.has("content-type")) headers.set("content-type", "application/json");
    }
  }
  return new Request(url, { method: req.method, headers, body });
}
async function send(res, response) {
  res.statusCode = response.status;
  response.headers.forEach((value, key2) => {
    res.setHeader(key2, value);
  });
  res.end(Buffer.from(await response.arrayBuffer()));
}
async function handler(req, res) {
  try {
    const response = isWebRequest(req) ? await handleMissbunny(req) : await handleMissbunny(await fromNode(req));
    if (!res) return response;
    await send(res, response);
    return;
  } catch (error) {
    const message = error instanceof Error ? `${error.message}
${error.stack ?? ""}`.slice(0, 1200) : "failed";
    if (!res) return Response.json({ error: message }, { status: 500 });
    res.statusCode = 500;
    res.setHeader("content-type", "application/json; charset=utf-8");
    res.end(JSON.stringify({ error: message }));
  }
}
export {
  handler as default
};
