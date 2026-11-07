import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";
import type { DemoState } from "../domain";
import { seedState } from "../seed";

const SECRET = process.env.MISSBUNNY_STATE_SECRET ?? "missbunny-demo";

function key(): Buffer {
  return createHash("sha256").update(SECRET).digest();
}

/** Opaque blob so the browser can round-trip demo state without reading secrets. */
export function encodeState(state: DemoState): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key(), iv);
  const encrypted = Buffer.concat([cipher.update(JSON.stringify(state), "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, encrypted]).toString("base64url");
}

export function decodeState(token: string | null | undefined): DemoState {
  if (!token) return seedState();
  try {
    const buffer = Buffer.from(token, "base64url");
    const iv = buffer.subarray(0, 12);
    const tag = buffer.subarray(12, 28);
    const encrypted = buffer.subarray(28);
    const decipher = createDecipheriv("aes-256-gcm", key(), iv);
    decipher.setAuthTag(tag);
    const plain = Buffer.concat([decipher.update(encrypted), decipher.final()]).toString("utf8");
    const parsed = JSON.parse(plain) as DemoState;
    if (!parsed.session || !Array.isArray(parsed.profiles) || !Array.isArray(parsed.orders)) {
      return seedState();
    }
    return parsed;
  } catch {
    return seedState();
  }
}
