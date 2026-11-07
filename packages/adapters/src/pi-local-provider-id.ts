/**
 * Local OpenAI-compatible model server (Ollama, LM Studio, llama.cpp, MLX).
 * Kept apart from pi-local-provider.ts so the runtime limits can name it without loading the provider.
 */
export const LOCAL_PROVIDER_ID = "local";

const DEFAULT_LOCAL_BASE_URL = "http://127.0.0.1:11434/v1";

/**
 * Base URL for the local model server. A configured model list with no URL uses this default,
 * matching the provider registration.
 */
export function localBaseUrl(env: NodeJS.ProcessEnv = process.env): string {
  const value = env.RAKAZO_LOCAL_MODELS_URL?.trim() || DEFAULT_LOCAL_BASE_URL;
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new Error("RAKAZO_LOCAL_MODELS_URL must be an absolute HTTP(S) URL");
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("RAKAZO_LOCAL_MODELS_URL must be an absolute HTTP(S) URL");
  }
  return value;
}

/** Comma-separated model ids exactly as the local server names them. */
export function localModelIds(env: NodeJS.ProcessEnv = process.env): string[] {
  return (env.RAKAZO_LOCAL_MODELS ?? "")
    .split(",")
    .map((id) => id.trim())
    .filter((id) => id.length > 0);
}
