import type { TaskStatus } from "./domain";

/** Phase 1 event. A later worker stream can emit the same shape. */
export type ActivityEvent = {
  id: string;
  agent: string;
  task_id: string;
  step: number;
  total_steps: number;
  status: TaskStatus;
  message: string;
  message_en: string;
  output_ref: string | null;
  ts: string;
};

export type ActivityEventSource = {
  start: (onEvent: (event: ActivityEvent) => void) => void;
  pause: () => void;
  resume: () => void;
  replay: () => void;
  stop: () => void;
};

export type ScriptStep = {
  delayMs: number;
  event: Omit<ActivityEvent, "id" | "ts">;
};

export const FEED_LIMIT = 50;

export function trimFeed(events: ActivityEvent[], limit = FEED_LIMIT): ActivityEvent[] {
  if (events.length <= limit) return events;
  return events.slice(events.length - limit);
}

export const activityScript: ScriptStep[] = [
  {
    delayMs: 1000,
    event: {
      agent: "接待",
      task_id: "live-reception",
      step: 1,
      total_steps: 3,
      status: "排队",
      message: "排队：回复 Jason 的档期",
      message_en: "Queued: answer Jason",
      output_ref: "out-jason",
    },
  },
  {
    delayMs: 2000,
    event: {
      agent: "接待",
      task_id: "live-reception",
      step: 2,
      total_steps: 3,
      status: "执行中",
      message: "正在写周五晚的回复",
      message_en: "Writing Friday's reply",
      output_ref: "out-jason",
    },
  },
  {
    delayMs: 2000,
    event: {
      agent: "接待",
      task_id: "live-reception",
      step: 3,
      total_steps: 3,
      status: "完成",
      message: "草稿已放进时间线",
      message_en: "Draft is on the timeline",
      output_ref: "out-jason",
    },
  },
  {
    delayMs: 4000,
    event: {
      agent: "档案",
      task_id: "live-records",
      step: 1,
      total_steps: 2,
      status: "排队",
      message: "排队：核对 Leo 的信誉",
      message_en: "Queued: check Leo",
      output_ref: "out-leo",
    },
  },
  {
    delayMs: 4000,
    event: {
      agent: "档案",
      task_id: "live-records",
      step: 2,
      total_steps: 2,
      status: "执行中",
      message: "在整理爽约记录",
      message_en: "Reading the no-show note",
      output_ref: "out-leo",
    },
  },
  {
    delayMs: 4000,
    event: {
      agent: "推广",
      task_id: "live-promo",
      step: 2,
      total_steps: 4,
      status: "执行中",
      message: "写周末推送草稿",
      message_en: "Writing the weekend post",
      output_ref: "out-promo",
    },
  },
  {
    delayMs: 4000,
    event: {
      agent: "推广",
      task_id: "live-promo",
      step: 4,
      total_steps: 4,
      status: "等批",
      message: "等她确认：本周五晚有空档",
      message_en: "Waiting: Friday evening is open",
      output_ref: "out-promo",
    },
  },
  {
    delayMs: 4000,
    event: {
      agent: "收款",
      task_id: "pay-tom",
      step: 3,
      total_steps: 3,
      status: "完成",
      message: "到账记录已写下",
      message_en: "Payment note written",
      output_ref: "out-tom",
    },
  },
];

export function createMockActivitySource(script: ScriptStep[]): ActivityEventSource {
  let timer: ReturnType<typeof setTimeout> | null = null;
  let index = 0;
  let paused = false;
  let listener: ((event: ActivityEvent) => void) | null = null;
  let serial = 0;

  const clear = () => {
    if (timer) clearTimeout(timer);
    timer = null;
  };

  const schedule = () => {
    if (paused || !listener || index >= script.length) return;
    const step = script[index];
    if (!step) return;
    timer = setTimeout(() => {
      index += 1;
      serial += 1;
      listener?.({
        ...step.event,
        id: `evt-${serial}`,
        ts: new Date().toISOString(),
      });
      schedule();
    }, step.delayMs);
  };

  return {
    start(onEvent) {
      clear();
      listener = onEvent;
      index = 0;
      paused = false;
      schedule();
    },
    pause() {
      paused = true;
      clear();
    },
    resume() {
      if (!paused) return;
      paused = false;
      schedule();
    },
    replay() {
      clear();
      index = 0;
      paused = false;
      schedule();
    },
    stop() {
      clear();
      listener = null;
      paused = false;
    },
  };
}
