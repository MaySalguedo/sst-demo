import { APPSHEET_TABLES } from "@domain/constants/appsheet-tables";
import type { Employee } from "@domain/models/employee";
import { cell } from "@domain/appsheet-row-utils";
import {
  daysUntil,
  normalizeDate,
  resolveExpirationStatus,
} from "@domain/date-utils";
import type { AppSheetApiAdapter } from "@infra/adapters/appsheet-api-adapter";

export class AppSheetEmployeeRepository {
  constructor(private readonly api: AppSheetApiAdapter) {}

  getAll(): Employee[] {
    return this.api.find(APPSHEET_TABLES.EMPLOYEES).map((row) => {
      const dueDate = normalizeDate(cell(row, "medical_exam_expiry"));
      return {
        id: cell(row, "employee_id"),
        name: cell(row, "full_name"),
        area: cell(row, "area"),
        email: cell(row, "email"),
        medicalExamExpires: dueDate,
        status: resolveExpirationStatus(daysUntil(dueDate)),
      };
    });
  }
}
