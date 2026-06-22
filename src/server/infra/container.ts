import { AppSheetApiAdapter } from "@infra/adapters/appsheet-api-adapter";
import {
  AppSheetEmployeeRepository,
  AppSheetEppRepository,
  AppSheetExtinguisherRepository,
  AppSheetInspectionRepository,
} from "@infra/adapters/appsheet-repositories";
import { MailAppAdapter } from "@infra/adapters/mail-app-adapter";
import { PropertiesConfigRepository } from "@infra/adapters/properties-config-repository";
import { PropertiesStoreAdapter } from "@infra/adapters/properties-store-adapter";
import { RunAlertsUseCase } from "@modules/alerts/app/run-alerts-use-case";
import {
  GetConfigUseCase,
  SaveConfigUseCase,
} from "@modules/config/app/config-use-cases";
import { GetDashboardSummaryUseCase } from "@modules/dashboard/app/get-dashboard-summary-use-case";
import { TestConnectionUseCase } from "@modules/setup/app/test-connection-use-case";

function buildContainer() {
  const properties = new PropertiesStoreAdapter();
  const appsheet = new AppSheetApiAdapter(properties);
  const configRepository = new PropertiesConfigRepository(properties);

  const dashboard = new GetDashboardSummaryUseCase(
    new AppSheetEmployeeRepository(appsheet),
    new AppSheetExtinguisherRepository(appsheet),
    new AppSheetEppRepository(appsheet),
    new AppSheetInspectionRepository(appsheet),
    configRepository,
  );

  return {
    dashboard,
    extinguisherRepository: new AppSheetExtinguisherRepository(appsheet),
    alerts: new RunAlertsUseCase(
      dashboard,
      configRepository,
      new MailAppAdapter(),
      properties,
    ),
    getConfig: new GetConfigUseCase(configRepository),
    saveConfig: new SaveConfigUseCase(configRepository),
    testConnection: new TestConnectionUseCase(appsheet),
    properties,
  };
}

export function getContainer() {
  return buildContainer();
}
