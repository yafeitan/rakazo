import { implement } from "@orpc/server";
import { opsContract } from "../contract";
import { prisma } from "../db/client";
import { COLLECTED_CENTS, formatAud, pendingCount, STARTING_POINTS, seedDrafts } from "../domain";

const os = implement(opsContract);

export function createOpsRouter() {
  return os.router({
    health: os.health.handler(() => ({ ok: true as const, mock: true as const })),
    overview: os.overview.handler(async () => ({
      pending: pendingCount(seedDrafts, false),
      collected: formatAud(COLLECTED_CENTS),
      points: STARTING_POINTS,
      bots: await prisma.demoBot.findMany(),
    })),
    bots: {
      list: os.bots.list.handler(async () => prisma.demoBot.findMany()),
      get: os.bots.get.handler(async ({ input }) =>
        prisma.demoBot.findUnique({ where: { id: input.id } }),
      ),
    },
    memory: os.memory.handler(async () => ({
      memories: await prisma.demoMemory.findMany(),
      skills: await prisma.demoSkill.findMany(),
      routines: await prisma.demoRoutine.findMany(),
    })),
    tools: os.tools.handler(async () => ({
      tools: await prisma.demoTool.findMany(),
      computers: await prisma.demoComputer.findMany(),
      settings: {
        approval: "定金、砍价、犹豫、发出推广，都要她点头。",
        model: "已配置。具体模型待确认。",
      },
    })),
  });
}

export const opsRouter = createOpsRouter();
