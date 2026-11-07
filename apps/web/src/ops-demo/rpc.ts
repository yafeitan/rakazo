import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import type { ContractRouterClient } from "@orpc/contract";
import type { OpsContract } from "./contract";

export function createOpsClient(): ContractRouterClient<OpsContract> {
  const link = new RPCLink({
    url: new URL("/api/missbunny", window.location.origin).toString(),
  });
  return createORPCClient(link);
}
