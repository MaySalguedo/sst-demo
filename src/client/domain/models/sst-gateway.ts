import type { AlertItem } from "@domain/models/alert-item";
import type { AppConfig, AppConfigInput } from "@domain/models/app-config";
import type { AlertRunResult } from "@domain/models/alert-run-result";
import type { ConnectionTestResult } from "@domain/models/connection-test-result";
import type { DashboardSummary } from "@domain/models/dashboard-summary";
import type { Extinguisher } from "@domain/models/extinguisher";
import type { TrendPoint } from "@domain/models/trend-point";

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
