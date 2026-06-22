export const DEFAULT_CONFIG = {
  APPSHEET_APP_ID: process.env.APPSHEET_APP_ID || "",
  APPSHEET_ACCESS_KEY: process.env.APPSHEET_ACCESS_KEY || "",
  APPSHEET_REGION: process.env.APPSHEET_REGION || "https://www.appsheet.com",
  APPSHEET_DB_URL: process.env.APPSHEET_DB_URL || "",
  LOOKER_REPORT_URL: process.env.LOOKER_REPORT_URL || "",
  LOOKER_EMBED_URL: process.env.LOOKER_EMBED_URL || "",
  ALERTAS_DIAS_ANTICIPACION: process.env.ALERT_DAYS_BEFORE || "30",
  EMAIL_SST: process.env.EMAIL_SST || "",
} as const;
