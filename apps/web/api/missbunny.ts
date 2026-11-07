import { handleMissbunny } from "../src/missbunny/server/http";

export function POST(request: Request): Promise<Response> {
  return handleMissbunny(request);
}
