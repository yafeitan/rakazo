import type {
  DemoBot,
  DemoComputer,
  DemoMemory,
  DemoRoutine,
  DemoSkill,
  DemoTool,
} from "../domain";
import {
  seedBots,
  seedComputers,
  seedGuests,
  seedMemories,
  seedRoutines,
  seedSkills,
  seedTools,
} from "../domain";

type Where = { where: { id: string } };

function table<T extends { id: string }>(rows: T[]) {
  return {
    findMany: async (): Promise<T[]> => rows.map((row) => ({ ...row })),
    findUnique: async (args: Where): Promise<T | null> =>
      rows.find((row) => row.id === args.where.id) ?? null,
  };
}

/**
 * Prisma-shaped reader for the demo schema. It never calls PrismaClient.$connect
 * and never reads a connection string.
 */
export function createDemoPrisma() {
  return {
    demoBot: table<DemoBot>(seedBots),
    demoMemory: table<DemoMemory>(seedMemories),
    demoSkill: table<DemoSkill>(seedSkills),
    demoRoutine: table<DemoRoutine>(seedRoutines),
    demoTool: table<DemoTool>(seedTools),
    demoComputer: table<DemoComputer>(seedComputers),
    demoGuest: table(seedGuests.map((guest) => ({ ...guest, whenText: guest.when }))),
  };
}

export const prisma = createDemoPrisma();

export type DemoPrisma = ReturnType<typeof createDemoPrisma>;
