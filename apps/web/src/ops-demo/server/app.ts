import { RPCHandler } from "@orpc/server/fetch";
import { Hono } from "hono";
import { opsRouter } from "./router";

export const OPS_PREFIX = "/api/missbunny";

export function createOpsApp() {
  const app = new Hono();
  const handler = new RPCHandler(opsRouter);
  app.on(["GET", "POST"], `${OPS_PREFIX}/*`, async (c) => {
    if (new URL(c.req.url).pathname === OPS_PREFIX) return c.json({ ok: true, mock: true });
    const result = await handler.handle(c.req.raw, {
      prefix: OPS_PREFIX,
      context: {},
    });
    if (!result.matched) return c.notFound();
    return result.response;
  });
  app.get(OPS_PREFIX, (c) => c.json({ ok: true, mock: true }));
  return app;
}

export const opsApp = createOpsApp();
