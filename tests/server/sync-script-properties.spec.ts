import { describe, expect, it } from "vitest";
import { PROPERTIES } from "../../src/server/shared/domain/constants/properties";
import { SyncScriptPropertiesUseCase } from "../../src/server/modules/config/app/sync-script-properties-use-case";

class InMemoryPropertiesStore {
  private readonly values = new Map<string, string>();

  get(key: string): string | null {
    return this.values.get(key) ?? null;
  }

  set(key: string, value: string): void {
    this.values.set(key, value);
  }

  snapshot(): Map<string, string> {
    return new Map(this.values);
  }
}

describe("SyncScriptPropertiesUseCase", () => {
  const payload = {
    [PROPERTIES.APPSHEET_APP_ID]: "app-id",
    [PROPERTIES.APPSHEET_ACCESS_KEY]: "access-key",
    [PROPERTIES.APPSHEET_REGION]: "https://www.appsheet.com",
    [PROPERTIES.LAST_ALERT_RUN]: "2026-06-22T00:00:00.000Z",
  };

  it("rejects an invalid sync token when one is already stored", () => {
    const store = new InMemoryPropertiesStore();
    store.set(PROPERTIES.CD_SYNC_TOKEN, "stored-token");
    const useCase = new SyncScriptPropertiesUseCase(store);

    expect(() => useCase.execute("wrong-token", payload)).toThrow(
      "Token de sincronización no autorizado.",
    );
  });

  it("bootstraps the sync token and writes allowed properties", () => {
    const store = new InMemoryPropertiesStore();
    const useCase = new SyncScriptPropertiesUseCase(store);

    const result = useCase.execute("bootstrap-token", payload);

    expect(result.updated).toEqual([
      PROPERTIES.APPSHEET_APP_ID,
      PROPERTIES.APPSHEET_ACCESS_KEY,
      PROPERTIES.APPSHEET_REGION,
    ]);
    expect(store.get(PROPERTIES.CD_SYNC_TOKEN)).toBe("bootstrap-token");
    expect(store.get(PROPERTIES.APPSHEET_APP_ID)).toBe("app-id");
    expect(store.get(PROPERTIES.LAST_ALERT_RUN)).toBeNull();
  });

  it("updates allowed properties with a valid token", () => {
    const store = new InMemoryPropertiesStore();
    store.set(PROPERTIES.CD_SYNC_TOKEN, "valid-token");
    store.set(PROPERTIES.LAST_ALERT_RUN, "keep-me");
    const useCase = new SyncScriptPropertiesUseCase(store);

    const result = useCase.execute("valid-token", {
      [PROPERTIES.EMAIL_SST]: "sst@example.com",
      [PROPERTIES.LAST_ALERT_RUN]: "should-not-write",
    });

    expect(result.updated).toEqual([PROPERTIES.EMAIL_SST]);
    expect(store.get(PROPERTIES.EMAIL_SST)).toBe("sst@example.com");
    expect(store.get(PROPERTIES.LAST_ALERT_RUN)).toBe("keep-me");
  });
});
