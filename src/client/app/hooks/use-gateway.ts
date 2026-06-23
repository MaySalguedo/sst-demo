import { useContext } from "react";
import type { SstGateway } from "@domain/types";
import { GatewayContext } from "@app/providers/gateway-provider/gateway-provider.component";

export function useGateway(): SstGateway {
  return useContext(GatewayContext);
}
