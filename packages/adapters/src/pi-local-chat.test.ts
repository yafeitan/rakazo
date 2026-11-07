import { describe, expect, it } from "vitest";
import { completeLocalChat } from "./pi-local-chat.js";

describe("completeLocalChat", () => {
  it("does nothing when no local model is configured", async () => {
    await expect(completeLocalChat([{ role: "user", content: "hi" }], { env: {} })).resolves.toBe(
      null,
    );
  });

  it("uses the default local base URL when only the model list is set", async () => {
    let seen = "";
    const fetchImpl = (async (input: RequestInfo | URL) => {
      seen = String(input);
      return new Response(JSON.stringify({ choices: [{ message: { content: "ok" } }] }), {
        status: 200,
        headers: { "content-type": "application/json" },
      });
    }) as typeof fetch;
    const text = await completeLocalChat([{ role: "user", content: "hi" }], {
      env: { RAKAZO_LOCAL_MODELS: "demo-model" },
      fetch: fetchImpl,
    });
    expect(text).toBe("ok");
    expect(seen).toBe("http://127.0.0.1:11434/v1/chat/completions");
  });
});
