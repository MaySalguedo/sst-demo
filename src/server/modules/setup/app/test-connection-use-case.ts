import { APPSHEET_TABLES } from "@domain/constants/appsheet-tables";
import type { ConnectionTestResult } from "@domain/models/connection-test-result";
import type { AppSheetApiAdapter } from "@infra/adapters/appsheet-api-adapter";

export class TestConnectionUseCase {
  constructor(private readonly api: AppSheetApiAdapter) {}

  execute(table: string = APPSHEET_TABLES.EMPLOYEES): ConnectionTestResult {
    try {
      const rows = this.api.find(table);
      return {
        ok: true,
        table,
        rowCount: rows.length,
        message: `Conexión correcta: ${rows.length} registros en "${table}".`,
      };
    } catch (error) {
      return {
        ok: false,
        table,
        rowCount: 0,
        message:
          error instanceof Error
            ? error.message
            : "Error desconocido al consultar AppSheet.",
      };
    }
  }
}
