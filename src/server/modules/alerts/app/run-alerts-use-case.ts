import { buildAlertsFromEntities } from "@domain/alert-builder";
import { PROPERTIES } from "@domain/constants/properties";
import type { AlertRunResult } from "@domain/models/alert-run-result";
import type { MailAppAdapter } from "@infra/adapters/mail-app-adapter";
import type { PropertiesStoreAdapter } from "@infra/adapters/properties-store-adapter";
import type { PropertiesConfigRepository } from "@infra/adapters/properties-config-repository";
import type { AppSheetEmployeeRepository } from "@infra/adapters/appsheet-employee-repository";
import type { AppSheetExtinguisherRepository } from "@infra/adapters/appsheet-extinguisher-repository";

export class RunAlertsUseCase {
  constructor(
    private readonly employeeRepo: AppSheetEmployeeRepository,
    private readonly extinguisherRepo: AppSheetExtinguisherRepository,
    private readonly config: PropertiesConfigRepository,
    private readonly mail: MailAppAdapter,
    private readonly properties: PropertiesStoreAdapter,
  ) {}

  execute(): AlertRunResult {
    const config = this.config.getAll();
    const employees = this.employeeRepo.getAll();
    const extinguishers = this.extinguisherRepo.getAll();
    const alerts = buildAlertsFromEntities(
      employees,
      extinguishers,
      config.alertDaysBefore,
    );

    if (alerts.length === 0) {
      this.mail.sendNoAlerts({ recipient: config.emailSst });

      const timestamp = new Date().toISOString();
      this.properties.set(PROPERTIES.LAST_ALERT_RUN, timestamp);

      return {
        sent: true,
        recipient: config.emailSst,
        alertCount: 0,
        message: `Correo enviado sin alertas pendientes a ${config.emailSst}.`,
      };
    }

    const notifiedEmails: string[] = [];

    for (const employee of employees) {
      if (!employee.email) continue;

      const employeeAlerts = alerts.filter(
        (a) => a.type === "examen_medico" && a.id === employee.id,
      );

      for (const alert of employeeAlerts) {
        this.mail.sendIndividualAlert({
          recipient: employee.email,
          recipientName: employee.name,
          alert,
          alertDaysBefore: config.alertDaysBefore,
        });
      }

      if (employeeAlerts.length > 0) {
        notifiedEmails.push(employee.email);
      }
    }

    this.mail.sendSummary({
      recipient: config.emailSst,
      alerts,
      alertDaysBefore: config.alertDaysBefore,
      individualRecipients: notifiedEmails,
    });

    const timestamp = new Date().toISOString();
    this.properties.set(PROPERTIES.LAST_ALERT_RUN, timestamp);

    return {
      sent: true,
      recipient: config.emailSst,
      alertCount: alerts.length,
      message:
        alerts.length > 0
          ? `Se enviaron ${alerts.length} alertas a ${config.emailSst}${notifiedEmails.length > 0 ? `, con notificaciones individuales a: ${notifiedEmails.join(", ")}` : ""}.`
          : `Correo enviado sin alertas pendientes a ${config.emailSst}.`,
    };
  }
}
