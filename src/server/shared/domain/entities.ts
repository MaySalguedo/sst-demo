export const DEFAULT_CONFIG = {
  APPSHEET_APP_ID: process.env.APPSHEET_APP_ID,
  APPSHEET_ACCESS_KEY: process.env.APPSHEET_ACCESS_KEY,
  APPSHEET_REGION: process.env.APPSHEET_REGION,
  APPSHEET_DB_URL:
    process.env.APPSHEET_DB_URL,
  LOOKER_REPORT_URL:
    process.env.LOOKER_REPORT_URL,
  LOOKER_EMBED_URL:
    process.env.LOOKER_EMBED_URL,
  ALERTAS_DIAS_ANTICIPACION: process.env.ALERT_DAYS_BEFORE,
  EMAIL_SST: process.env.EMAIL_SST || "",
} as const;

export const APPSHEET_TABLES = {
  EMPLOYEES: "employees",
  EPP: "ppe_deliveries",
  INSPECTIONS: "inspections",
  EXTINGUISHERS: "extinguishers",
} as const;

export const PROPERTIES = {
  APPSHEET_APP_ID: "APPSHEET_APP_ID",
  APPSHEET_ACCESS_KEY: "APPSHEET_ACCESS_KEY",
  APPSHEET_REGION: "APPSHEET_REGION",
  APPSHEET_DB_URL: "APPSHEET_DB_URL",
  LOOKER_REPORT_URL: "LOOKER_REPORT_URL",
  LOOKER_EMBED_URL: "LOOKER_EMBED_URL",
  ALERT_DAYS_BEFORE: "ALERT_DAYS_BEFORE",
  EMAIL_SST: "EMAIL_SST",
  LAST_ALERT_RUN: "LAST_ALERT_RUN",
} as const;

export type ExpirationStatus = "Vigente" | "Próximo" | "Vencido";

export interface Employee {
  id: string;
  name: string;
  area: string;
  email: string;
  medicalExamExpires: string;
  status: ExpirationStatus;
}

export interface Extinguisher {
  code: string;
  location: string;
  type: string;
  lastRecharge: string;
  nextRecharge: string;
  status: ExpirationStatus;
}

export interface AlertItem {
  id: string;
  type: "examen_medico" | "extintor";
  label: string;
  detail: string;
  dueDate: string;
  daysRemaining: number;
  status: ExpirationStatus;
}

export interface DashboardSummary {
  expiredCount: number;
  upcomingCount: number;
  eppThisMonth: number;
  openInspections: number;
  recentEppCount: number;
}

export interface TrendPoint {
  label: string;
  value: number;
}

export interface AppConfig {
  appsheetAppId: string;
  appsheetRegion: string;
  appsheetDbUrl: string;
  lookerReportUrl: string;
  lookerEmbedUrl: string;
  alertDaysBefore: number;
  emailSst: string;
  hasAccessKey: boolean;
}

export interface AppConfigInput {
  appsheetAppId?: string;
  appsheetRegion?: string;
  appsheetAccessKey?: string;
  appsheetDbUrl?: string;
  lookerReportUrl?: string;
  lookerEmbedUrl?: string;
  alertDaysBefore?: number;
  emailSst?: string;
}

export interface ConnectionTestResult {
  ok: boolean;
  table: string;
  rowCount: number;
  message: string;
}

export interface AlertRunResult {
  sent: boolean;
  recipient: string;
  alertCount: number;
  message: string;
}
