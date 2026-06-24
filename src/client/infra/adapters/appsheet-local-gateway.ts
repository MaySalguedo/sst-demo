import axios from "axios";
import { buildAlertsFromRows } from "@domain/alert-builder";
import { APPSHEET_TABLES } from "@domain/constants/appsheet-tables";
import { cell, type AppSheetRow } from "@domain/appsheet-row-utils";
import { countEppThisMonth, countRecentEpp } from "@domain/epp-utils";
import { mapExtinguisherRow } from "@domain/extinguisher-mapper";
import { isOpenInspectionStatus, trendsByArea } from "@domain/inspection-utils";
import type { AppConfig, AppConfigInput } from "@domain/models/app-config";
import type { ConnectionTestResult } from "@domain/models/connection-test-result";
import type { SstGateway } from "@domain/models/sst-gateway";
import { normalizeDate } from "@domain/date-utils";

let currentConfig: AppConfig = { ...__LOCAL_CONFIG__ };

async function find(table: string): Promise<AppSheetRow[]> {
  try {
    const response = await axios.post(
      `/appsheet-proxy/${encodeURIComponent(table)}`,
      {
        Action: "Find",
        Properties: { Locale: "en-US", Timezone: "UTC" },
        Rows: [],
      },
      { headers: { "Content-Type": "application/json" } },
    );

    const data = response.data;
    if (!data) return [];

    if (Array.isArray(data)) return data as AppSheetRow[];
    if (
      data &&
      typeof data === "object" &&
      Array.isArray((data as { Rows?: unknown }).Rows)
    ) {
      return (data as { Rows: AppSheetRow[] }).Rows;
    }
    return [];
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const body =
        typeof error.response.data === "string"
          ? error.response.data
          : JSON.stringify(error.response.data);
      throw new Error(
        `AppSheet API ${error.response.status}: ${body || "sin respuesta"}`,
        { cause: error },
      );
    }
    throw error;
  }
}

async function mutate(
  table: string,
  action: "Add" | "Edit" | "Delete",
  rows: Record<string, unknown>[],
): Promise<void> {
  await axios.post(
    `/appsheet-proxy/${encodeURIComponent(table)}`,
    {
      Action: action,
      Properties: { Locale: "en-US", Timezone: "UTC" },
      Rows: rows,
    },
    { headers: { "Content-Type": "application/json" } },
  );
}

export const appsheetLocalGateway: SstGateway = {
  async getDashboardSummary() {
    const [employees, extinguishers, epp, inspections] = await Promise.all([
      find(APPSHEET_TABLES.employees),
      find(APPSHEET_TABLES.extinguishers),
      find(APPSHEET_TABLES.epp),
      find(APPSHEET_TABLES.inspections),
    ]);

    const alerts = buildAlertsFromRows(
      employees,
      extinguishers,
      currentConfig.alertDaysBefore,
    );

    const eppRows = epp.map((row) => ({ date: normalizeDate(cell(row, "date")) }));

    return {
      expiredCount: alerts.filter((item) => item.status === "Vencido").length,
      upcomingCount: alerts.filter((item) => item.status === "Próximo").length,
      eppThisMonth: countEppThisMonth(eppRows),
      openInspections: inspections.filter((row) =>
        isOpenInspectionStatus(cell(row, "status")),
      ).length,
      recentEppCount: countRecentEpp(epp.length),
    };
  },

  async getAlertas() {
    const [employees, extinguishers] = await Promise.all([
      find(APPSHEET_TABLES.employees),
      find(APPSHEET_TABLES.extinguishers),
    ]);
    return buildAlertsFromRows(
      employees,
      extinguishers,
      currentConfig.alertDaysBefore,
    );
  },

  async getTendencias() {
    const inspections = await find(APPSHEET_TABLES.inspections);
    return trendsByArea(
      inspections.map((row) => ({ area: cell(row, "area") })),
    );
  },

  async getExtintores() {
    const extinguishers = await find(APPSHEET_TABLES.extinguishers);
    return extinguishers.map(mapExtinguisherRow);
  },

  async getConfig() {
    return currentConfig;
  },

  async saveConfig(partial: AppConfigInput) {
    const { appsheetAccessKey, ...rest } = partial;
    currentConfig = { ...currentConfig, ...rest } as AppConfig;
    if (appsheetAccessKey) currentConfig.hasAccessKey = true;
    return currentConfig;
  },

  async runAlertsNow() {
    const [employees, extinguishers] = await Promise.all([
      find(APPSHEET_TABLES.employees),
      find(APPSHEET_TABLES.extinguishers),
    ]);
    const alertCount = buildAlertsFromRows(
      employees,
      extinguishers,
      currentConfig.alertDaysBefore,
    ).length;

    return {
      sent: alertCount > 0,
      recipient: currentConfig.emailSst,
      alertCount,
      message:
        alertCount > 0
          ? `${alertCount} alertas detectadas.`
          : `Sin alertas pendientes.`,
    };
  },

  async getRows(table: string): Promise<Record<string, unknown>[]> {
    return find(table);
  },

  async addRow(table: string, row: Record<string, unknown>): Promise<void> {
    await mutate(table, "Add", [row]);
  },

  async updateRow(
    table: string,
    keys: Record<string, unknown>,
    row: Record<string, unknown>,
  ): Promise<void> {
    await mutate(table, "Edit", [{ ...keys, ...row }]);
  },

  async deleteRow(
    table: string,
    keys: Record<string, unknown>,
  ): Promise<void> {
    await mutate(table, "Delete", [keys]);
  },

  async testConnection(table?: string): Promise<ConnectionTestResult> {
    const target = table ?? APPSHEET_TABLES.employees;
    try {
      const rows = await find(target);
      return {
        ok: true,
        table: target,
        rowCount: rows.length,
        message: `Conexión correcta: ${rows.length} registros en "${target}".`,
      };
    } catch (error) {
      return {
        ok: false,
        table: target,
        rowCount: 0,
        message:
          error instanceof Error
            ? error.message
            : "Error consultando AppSheet.",
      };
    }
  },
};
