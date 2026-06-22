import type {
  AlertItem,
  AlertRunResult,
  AppConfig,
  AppConfigInput,
  ConnectionTestResult,
  DashboardSummary,
  Extinguisher,
  SstGateway,
  TrendPoint,
} from "@domain/types";

declare global {
  interface Window {
    google?: {
      script: {
        run: {
          withSuccessHandler<T>(handler: (result: T) => void): {
            withFailureHandler(handler: (error: Error) => void): Record<
              string,
              (...args: unknown[]) => void
            >;
          };
        };
      };
    };
  }
}

export {};

function callGas<T>(functionName: string, ...args: unknown[]): Promise<T> {
  return new Promise((resolve, reject) => {
    const runner = window.google?.script?.run;
    if (!runner) {
      reject(new Error("google.script.run no está disponible."));
      return;
    }

    const api = runner
      .withSuccessHandler<T>(resolve)
      .withFailureHandler((error: Error) =>
        reject(error ?? new Error(`Error en ${functionName}`)),
      );

    const fn = api[functionName];
    if (!fn) {
      reject(new Error(`Función ${functionName} no existe en el servidor.`));
      return;
    }
    fn(...args);
  });
}

export const gasSstGateway: SstGateway = {
  getDashboardSummary: () => callGas<DashboardSummary>("getDashboardSummary"),
  getAlertas: () => callGas<AlertItem[]>("getAlertas"),
  getTendencias: () => callGas<TrendPoint[]>("getTendencias"),
  getExtintores: () => callGas<Extinguisher[]>("getExtintores"),
  getConfig: () => callGas<AppConfig>("getConfig"),
  saveConfig: (partial: AppConfigInput) =>
    callGas<AppConfig>("saveConfig", partial),
  runAlertsNow: () => callGas<AlertRunResult>("runAlertsNow"),
  testConnection: (table?: string) =>
    callGas<ConnectionTestResult>("testConnection", table),
};
