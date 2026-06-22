import * as esbuild from "esbuild";
import { cpSync, existsSync, mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

const envPath = path.join(rootDir, ".env");
if (existsSync(envPath)) {
  process.loadEnvFile(envPath);
}

const ENV_KEYS = [
  "APPSHEET_APP_ID",
  "APPSHEET_ACCESS_KEY",
  "APPSHEET_REGION",
  "APPSHEET_DB_URL",
  "LOOKER_REPORT_URL",
  "LOOKER_EMBED_URL",
  "ALERT_DAYS_BEFORE",
  "EMAIL_SST",
];

const define = Object.fromEntries(
  ENV_KEYS.map((key) => [
    `process.env.${key}`,
    JSON.stringify(process.env[key] ?? ""),
  ]),
);

mkdirSync("dist", { recursive: true });

await esbuild.build({
  entryPoints: [
    "src/server/infra/entry/code.ts",
    "src/server/infra/entry/api.ts",
  ],
  bundle: true,
  outdir: "dist",
  format: "iife",
  target: "es2019",
  platform: "neutral",
  logLevel: "info",
  define,
  alias: {
    "@domain": path.join(rootDir, "src/server/shared/domain"),
    "@infra": path.join(rootDir, "src/server/infra"),
    "@modules": path.join(rootDir, "src/server/modules"),
  },
});

cpSync("appsscript.json", "dist/appsscript.json");
