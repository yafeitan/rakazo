import { afterEach, describe, expect, it, vi } from "vitest";
import type { ActivityEvent } from "./activity";
import { activityScript, createMockActivitySource, trimFeed } from "./activity";

afterEach(() => {
  vi.useRealTimers();
});

describe("activity script", () => {
  it("emits three events within ten seconds and every status", () => {
    vi.useFakeTimers();
    const seen: ActivityEvent[] = [];
    const source = createMockActivitySource(activityScript);
    source.start((event) => seen.push(event));
    vi.advanceTimersByTime(10_000);
    expect(seen.length).toBeGreaterThanOrEqual(3);
    source.stop();
    const statuses = new Set(activityScript.map((step) => step.event.status));
    expect(statuses).toEqual(new Set(["排队", "执行中", "完成", "等批"]));
    const first = seen[0];
    expect(first?.agent).toBe("接待");
    expect(first?.step).toBe(1);
    expect(first?.total_steps).toBe(3);
    expect(first?.output_ref).toBe("out-jason");
  });

  it("pauses, resumes, replays, and keeps the newest fifty", () => {
    vi.useFakeTimers();
    const seen: ActivityEvent[] = [];
    const source = createMockActivitySource(activityScript);
    source.start((event) => seen.push(event));
    vi.advanceTimersByTime(1000);
    expect(seen).toHaveLength(1);
    source.pause();
    vi.advanceTimersByTime(10_000);
    expect(seen).toHaveLength(1);
    source.resume();
    vi.advanceTimersByTime(2000);
    expect(seen).toHaveLength(2);
    source.replay();
    vi.advanceTimersByTime(1000);
    expect(seen).toHaveLength(3);
    expect(seen[2]?.message).toBe(seen[0]?.message);
    source.stop();
    const many = Array.from({ length: 60 }, (_, index) => ({
      ...(activityScript[0]?.event ?? {
        agent: "接待",
        task_id: "x",
        step: 1,
        total_steps: 1,
        status: "完成" as const,
        message: "x",
        message_en: "x",
        output_ref: null,
      }),
      id: `id-${index}`,
      ts: "t",
    }));
    expect(trimFeed(many)).toHaveLength(50);
    expect(trimFeed(many)[0]?.id).toBe("id-10");
  });
});
