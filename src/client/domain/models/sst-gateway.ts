import type { AlertItem } from "@domain/models/alert-item";
import type { AlertRunResult } from "@domain/models/alert-run-result";
import type { AppConfig, AppConfigInput } from "@domain/models/app-config";
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

  addRow(table: string, row: Record<string, unknown>): Promise<void>;
  updateRow(table: string, keys: Record<string, unknown>, row: Record<string, unknown>): Promise<void>;
  deleteRow(table: string, keys: Record<string, unknown>): Promise<void>;
}

export type ViewId =
  | "dashboard"
  | "alertas"
  | "forms"
  | "extintores"
  | "config";
