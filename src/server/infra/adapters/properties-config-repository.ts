import { DEFAULT_CONFIG, PROPERTIES } from "@domain/entities";
import type { AppConfig, AppConfigInput } from "@domain/entities";
import type { PropertiesStoreAdapter } from "@infra/adapters/properties-store-adapter";

export class PropertiesConfigRepository {
  constructor(private readonly properties: PropertiesStoreAdapter) {}

  getAll(): AppConfig {
    const accessKey =
      this.properties.get(PROPERTIES.APPSHEET_ACCESS_KEY) ||
      DEFAULT_CONFIG.APPSHEET_ACCESS_KEY;
    const configuredEmail = this.properties.get(PROPERTIES.EMAIL_SST);
    const fallbackEmail = Session.getActiveUser().getEmail();

    return {
      appsheetAppId:
        this.properties.get(PROPERTIES.APPSHEET_APP_ID) ||
        DEFAULT_CONFIG.APPSHEET_APP_ID,
      appsheetRegion:
        this.properties.get(PROPERTIES.APPSHEET_REGION) ||
        DEFAULT_CONFIG.APPSHEET_REGION,
      appsheetDbUrl:
        this.properties.get(PROPERTIES.APPSHEET_DB_URL) ||
        DEFAULT_CONFIG.APPSHEET_DB_URL,
      lookerReportUrl:
        this.properties.get(PROPERTIES.LOOKER_REPORT_URL) ||
        DEFAULT_CONFIG.LOOKER_REPORT_URL,
      lookerEmbedUrl:
        this.properties.get(PROPERTIES.LOOKER_EMBED_URL) ||
        DEFAULT_CONFIG.LOOKER_EMBED_URL,
      alertDaysBefore: Number(
        this.properties.get(PROPERTIES.ALERT_DAYS_BEFORE) ||
          DEFAULT_CONFIG.ALERTAS_DIAS_ANTICIPACION,
      ),
      emailSst: configuredEmail || fallbackEmail,
      hasAccessKey: Boolean(accessKey),
    };
  }

  save(partial: AppConfigInput): AppConfig {
    const mapping: Record<string, string | undefined> = {
      [PROPERTIES.APPSHEET_APP_ID]: partial.appsheetAppId,
      [PROPERTIES.APPSHEET_REGION]: partial.appsheetRegion,
      [PROPERTIES.APPSHEET_ACCESS_KEY]: partial.appsheetAccessKey,
      [PROPERTIES.APPSHEET_DB_URL]: partial.appsheetDbUrl,
      [PROPERTIES.LOOKER_REPORT_URL]: partial.lookerReportUrl,
      [PROPERTIES.LOOKER_EMBED_URL]: partial.lookerEmbedUrl,
      [PROPERTIES.ALERT_DAYS_BEFORE]:
        partial.alertDaysBefore !== undefined
          ? String(partial.alertDaysBefore)
          : undefined,
      [PROPERTIES.EMAIL_SST]: partial.emailSst,
    };

    for (const [key, value] of Object.entries(mapping)) {
      if (value !== undefined && value !== "") {
        this.properties.set(key, value);
      }
    }

    return this.getAll();
  }
}
