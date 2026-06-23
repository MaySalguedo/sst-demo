import { AppSheetApiAdapter } from "@infra/adapters/appsheet-api-adapter";
import { AppSheetEmployeeRepository } from "@infra/adapters/appsheet-employee-repository";
import { AppSheetEppRepository } from "@infra/adapters/appsheet-epp-repository";
import { AppSheetExtinguisherRepository } from "@infra/adapters/appsheet-extinguisher-repository";
import { AppSheetInspectionRepository } from "@infra/adapters/appsheet-inspection-repository";
import { MailAppAdapter } from "@infra/adapters/mail-app-adapter";
import { PropertiesConfigRepository } from "@infra/adapters/properties-config-repository";
import { PropertiesStoreAdapter } from "@infra/adapters/properties-store-adapter";
import { RunAlertsUseCase } from "@modules/alerts/app/run-alerts-use-case";
import { GetConfigUseCase } from "@modules/config/app/get-config-use-case";
import { SaveConfigUseCase } from "@modules/config/app/save-config-use-case";
import { GetDashboardSummaryUseCase } from "@modules/dashboard/app/get-dashboard-summary-use-case";
import { TestConnectionUseCase } from "@modules/setup/app/test-connection-use-case";

function buildContainer() {
  const properties = new PropertiesStoreAdapter();
  const appsheet = new AppSheetApiAdapter(properties);
  const configRepository = new PropertiesConfigRepository(properties);
  const employeeRepo = new AppSheetEmployeeRepository(appsheet);
  const extinguisherRepo = new AppSheetExtinguisherRepository(appsheet);

  const dashboard = new GetDashboardSummaryUseCase(
    employeeRepo,
    extinguisherRepo,
    new AppSheetEppRepository(appsheet),
    new AppSheetInspectionRepository(appsheet),
    configRepository,
  );

  return {
    dashboard,
    extinguisherRepository: extinguisherRepo,
    alerts: new RunAlertsUseCase(
      employeeRepo,
      extinguisherRepo,
      configRepository,
      new MailAppAdapter(),
      properties,
    ),
    getConfig: new GetConfigUseCase(configRepository),
    saveConfig: new SaveConfigUseCase(configRepository),
    testConnection: new TestConnectionUseCase(appsheet),
    properties,
    appsheet,
  };
}

export function getContainer() {
  return buildContainer();
}
