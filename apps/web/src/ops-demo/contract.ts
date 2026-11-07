import { oc } from "@orpc/contract";
import * as z from "zod";

const BotSchema = z.object({
  id: z.string(),
  name: z.string(),
  role: z.string(),
  sceneId: z.string().nullable(),
  status: z.string(),
  modelSummary: z.string(),
  skillSummary: z.string(),
  description: z.string(),
});

const MemorySchema = z.object({
  id: z.string(),
  text: z.string(),
  source: z.string(),
});

const SkillSchema = z.object({
  id: z.string(),
  name: z.string(),
  summary: z.string(),
});

const RoutineSchema = z.object({
  id: z.string(),
  name: z.string(),
  trigger: z.string(),
  summary: z.string(),
});

const ToolSchema = z.object({
  id: z.string(),
  name: z.string(),
  status: z.string(),
  summary: z.string(),
});

const ComputerSchema = z.object({
  id: z.string(),
  name: z.string(),
  status: z.string(),
  summary: z.string(),
});

export const opsContract = {
  health: oc.output(z.object({ ok: z.literal(true), mock: z.literal(true) })),
  overview: oc.output(
    z.object({
      pending: z.number(),
      collected: z.string(),
      points: z.number(),
      bots: z.array(BotSchema),
    }),
  ),
  bots: {
    list: oc.output(z.array(BotSchema)),
    get: oc.input(z.object({ id: z.string() })).output(BotSchema.nullable()),
  },
  memory: oc.output(
    z.object({
      memories: z.array(MemorySchema),
      skills: z.array(SkillSchema),
      routines: z.array(RoutineSchema),
    }),
  ),
  tools: oc.output(
    z.object({
      tools: z.array(ToolSchema),
      computers: z.array(ComputerSchema),
      settings: z.object({ approval: z.string(), model: z.string() }),
    }),
  ),
};

export type OpsContract = typeof opsContract;
