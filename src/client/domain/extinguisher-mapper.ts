import type { Extinguisher } from "@domain/models/extinguisher";
import { cell, type AppSheetRow } from "@domain/appsheet-row-utils";
import {
  daysUntil,
  normalizeDate,
  resolveExpirationStatus,
} from "@domain/date-utils";

export function mapExtinguisherRow(row: AppSheetRow): Extinguisher {
  const nextRecharge = normalizeDate(cell(row, "next_recharge"));
  return {
    code: cell(row, "code"),
    location: cell(row, "location"),
    type: cell(row, "type"),
    lastRecharge: normalizeDate(cell(row, "last_recharge")),
    nextRecharge,
    status: resolveExpirationStatus(daysUntil(nextRecharge)),
  };
}
