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
  const response = await fetch(`/appsheet-proxy/${encodeURIComponent(table)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      Action: "Find",
      Properties: { Locale: "en-US", Timezone: "UTC" },
      Rows: [],
    }),
  });

  const text = await response.text();
  if (!response.ok) {
    throw new Error(`AppSheet API ${response.status}: ${text || "sin respuesta"}`);
  }
  if (!text) return [];

  const parsed = JSON.parse(text) as unknown;
  if (Array.isArray(parsed)) return parsed as AppSheetRow[];
  if (
    parsed &&
    typeof parsed === "object" &&
    Array.isArray((parsed as { Rows?: unknown }).Rows)
  ) {
    return (parsed as { Rows: AppSheetRow[] }).Rows;
  }
  return [];
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
      sent: false,
      recipient: currentConfig.emailSst,
      alertCount,
      message: `Local: ${alertCount} alertas detectadas (los correos solo se envían en la versión desplegada).`,
    };
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
