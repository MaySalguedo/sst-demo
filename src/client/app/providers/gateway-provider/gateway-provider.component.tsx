import { createContext, type ReactNode } from "react";
import type { SstGateway } from "@domain/types";
import { appsheetLocalGateway } from "@infra/adapters/appsheet-local-gateway";
import { gasSstGateway } from "@infra/adapters/gas-sst-gateway";

export const GatewayContext = createContext<SstGateway>(appsheetLocalGateway);

function createGateway(): SstGateway {
  if (typeof window !== "undefined" && window.google?.script?.run) {
    return gasSstGateway;
  }
  return appsheetLocalGateway;
}

export function GatewayProviderComponent({ children }: { children: ReactNode }) {
  return (
    <GatewayContext.Provider value={createGateway()}>
      {children}
    </GatewayContext.Provider>
  );
}
