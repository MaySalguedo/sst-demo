import { PROPERTIES } from "@domain/constants/properties";
import type { AlertRunResult } from "@domain/models/alert-run-result";
import type { MailAppAdapter } from "@infra/adapters/mail-app-adapter";
import type { PropertiesStoreAdapter } from "@infra/adapters/properties-store-adapter";
import type { PropertiesConfigRepository } from "@infra/adapters/properties-config-repository";
import type { GetDashboardSummaryUseCase } from "@modules/dashboard/app/get-dashboard-summary-use-case";

export class RunAlertsUseCase {
  constructor(
    private readonly dashboard: GetDashboardSummaryUseCase,
    private readonly config: PropertiesConfigRepository,
    private readonly mail: MailAppAdapter,
    private readonly properties: PropertiesStoreAdapter,
  ) {}

  execute(): AlertRunResult {
    const config = this.config.getAll();
    const alerts = this.dashboard.getAlerts(config.alertDaysBefore);

    this.mail.sendAlertEmail({
      recipient: config.emailSst,
      alerts,
      alertDaysBefore: config.alertDaysBefore,
    });

    const timestamp = new Date().toISOString();
    this.properties.set(PROPERTIES.LAST_ALERT_RUN, timestamp);

    return {
      sent: true,
      recipient: config.emailSst,
      alertCount: alerts.length,
      message:
        alerts.length > 0
          ? `Se enviaron ${alerts.length} alertas a ${config.emailSst}.`
          : `Correo enviado sin alertas pendientes a ${config.emailSst}.`,
    };
  }
}
