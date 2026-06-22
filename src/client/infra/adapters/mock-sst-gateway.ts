import type { AppConfig, AppConfigInput, SstGateway } from "@domain/types";

const today = new Date();

const config: AppConfig = {
  appsheetAppId: "03607a7e-eb5d-45ad-9b22-1c4feaa08e71",
  appsheetRegion: "https://www.appsheet.com",
  appsheetDbUrl:
    "https://www.appsheet.com/dbs/database/kAc94rySy04cmcWkmLkfY5",
  lookerReportUrl:
    "https://datastudio.google.com/reporting/1a884822-b283-4330-ae16-9d1b44bf266a",
  lookerEmbedUrl:
    "https://lookerstudio.google.com/embed/reporting/1a884822-b283-4330-ae16-9d1b44bf266a",
  alertDaysBefore: 30,
  emailSst: "sst@demo.local",
  hasAccessKey: true,
};

export const mockSstGateway: SstGateway = {
  async getDashboardSummary() {
    return {
      expiredCount: 2,
      upcomingCount: 3,
      eppThisMonth: 4,
      openInspections: 2,
      recentEppCount: 3,
    };
  },

  async getAlertas() {
    return [
      {
        id: "EMP-001",
        type: "examen_medico" as const,
        label: "Ana Rodríguez",
        detail: "Producción",
        dueDate: "2026-06-10",
        daysRemaining: -11,
        status: "Vencido" as const,
      },
      {
        id: "EXT-02",
        type: "extintor" as const,
        label: "EXT-02",
        detail: "Bodega A",
        dueDate: "2026-06-18",
        daysRemaining: -3,
        status: "Vencido" as const,
      },
    ];
  },

  async getTendencias() {
    return [
      { label: "Producción", value: 3 },
      { label: "Logística", value: 2 },
      { label: "Mantenimiento", value: 1 },
    ];
  },

  async getExtintores() {
    return [
      {
        code: "EXT-01",
        location: "Planta 1",
        type: "PQS 6kg",
        lastRecharge: "2025-08-01",
        nextRecharge: "2026-07-05",
        status: "Próximo" as const,
      },
    ];
  },

  async getConfig() {
    return config;
  },

  async saveConfig(partial: AppConfigInput) {
    const { appsheetAccessKey, ...rest } = partial;
    if (appsheetAccessKey) config.hasAccessKey = true;
    Object.assign(config, rest);
    return config;
  },

  async runAlertsNow() {
    return {
      sent: true,
      recipient: config.emailSst,
      alertCount: 2,
      message: `Demo local: alertas simuladas (${today.toLocaleDateString("es-CO")}).`,
    };
  },

  async testConnection(table?: string) {
    return {
      ok: true,
      table: table ?? "employees",
      rowCount: 5,
      message: 'Demo local: conexión simulada (5 registros en "employees").',
    };
  },
};
