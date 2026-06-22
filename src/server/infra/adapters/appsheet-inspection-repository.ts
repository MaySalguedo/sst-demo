import { APPSHEET_TABLES } from "@domain/constants/appsheet-tables";
import { cell } from "@domain/appsheet-row-utils";
import { isOpenInspectionStatus, trendsByArea } from "@domain/inspection-utils";
import type { AppSheetApiAdapter } from "@infra/adapters/appsheet-api-adapter";

export class AppSheetInspectionRepository {
  constructor(private readonly api: AppSheetApiAdapter) {}

  countOpen(): number {
    return this.api.find(APPSHEET_TABLES.INSPECTIONS).filter((row) =>
      isOpenInspectionStatus(cell(row, "status")),
    ).length;
  }

  getTrendsByArea(): { label: string; value: number }[] {
    const rows = this.api.find(APPSHEET_TABLES.INSPECTIONS).map((row) => ({
      area: cell(row, "area"),
    }));
    return trendsByArea(rows);
  }
}
