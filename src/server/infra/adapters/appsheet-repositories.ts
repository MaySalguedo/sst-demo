import { APPSHEET_TABLES } from "@domain/entities";
import type { Employee, Extinguisher } from "@domain/entities";
import {
  daysUntil,
  normalizeDate,
  resolveExpirationStatus,
} from "@domain/date-utils";
import type {
  AppSheetApiAdapter,
  AppSheetRow,
} from "@infra/adapters/appsheet-api-adapter";

function cell(row: AppSheetRow, key: string): string {
  return String(row[key] ?? "").trim();
}

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

export class AppSheetEppRepository {
  constructor(private readonly api: AppSheetApiAdapter) {}

  countThisMonth(referenceDate = new Date()): number {
    const month = referenceDate.getMonth();
    const year = referenceDate.getFullYear();
    return this.api.find(APPSHEET_TABLES.EPP).filter((row) => {
      const isoDate = normalizeDate(cell(row, "date"));
      if (!isoDate) return false;
      const date = new Date(`${isoDate}T00:00:00`);
      return date.getMonth() === month && date.getFullYear() === year;
    }).length;
  }

  countRecent(limit = 5): number {
    return Math.min(limit, this.api.find(APPSHEET_TABLES.EPP).length);
  }
}

export class AppSheetInspectionRepository {
  constructor(private readonly api: AppSheetApiAdapter) {}

  countOpen(): number {
    return this.api.find(APPSHEET_TABLES.INSPECTIONS).filter((row) => {
      const status = cell(row, "status").toLowerCase();
      return ["abierta", "pendiente", "open", "pending"].includes(status);
    }).length;
  }

  getTrendsByArea(): { label: string; value: number }[] {
    const counts = new Map<string, number>();
    for (const row of this.api.find(APPSHEET_TABLES.INSPECTIONS)) {
      const area = cell(row, "area") || "Sin área";
      counts.set(area, (counts.get(area) ?? 0) + 1);
    }
    return [...counts.entries()].map(([label, value]) => ({ label, value }));
  }
}
