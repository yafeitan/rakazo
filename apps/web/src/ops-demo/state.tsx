import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { ActivityEvent } from "./activity";
import { activityScript, createMockActivitySource, trimFeed } from "./activity";
import type { DemoBot, Draft, GuestId, Lang, TaskCard, TaskStatus } from "./domain";
import {
  agentLine,
  agentStatus,
  COLLECTED_CENTS,
  canSend,
  pendingCount,
  STARTING_POINTS,
  seedBots,
  seedDrafts,
  seedGuests,
  seedMessages,
  seedTasks,
  tomReminder,
  tomSummary,
  typingDelayMs,
} from "./domain";

export type WalkIn = {
  when: string;
  duration: string;
  place: string;
  cents: number;
};

type DemoValue = {
  drafts: Draft[];
  messages: typeof seedMessages;
  tasks: TaskCard[];
  feed: ActivityEvent[];
  paused: boolean;
  points: number;
  collectedCents: number;
  paymentPending: boolean;
  walkIn: WalkIn | null;
  walkInUnlocked: boolean;
  guestPaid: boolean;
  extraBots: DemoBot[];
  topUpOpen: boolean;
  now: number;
  bots: DemoBot[];
  pending: number;
  setTopUpOpen: (open: boolean) => void;
  addPoints: (amount: number) => void;
  sendDraft: (id: string) => void;
  confirmDraft: (id: string) => void;
  editDraft: (id: string, body: string) => void;
  setWalkIn: (value: WalkIn) => void;
  markGuestPaid: () => void;
  confirmReceived: (lang: Lang) => void;
  approveTask: (id: string, lang: Lang) => void;
  editTask: (id: string, output: string, lang: Lang) => void;
  pauseFeed: () => void;
  resumeFeed: () => void;
  replayFeed: () => void;
  registerScene: (bot: DemoBot) => void;
  approveScene: (id: string, lang: Lang) => void;
  agentView: (lang: Lang) => Array<{
    id: "reception" | "records" | "promo" | "payments";
    status: ReturnType<typeof agentStatus>;
    line: string;
    badge: number;
  }>;
};

const DemoContext = createContext<DemoValue | null>(null);

function taskFromEvent(event: ActivityEvent, previous?: TaskCard): TaskCard {
  return {
    id: event.task_id,
    agent: event.agent,
    title: previous?.title ?? event.message,
    status: event.status,
    step: event.step,
    total: event.total_steps,
    outputRef: event.output_ref ?? previous?.outputRef ?? "",
    output: previous?.output ?? event.message,
  };
}

