import { PROPERTIES } from "@domain/constants/properties";
import type { PropertiesStoreAdapter } from "@infra/adapters/properties-store-adapter";

const SYNCABLE_KEYS = [
  PROPERTIES.APPSHEET_APP_ID,
  PROPERTIES.APPSHEET_ACCESS_KEY,
  PROPERTIES.APPSHEET_REGION,
  PROPERTIES.APPSHEET_DB_URL,
  PROPERTIES.LOOKER_REPORT_URL,
  PROPERTIES.LOOKER_EMBED_URL,
  PROPERTIES.ALERT_DAYS_BEFORE,
  PROPERTIES.EMAIL_SST,
] as const;

export type SyncScriptPropertiesResult = {
  updated: string[];
};

export class SyncScriptPropertiesUseCase {
  constructor(private readonly properties: PropertiesStoreAdapter) {}

  execute(
    syncToken: string,
    payload: Record<string, string>,
  ): SyncScriptPropertiesResult {
    if (!syncToken) {
      throw new Error("Token de sincronización requerido.");
    }

    const storedToken = this.properties.get(PROPERTIES.CD_SYNC_TOKEN);
    if (!storedToken) {
      this.properties.set(PROPERTIES.CD_SYNC_TOKEN, syncToken);
    } else if (storedToken !== syncToken) {
      throw new Error("Token de sincronización no autorizado.");
    }

    const updated: string[] = [];

    for (const key of SYNCABLE_KEYS) {
      const value = payload[key];
      if (value !== undefined && value !== "") {
        this.properties.set(key, value);
        updated.push(key);
      }
    }

    return { updated };
  }
}
