import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import type { ContractRouterClient } from "@orpc/contract";
import { describe, expect, it } from "vitest";
import type { OpsContract } from "../contract";
import { opsApp } from "./app";

function client(): ContractRouterClient<OpsContract> {
  const link = new RPCLink({
    url: "http://demo.localhost/api/missbunny",
    fetch: async (request) => opsApp.fetch(request),
  });
  return createORPCClient(link);
}

describe("ops api", () => {
  it("serves mock bots through oRPC and does not require a database", () => {
    expect(process.env.DATABASE_URL).toBeUndefined();
    const rpc = client();
    return rpc.bots.list().then((bots) => {
      expect(bots.map((bot) => bot.name)).toEqual(
        expect.arrayContaining(["总管", "接待", "档案", "推广", "收款", "巡检"]),
      );
    });
  });

  it("returns the scene numbers from overview", async () => {
    const overview = await client().overview();
    expect(overview.pending).toBe(3);
    expect(overview.collected).toBe("A$2,450");
    expect(overview.points).toBe(120);
    const memory = await client().memory();
    expect(memory.routines[0]?.trigger).toContain("21:30");
    const tools = await client().tools();
    expect(tools.tools.every((tool) => tool.status === "未连接")).toBe(true);
    expect(tools.computers.every((computer) => computer.status === "未启动")).toBe(true);
  });
});