export function DemoProvider({ children }: { children: ReactNode }) {
  const [drafts, setDrafts] = useState<Draft[]>(seedDrafts);
  const [messages, setMessages] = useState(seedMessages);
  const [tasks, setTasks] = useState<TaskCard[]>(seedTasks);
  const [feed, setFeed] = useState<ActivityEvent[]>([]);
  const [paused, setPaused] = useState(false);
  const [points, setPoints] = useState(STARTING_POINTS);
  const [collectedCents, setCollectedCents] = useState(COLLECTED_CENTS);
  const [paymentPending, setPaymentPending] = useState(false);
  const [walkIn, setWalkInState] = useState<WalkIn | null>(null);
  const [walkInUnlocked, setWalkInUnlocked] = useState(false);
  const [guestPaid, setGuestPaid] = useState(false);
  const [extraBots, setExtraBots] = useState<DemoBot[]>([]);
  const [topUpOpen, setTopUpOpen] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const source = useRef(createMockActivitySource(activityScript));
  const tasksRef = useRef(tasks);
  tasksRef.current = tasks;

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const current = source.current;
    current.start((event) => {
      setFeed((items) => trimFeed([...items, event]));
      setTasks((items) => {
        const previous = items.find((item) => item.id === event.task_id);
        const next = taskFromEvent(event, previous);
        if (!previous) return [next, ...items];
        return items.map((item) => (item.id === next.id ? next : item));
      });
    });
    return () => current.stop();
  }, []);

  const push = (event: ActivityEvent) => setFeed((items) => trimFeed([...items, event]));

  const localEvent = (
    agent: string,
    taskId: string,
    status: TaskStatus,
    message: string,
    messageEn: string,
    outputRef: string | null,
  ): ActivityEvent => ({
    id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    agent,
    task_id: taskId,
    step: 1,
    total_steps: 1,
    status,
    message,
    message_en: messageEn,
    output_ref: outputRef,
    ts: new Date().toISOString(),
  });

  const value = useMemo<DemoValue>(() => {
    const bots = [...seedBots, ...extraBots];
    return {
      drafts,
      messages,
      tasks,
      feed,
      paused,
      points,
      collectedCents,
      paymentPending,
      walkIn,
      walkInUnlocked,
      guestPaid,
      extraBots,
      topUpOpen,
      now,
      bots,
      pending: pendingCount(drafts, paymentPending),
      setTopUpOpen,
      addPoints: (amount) => setPoints((value) => value + amount),
      sendDraft: (id) => {
        const draft = drafts.find((item) => item.id === id);
        if (!draft || !canSend(draft)) return;
        setDrafts((items) =>
          items.map((item) => (item.id === id ? { ...item, state: "done" } : item)),
        );
        if (draft.guestId) {
          const guestId = draft.guestId;
          const visibleAt = Date.now() + typingDelayMs(draft.body);
          setMessages((items) => ({
            ...items,
            [guestId]: [
              ...items[guestId],
              { id: `her-${id}`, role: "her", text: draft.body, guestVisibleAt: visibleAt },
            ],
          }));
        }
      },
      confirmDraft: (id) =>
        setDrafts((items) =>
          items.map((item) => (item.id === id ? { ...item, confirmed: true } : item)),
        ),
      editDraft: (id, body) =>
        setDrafts((items) =>
          items.map((item) => (item.id === id ? { ...item, body, edited: true } : item)),
        ),
      setWalkIn: (next) => setWalkInState(next),
      markGuestPaid: () => {
        setGuestPaid(true);
        setPaymentPending(true);
      },
      confirmReceived: (lang) => {
        if (!paymentPending) return;
        setPaymentPending(false);
        setWalkInUnlocked(true);
        setCollectedCents((value) => value + (walkIn?.cents ?? 0));
        push(
          localEvent(
            "收款",
            "walk-in",
            "完成",
            lang === "en" ? "She confirmed the payment" : "她确认已收款",
            "She confirmed the payment",
            null,
          ),
        );
      },
      approveTask: (id, lang) => {
        const task = tasks.find((item) => item.id === id);
        if (task?.status !== "等批") return;
        setTasks((items) =>
          items.map((item) =>
            item.id === id ? { ...item, status: "完成", step: item.total } : item,
          ),
        );
        push(
          localEvent(
            task.agent,
            id,
            "完成",
            lang === "en" ? "She approved it" : "她批准了",
            "She approved it",
            task.outputRef,
          ),
        );
      },
      editTask: (id, output, lang) => {
        setTasks((items) => items.map((item) => (item.id === id ? { ...item, output } : item)));
        const task = tasks.find((item) => item.id === id);
        push(
          localEvent(
            task?.agent ?? "推广",
            id,
            "等批",
            lang === "en" ? "She edited it" : "她改了一下",
            "She edited it",
            task?.outputRef ?? null,
          ),
        );
      },
      pauseFeed: () => {
        source.current.pause();
        setPaused(true);
      },
      resumeFeed: () => {
        source.current.resume();
        setPaused(false);
      },
      replayFeed: () => {
        setFeed([]);
        setTasks(seedTasks);
        setPaused(false);
        source.current.replay();
      },
      registerScene: (bot) => {
        setExtraBots((items) => {
          const rest = items.filter((item) => item.id !== bot.id);
          return [...rest, bot];
        });
        push(
          localEvent("总管", bot.id, "等批", `${bot.name} 等批`, `${bot.name} is waiting`, null),
        );
      },
      approveScene: (id, lang) => {
        const bot = extraBots.find((item) => item.id === id);
        setExtraBots((items) =>
          items.map((item) => (item.id === id ? { ...item, status: "完成" } : item)),
        );
        push(
          localEvent(
            "总管",
            id,
            "完成",
            lang === "en" ? `${bot?.name ?? id} is ready` : `${bot?.name ?? id} 已完成`,
            `${bot?.name ?? id} is ready`,
            null,
          ),
        );
      },
      agentView: (lang) =>
        (["reception", "records", "promo", "payments"] as const).map((id) => ({
          id,
          status: agentStatus(id, drafts, paymentPending),
          line:
            id === "payments" && paymentPending
              ? lang === "en"
                ? "A guest says they paid"
                : "有客人说已付款"
              : agentLine(id, drafts, lang),
          badge:
            drafts.filter(
              (draft) =>
                draft.agentId === id && draft.state === "open" && draft.tag === "需本人回复",
            ).length + (id === "payments" && paymentPending ? 1 : 0),
        })),
    };
  }, [
    collectedCents,
    drafts,
    extraBots,
    feed,
    guestPaid,
    messages,
    now,
    paused,
    paymentPending,
    points,
    tasks,
    topUpOpen,
    walkIn,
    walkInUnlocked,
  ]);

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemo(): DemoValue {
  const value = useContext(DemoContext);
  if (!value) throw new Error("DemoProvider missing");
  return value;
}

export function guestById(id: GuestId) {
  return seedGuests.find((guest) => guest.id === id);
}

export function reminderCopy(lang: Lang): { summary: string; reminder: string } {
  return { summary: tomSummary(lang), reminder: tomReminder(lang) };
}
