import { createContext, useContext, type ReactNode } from "react";
import type { SstGateway } from "@domain/types";
import { appsheetLocalGateway } from "@infra/adapters/appsheet-local-gateway";
import { gasSstGateway } from "@infra/adapters/gas-sst-gateway";
import { mockSstGateway } from "@infra/adapters/mock-sst-gateway";

type Gateway = SstGateway;

const GatewayContext = createContext<Gateway | null>(null);

function createGateway(): Gateway {
  if (typeof window !== "undefined" && window.google?.script?.run) {
    return gasSstGateway;
  }
  if (__LOCAL_CONFIG__.appsheetAppId && __LOCAL_CONFIG__.hasAccessKey) {
    return appsheetLocalGateway;
  }
  return mockSstGateway;
}

export function GatewayProvider({ children }: { children: ReactNode }) {
  return (
    <GatewayContext.Provider value={createGateway()}>
      {children}
    </GatewayContext.Provider>
  );
}

export function useGateway(): Gateway {
  const gateway = useContext(GatewayContext);
  if (!gateway) {
    throw new Error("GatewayProvider es requerido.");
  }
  return gateway;
}
