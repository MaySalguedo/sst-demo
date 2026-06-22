import type {
  AlertItem,
  AppConfig,
  AppConfigInput,
  ConnectionTestResult,
  DashboardSummary,
  Extinguisher,
  SstGateway,
  TrendPoint,
} from "@domain/types";
import {
  daysUntil,
  normalizeDate,
  resolveExpirationStatus,
} from "@domain/date-utils";

const TABLES = {
  employees: "employees",
  epp: "ppe_deliveries",
  inspections: "inspections",
  extinguishers: "extinguishers",
} as const;

type Row = Record<string, unknown>;

let currentConfig: AppConfig = { ...__LOCAL_CONFIG__ };

function cell(row: Row, key: string): string {
  return String(row[key] ?? "").trim();
}

async function find(table: string): Promise<Row[]> {
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
  if (Array.isArray(parsed)) return parsed as Row[];
  if (
    parsed &&
    typeof parsed === "object" &&
    Array.isArray((parsed as { Rows?: unknown }).Rows)
  ) {
    return (parsed as { Rows: Row[] }).Rows;
  }
  return [];
}

function buildAlerts(
  employees: Row[],
  extinguishers: Row[],
  alertDaysBefore: number,
): AlertItem[] {
  const alerts: AlertItem[] = [];

  for (const row of employees) {
    const dueDate = normalizeDate(cell(row, "medical_exam_expiry"));
    const daysRemaining = daysUntil(dueDate);
    if (daysRemaining <= alertDaysBefore) {
      alerts.push({
        id: cell(row, "employee_id"),
        type: "examen_medico",
        label: cell(row, "full_name"),
        detail: cell(row, "area"),
        dueDate,
        daysRemaining,
        status: resolveExpirationStatus(daysRemaining),
      });
    }
  }

  for (const row of extinguishers) {
    const dueDate = normalizeDate(cell(row, "next_recharge"));
    const daysRemaining = daysUntil(dueDate);
    if (daysRemaining <= alertDaysBefore) {
      alerts.push({
        id: cell(row, "code"),
        type: "extintor",
        label: cell(row, "code"),
        detail: cell(row, "location"),
        dueDate,
        daysRemaining,
        status: resolveExpirationStatus(daysRemaining),
      });
    }
  }

  return alerts.sort((a, b) => a.daysRemaining - b.daysRemaining);
}

function mapExtinguisher(row: Row): Extinguisher {
  const nextRecharge = normalizeDate(cell(row, "next_recharge"));
  return {
    code: cell(row, "code"),
    location: cell(row, "location"),
    type: cell(row, "type"),
    lastRecharge: normalizeDate(cell(row, "last_recharge")),
    nextRecharge,
    status: resolveExpirationStatus(daysUntil(nextRecharge)),
  };
}

export const appsheetLocalGateway: SstGateway = {
  async getDashboardSummary(): Promise<DashboardSummary> {
    const [employees, extinguishers, epp, inspections] = await Promise.all([
      find(TABLES.employees),
      find(TABLES.extinguishers),
      find(TABLES.epp),
      find(TABLES.inspections),
    ]);

    const alerts = buildAlerts(
      employees,
      extinguishers,
      currentConfig.alertDaysBefore,
    );
    const now = new Date();

    const eppThisMonth = epp.filter((row) => {
      const isoDate = normalizeDate(cell(row, "date"));
      if (!isoDate) return false;
      const date = new Date(`${isoDate}T00:00:00`);
      return (
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()
      );
    }).length;

    const openInspections = inspections.filter((row) =>
      ["abierta", "pendiente", "open", "pending"].includes(
        cell(row, "status").toLowerCase(),
      ),
    ).length;

    return {
      expiredCount: alerts.filter((item) => item.status === "Vencido").length,
      upcomingCount: alerts.filter((item) => item.status === "Próximo").length,
      eppThisMonth,
      openInspections,
      recentEppCount: Math.min(5, epp.length),
    };
  },

  async getAlertas(): Promise<AlertItem[]> {
    const [employees, extinguishers] = await Promise.all([
      find(TABLES.employees),
      find(TABLES.extinguishers),
    ]);
    return buildAlerts(employees, extinguishers, currentConfig.alertDaysBefore);
  },

  async getTendencias(): Promise<TrendPoint[]> {
    const inspections = await find(TABLES.inspections);
    const counts = new Map<string, number>();
    for (const row of inspections) {
      const area = cell(row, "area") || "Sin área";
      counts.set(area, (counts.get(area) ?? 0) + 1);
    }
    return [...counts.entries()].map(([label, value]) => ({ label, value }));
  },

  async getExtintores(): Promise<Extinguisher[]> {
    const extinguishers = await find(TABLES.extinguishers);
    return extinguishers.map(mapExtinguisher);
  },

  async getConfig(): Promise<AppConfig> {
    return currentConfig;
  },

  async saveConfig(partial: AppConfigInput): Promise<AppConfig> {
    const { appsheetAccessKey, ...rest } = partial;
    currentConfig = { ...currentConfig, ...rest } as AppConfig;
    if (appsheetAccessKey) currentConfig.hasAccessKey = true;
    return currentConfig;
  },

  async runAlertsNow() {
    const [employees, extinguishers] = await Promise.all([
      find(TABLES.employees),
      find(TABLES.extinguishers),
    ]);
    const alertCount = buildAlerts(
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
    const target = table ?? TABLES.employees;
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
