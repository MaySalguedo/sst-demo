import { useContext } from "react";
import type { SstGateway } from "@domain/types";
import { GatewayContext } from "@app/providers/gateway-provider/gateway-provider.component";

export function useGateway(): SstGateway {
  const gateway = useContext(GatewayContext);
  if (!gateway) {
    throw new Error("GatewayProvider es requerido.");
  }
  return gateway;
}
