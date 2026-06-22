import { APPSHEET_TABLES } from "@domain/constants/appsheet-tables";
import type { Extinguisher } from "@domain/models/extinguisher";
import { cell } from "@domain/appsheet-row-utils";
import {
  daysUntil,
  normalizeDate,
  resolveExpirationStatus,
} from "@domain/date-utils";
import type { AppSheetApiAdapter } from "@infra/adapters/appsheet-api-adapter";

export class AppSheetExtinguisherRepository {
  constructor(private readonly api: AppSheetApiAdapter) {}

  getAll(): Extinguisher[] {
    return this.api.find(APPSHEET_TABLES.EXTINGUISHERS).map((row) => {
      const dueDate = normalizeDate(cell(row, "next_recharge"));
      return {
        code: cell(row, "code"),
        location: cell(row, "location"),
        type: cell(row, "type"),
        lastRecharge: normalizeDate(cell(row, "last_recharge")),
        nextRecharge: dueDate,
        status: resolveExpirationStatus(daysUntil(dueDate)),
      };
    });
  }
}
