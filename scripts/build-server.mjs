import * as esbuild from "esbuild";
import { cpSync, existsSync, mkdirSync, unlinkSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

const envPath = path.join(rootDir, ".env");
if (existsSync(envPath)) {
  process.loadEnvFile(envPath);
}

const RUNTIME_ENV_KEYS = [
  "APPSHEET_APP_ID",
  "APPSHEET_ACCESS_KEY",
  "APPSHEET_REGION",
  "APPSHEET_DB_URL",
  "LOOKER_REPORT_URL",
  "LOOKER_EMBED_URL",
  "ALERT_DAYS_BEFORE",
  "EMAIL_SST",
];

const isProductionBuild = process.env.BUILD_PROFILE === "production";

const define = Object.fromEntries(
  RUNTIME_ENV_KEYS.map((key) => [
    `process.env.${key}`,
    JSON.stringify(isProductionBuild ? "" : (process.env[key] ?? "")),
  ]),
);

const GAS_TOP_LEVEL_FUNCTIONS = [
  "function doGet() { return globalThis.__sstGas.doGet(); }",
  "function getDashboardSummary() { return globalThis.__sstGas.getDashboardSummary(); }",
  "function getAlertas() { return globalThis.__sstGas.getAlertas(); }",
  "function getTendencias() { return globalThis.__sstGas.getTendencias(); }",
  "function getExtintores() { return globalThis.__sstGas.getExtintores(); }",
  "function getConfig() { return globalThis.__sstGas.getConfig(); }",
  "function saveConfig(partial) { return globalThis.__sstGas.saveConfig(partial); }",
  "function runAlertsNow() { return globalThis.__sstGas.runAlertsNow(); }",
  "function testConnection(table) { return globalThis.__sstGas.testConnection(table); }",
  "function getAppSheetRows(table) { return globalThis.__sstGas.getAppSheetRows(table); }",
  "function addAppSheetRow(table, row) { return globalThis.__sstGas.addAppSheetRow(table, row); }",
  "function updateAppSheetRow(table, keys, row) { return globalThis.__sstGas.updateAppSheetRow(table, keys, row); }",
  "function deleteAppSheetRow(table, keys) { return globalThis.__sstGas.deleteAppSheetRow(table, keys); }",
];

mkdirSync("dist", { recursive: true });

const staleApiBundle = path.join(rootDir, "dist/api.js");
if (existsSync(staleApiBundle)) {
  unlinkSync(staleApiBundle);
}

await esbuild.build({
  entryPoints: ["src/server/infra/entry/code.ts"],
  bundle: true,
  outdir: "dist",
  format: "iife",
  target: "es2019",
  platform: "neutral",
  logLevel: "info",
  define,
  footer: { js: GAS_TOP_LEVEL_FUNCTIONS.join("\n") },
  alias: {
    "@domain": path.join(rootDir, "src/server/shared/domain"),
    "@infra": path.join(rootDir, "src/server/infra"),
    "@modules": path.join(rootDir, "src/server/modules"),
  },
});

cpSync("appsscript.json", "dist/appsscript.json");
