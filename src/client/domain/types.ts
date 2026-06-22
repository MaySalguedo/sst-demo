export type ExpirationStatus = "Vigente" | "Próximo" | "Vencido";

export interface DashboardSummary {
  expiredCount: number;
  upcomingCount: number;
  eppThisMonth: number;
  openInspections: number;
  recentEppCount: number;
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

export interface TrendPoint {
  label: string;
  value: number;
}

export interface Extinguisher {
  code: string;
  location: string;
  type: string;
  lastRecharge: string;
  nextRecharge: string;
  status: ExpirationStatus;
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

export interface AlertRunResult {
  sent: boolean;
  recipient: string;
  alertCount: number;
  message: string;
}

export interface ConnectionTestResult {
  ok: boolean;
  table: string;
  rowCount: number;
  message: string;
}

export interface SstGateway {
  getDashboardSummary(): Promise<DashboardSummary>;
  getAlertas(): Promise<AlertItem[]>;
  getTendencias(): Promise<TrendPoint[]>;
  getExtintores(): Promise<Extinguisher[]>;
  getConfig(): Promise<AppConfig>;
  saveConfig(partial: AppConfigInput): Promise<AppConfig>;
  runAlertsNow(): Promise<AlertRunResult>;
  testConnection(table?: string): Promise<ConnectionTestResult>;
}

export type ViewId =
  | "dashboard"
  | "alertas"
  | "forms"
  | "extintores"
  | "config";
