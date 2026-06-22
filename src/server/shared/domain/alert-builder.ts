import type { AlertItem } from "@domain/models/alert-item";
import type { Employee } from "@domain/models/employee";
import type { Extinguisher } from "@domain/models/extinguisher";
import { daysUntil } from "@domain/date-utils";

export function buildAlertsFromEntities(
  employees: Employee[],
  extinguishers: Extinguisher[],
  alertDaysBefore: number,
): AlertItem[] {
  const alerts: AlertItem[] = [];

  for (const employee of employees) {
    const daysRemaining = daysUntil(employee.medicalExamExpires);
    if (daysRemaining <= alertDaysBefore) {
      alerts.push({
        id: employee.id,
        type: "examen_medico",
        label: employee.name,
        detail: employee.area,
        dueDate: employee.medicalExamExpires,
        daysRemaining,
        status: employee.status,
      });
    }
  }

  for (const extinguisher of extinguishers) {
    const daysRemaining = daysUntil(extinguisher.nextRecharge);
    if (daysRemaining <= alertDaysBefore) {
      alerts.push({
        id: extinguisher.code,
        type: "extintor",
        label: extinguisher.code,
        detail: extinguisher.location,
        dueDate: extinguisher.nextRecharge,
        daysRemaining,
        status: extinguisher.status,
      });
    }
  }

  return alerts.sort((a, b) => a.daysRemaining - b.daysRemaining);
}
