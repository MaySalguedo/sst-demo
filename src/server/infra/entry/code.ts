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

function syncScriptProperties(
  syncToken: string,
  payload: Record<string, string>,
) {
  return getContainer().syncScriptProperties.execute(syncToken, payload);
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
  syncScriptProperties,
};
