import { APPSHEET_TABLES } from "@domain/constants/appsheet-tables";
import { cell } from "@domain/appsheet-row-utils";
import { countEppThisMonth, countRecentEpp } from "@domain/epp-utils";
import { normalizeDate } from "@domain/date-utils";
import type { AppSheetApiAdapter } from "@infra/adapters/appsheet-api-adapter";

export class AppSheetEppRepository {
  constructor(private readonly api: AppSheetApiAdapter) {}

  countThisMonth(referenceDate = new Date()): number {
    const rows = this.api.find(APPSHEET_TABLES.EPP).map((row) => ({
      date: normalizeDate(cell(row, "date")),
    }));
    return countEppThisMonth(rows, referenceDate);
  }

  countRecent(limit = 5): number {
    return countRecentEpp(this.api.find(APPSHEET_TABLES.EPP).length, limit);
  }
}
