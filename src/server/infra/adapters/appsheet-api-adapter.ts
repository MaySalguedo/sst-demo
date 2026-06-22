import { DEFAULT_CONFIG, PROPERTIES } from "@domain/entities";
import type { PropertiesStoreAdapter } from "@infra/adapters/properties-store-adapter";

export type AppSheetRow = Record<string, unknown>;

export class AppSheetApiAdapter {
  constructor(private readonly properties: PropertiesStoreAdapter) {}

  private get appId(): string {
    return (
      this.properties.get(PROPERTIES.APPSHEET_APP_ID) ||
      DEFAULT_CONFIG.APPSHEET_APP_ID
    );
  }

  private get accessKey(): string {
    return (
      this.properties.get(PROPERTIES.APPSHEET_ACCESS_KEY) ||
      DEFAULT_CONFIG.APPSHEET_ACCESS_KEY
    );
  }

  private get region(): string {
    return (
      this.properties.get(PROPERTIES.APPSHEET_REGION) ||
      DEFAULT_CONFIG.APPSHEET_REGION
    ).replace(/\/+$/, "");
  }

  find(tableName: string): AppSheetRow[] {
    const appId = this.appId;
    const accessKey = this.accessKey;

    if (!appId || !accessKey) {
      throw new Error(
        "Falta configurar APPSHEET_APP_ID o APPSHEET_ACCESS_KEY (Script Properties o .env).",
      );
    }

    const url = `${this.region}/api/v2/apps/${appId}/tables/${encodeURIComponent(
      tableName,
    )}/Action`;

    const response = UrlFetchApp.fetch(url, {
      method: "post",
      contentType: "application/json",
      headers: { ApplicationAccessKey: accessKey },
      payload: JSON.stringify({
        Action: "Find",
        Properties: { Locale: "en-US", Timezone: "UTC" },
        Rows: [],
      }),
      muteHttpExceptions: true,
    });

    const code = response.getResponseCode();
    const body = response.getContentText();

    if (code < 200 || code >= 300) {
      throw new Error(`AppSheet API ${code}: ${body || "sin respuesta"}`);
    }

    if (!body) return [];

    const parsed = JSON.parse(body) as unknown;
    if (Array.isArray(parsed)) return parsed as AppSheetRow[];
    if (
      parsed &&
      typeof parsed === "object" &&
      Array.isArray((parsed as { Rows?: unknown }).Rows)
    ) {
      return (parsed as { Rows: AppSheetRow[] }).Rows;
    }
    return [];
  }
}
