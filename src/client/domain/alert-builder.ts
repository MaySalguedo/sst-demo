import type { AlertItem } from "@domain/models/alert-item";
import { cell, type AppSheetRow } from "@domain/appsheet-row-utils";
import {
  daysUntil,
  normalizeDate,
  resolveExpirationStatus,
} from "@domain/date-utils";

export function buildAlertsFromRows(
  employees: AppSheetRow[],
  extinguishers: AppSheetRow[],
  alertDaysBefore: number,
): AlertItem[] {
  const alerts: AlertItem[] = [];

  for (const row of employees) {
    const dueDate = normalizeDate(cell(row, "medical_exam_expiry"));
    const daysRemaining = daysUntil(dueDate);
    if (daysRemaining <= alertDaysBefore) {
      alerts.push({
        id: cell(row, "employee_id"),
        type: "examen_medico",
        label: cell(row, "full_name"),
        detail: cell(row, "area"),
        dueDate,
        daysRemaining,
        status: resolveExpirationStatus(daysRemaining),
      });
    }
  }

  for (const row of extinguishers) {
    const dueDate = normalizeDate(cell(row, "next_recharge"));
    const daysRemaining = daysUntil(dueDate);
    if (daysRemaining <= alertDaysBefore) {
      alerts.push({
        id: cell(row, "code"),
        type: "extintor",
        label: cell(row, "code"),
        detail: cell(row, "location"),
        dueDate,
        daysRemaining,
        status: resolveExpirationStatus(daysRemaining),
      });
    }
  }

  return alerts.sort((a, b) => a.daysRemaining - b.daysRemaining);
}
