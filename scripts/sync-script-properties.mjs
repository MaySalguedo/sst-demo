import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

const envPath = path.join(rootDir, ".env");
if (existsSync(envPath)) {
  process.loadEnvFile(envPath);
}

const syncToken = process.env.CD_SYNC_TOKEN;
if (!syncToken) {
  console.error("CD_SYNC_TOKEN is required.");
  process.exit(1);
}

const payloadEntries = [
  ["APPSHEET_APP_ID", process.env.APPSHEET_APP_ID],
  ["APPSHEET_ACCESS_KEY", process.env.APPSHEET_ACCESS_KEY],
  ["APPSHEET_REGION", process.env.APPSHEET_REGION],
  ["APPSHEET_DB_URL", process.env.APPSHEET_DB_URL],
  ["LOOKER_REPORT_URL", process.env.LOOKER_REPORT_URL],
  ["LOOKER_EMBED_URL", process.env.LOOKER_EMBED_URL],
  ["ALERT_DAYS_BEFORE", process.env.ALERT_DAYS_BEFORE],
  ["EMAIL_SST", process.env.EMAIL_SST],
];

const payload = Object.fromEntries(
  payloadEntries.filter(([, value]) => Boolean(value)),
);

const params = JSON.stringify([syncToken, payload]);

try {
  execFileSync(
    "pnpm",
    ["exec", "clasp", "run", "syncScriptProperties", "--params", params],
    {
      cwd: rootDir,
      stdio: "inherit",
    },
  );
} catch {
  process.exit(1);
}
