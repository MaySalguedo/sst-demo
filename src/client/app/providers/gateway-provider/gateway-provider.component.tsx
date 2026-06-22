import { createContext, type ReactNode } from "react";
import type { SstGateway } from "@domain/types";
import { appsheetLocalGateway } from "@infra/adapters/appsheet-local-gateway";
import { gasSstGateway } from "@infra/adapters/gas-sst-gateway";

export const GatewayContext = createContext<SstGateway | null>(null);

function createGateway(): SstGateway {
  if (typeof window !== "undefined" && window.google?.script?.run) {
    return gasSstGateway;
  }
  if (__LOCAL_CONFIG__.appsheetAppId && __LOCAL_CONFIG__.hasAccessKey) {
    return appsheetLocalGateway;
  }
  throw new Error(
    "Configura APPSHEET_APP_ID y APPSHEET_ACCESS_KEY en .env antes de ejecutar pnpm dev.",
  );
}

export function GatewayProviderComponent({ children }: { children: ReactNode }) {
  return (
    <GatewayContext.Provider value={createGateway()}>
      {children}
    </GatewayContext.Provider>
  );
}
