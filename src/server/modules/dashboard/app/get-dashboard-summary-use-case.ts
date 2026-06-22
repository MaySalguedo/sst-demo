import type { AlertItem, DashboardSummary, TrendPoint } from "@domain/entities";
import { daysUntil } from "@domain/date-utils";
import type { PropertiesConfigRepository } from "@infra/adapters/properties-config-repository";
import type {
  AppSheetEmployeeRepository,
  AppSheetEppRepository,
  AppSheetExtinguisherRepository,
  AppSheetInspectionRepository,
} from "@infra/adapters/appsheet-repositories";

export class GetDashboardSummaryUseCase {
  constructor(
    private readonly employees: AppSheetEmployeeRepository,
    private readonly extinguishers: AppSheetExtinguisherRepository,
    private readonly epp: AppSheetEppRepository,
    private readonly inspections: AppSheetInspectionRepository,
    private readonly config: PropertiesConfigRepository,
  ) {}

  execute(): DashboardSummary {
    const alertDays = this.config.getAll().alertDaysBefore;
    const alerts = this.buildAlerts(alertDays);

    return {
      expiredCount: alerts.filter((item) => item.status === "Vencido").length,
      upcomingCount: alerts.filter((item) => item.status === "Próximo").length,
      eppThisMonth: this.epp.countThisMonth(),
      openInspections: this.inspections.countOpen(),
      recentEppCount: this.epp.countRecent(),
    };
  }

  getTrends(): TrendPoint[] {
    return this.inspections.getTrendsByArea();
  }

  getAlerts(alertDaysBefore?: number): AlertItem[] {
    const days = alertDaysBefore ?? this.config.getAll().alertDaysBefore;
    return this.buildAlerts(days);
  }

  private buildAlerts(alertDaysBefore: number): AlertItem[] {
    const alerts: AlertItem[] = [];

    for (const employee of this.employees.getAll()) {
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

    for (const extinguisher of this.extinguishers.getAll()) {
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
}
