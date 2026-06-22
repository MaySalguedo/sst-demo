import { buildAlertsFromEntities } from "@domain/alert-builder";
import type { AlertItem } from "@domain/models/alert-item";
import type { DashboardSummary } from "@domain/models/dashboard-summary";
import type { TrendPoint } from "@domain/models/trend-point";
import type { PropertiesConfigRepository } from "@infra/adapters/properties-config-repository";
import type { AppSheetEmployeeRepository } from "@infra/adapters/appsheet-employee-repository";
import type { AppSheetEppRepository } from "@infra/adapters/appsheet-epp-repository";
import type { AppSheetExtinguisherRepository } from "@infra/adapters/appsheet-extinguisher-repository";
import type { AppSheetInspectionRepository } from "@infra/adapters/appsheet-inspection-repository";

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
    return buildAlertsFromEntities(
      this.employees.getAll(),
      this.extinguishers.getAll(),
      alertDaysBefore,
    );
  }
}
