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
            withFailureHandler(handler: (error: Error) => void): {
              getDashboardSummary(): void;
              getAlertas(): void;
              getTendencias(): void;
              getExtintores(): void;
              getConfig(): void;
              saveConfig(partial: AppConfigInput): void;
              runAlertsNow(): void;
              testConnection(table?: string): void;
              getAppSheetRows(table: string): void;
              addAppSheetRow(table: string, row: string): void;
              updateAppSheetRow(table: string, keys: string, row: string): void;
              deleteAppSheetRow(table: string, keys: string): void;
            };
          };
        };
      };
    };
  }
}

export {};

function callGas<TResult>(
  invoke: (
    run: ReturnType<
      ReturnType<
        NonNullable<Window["google"]>["script"]["run"]["withSuccessHandler"]
      >["withFailureHandler"]
    >,
  ) => void,
  context: string,
): Promise<TResult> {
  return new Promise((resolve, reject) => {
    const runner = window.google?.script?.run;
    if (!runner) {
      reject(new Error("google.script.run no está disponible."));
      return;
    }

    try {
      invoke(
        runner
          .withSuccessHandler<TResult>(resolve)
          .withFailureHandler((error: Error) =>
            reject(error ?? new Error(`Error en ${context}`)),
          ),
      );
    } catch (error) {
      reject(error instanceof Error ? error : new Error(String(error)));
    }
  });
}

export const gasSstGateway: SstGateway = {
  getDashboardSummary: () =>
    callGas<DashboardSummary>(
      (run) => run.getDashboardSummary(),
      "getDashboardSummary",
    ),
  getAlertas: () =>
    callGas<AlertItem[]>((run) => run.getAlertas(), "getAlertas"),
  getTendencias: () =>
    callGas<TrendPoint[]>((run) => run.getTendencias(), "getTendencias"),
  getExtintores: () =>
    callGas<Extinguisher[]>((run) => run.getExtintores(), "getExtintores"),
  getConfig: () => callGas<AppConfig>((run) => run.getConfig(), "getConfig"),
  saveConfig: (partial: AppConfigInput) =>
    callGas<AppConfig>((run) => run.saveConfig(partial), "saveConfig"),
  runAlertsNow: () =>
    callGas<AlertRunResult>((run) => run.runAlertsNow(), "runAlertsNow"),
  testConnection: (table?: string) =>
    callGas<ConnectionTestResult>(
      (run) => run.testConnection(table),
      "testConnection",
    ),
  getRows: (table: string) =>
    callGas<Record<string, unknown>[]>(
      (run) => run.getAppSheetRows(table),
      "getAppSheetRows",
    ),
  addRow: (table: string, row: Record<string, unknown>) =>
    callGas<void>(
      (run) => run.addAppSheetRow(table, JSON.stringify(row)),
      "addAppSheetRow",
    ),
  updateRow: (
    table: string,
    keys: Record<string, unknown>,
    row: Record<string, unknown>,
  ) =>
    callGas<void>(
      (run) =>
        run.updateAppSheetRow(table, JSON.stringify(keys), JSON.stringify(row)),
      "updateAppSheetRow",
    ),
  deleteRow: (table: string, keys: Record<string, unknown>) =>
    callGas<void>(
      (run) => run.deleteAppSheetRow(table, JSON.stringify(keys)),
      "deleteAppSheetRow",
    ),
};
