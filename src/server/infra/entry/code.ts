import { getContainer } from "@infra/container";
import type {
  AlertItem,
  AlertRunResult,
  AppConfig,
  AppConfigInput,
  ConnectionTestResult,
  DashboardSummary,
  Extinguisher,
  TrendPoint,
} from "@domain/entities";

function doGet(): GoogleAppsScript.HTML.HtmlOutput {
  return HtmlService.createHtmlOutputFromFile("index")
    .setTitle("SST Demo Hub")
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function getDashboardSummary(): DashboardSummary {
  return getContainer().dashboard.execute();
}

function getAlertas(): AlertItem[] {
  return getContainer().dashboard.getAlerts();
}

function getTendencias(): TrendPoint[] {
  return getContainer().dashboard.getTrends();
}

function getExtintores(): Extinguisher[] {
  return getContainer().extinguisherRepository.getAll();
}

function getConfig(): AppConfig {
  return getContainer().getConfig.execute();
}

function saveConfig(partial: AppConfigInput): AppConfig {
  return getContainer().saveConfig.execute(partial);
}

function runAlertsNow(): AlertRunResult {
  return getContainer().alerts.execute();
}

function testConnection(table?: string): ConnectionTestResult {
  return getContainer().testConnection.execute(table);
}

function addAppSheetRow(table: string, row: string): void {
  getContainer().appsheet.add(table, [JSON.parse(row)]);
}

function updateAppSheetRow(table: string, keys: string, row: string): void {
  getContainer().appsheet.edit(table, [{ ...JSON.parse(keys), ...JSON.parse(row) }]);
}

function deleteAppSheetRow(table: string, keys: string): void {
  getContainer().appsheet.delete(table, [JSON.parse(keys)]);
}

(globalThis as Record<string, unknown>).__sstGas = {
  doGet,
  getDashboardSummary,
  getAlertas,
  getTendencias,
  getExtintores,
  getConfig,
  saveConfig,
  runAlertsNow,
  testConnection,
  addAppSheetRow,
  updateAppSheetRow,
  deleteAppSheetRow,
};
