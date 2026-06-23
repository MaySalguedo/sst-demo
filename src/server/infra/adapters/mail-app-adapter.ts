import type { AlertItem } from "@domain/models/alert-item";

function alertRow(alert: AlertItem): string {
  return `
    <tr>
      <td style="padding:8px;border-bottom:1px solid #e2e8f0;">${alert.type === "examen_medico" ? "Examen médico" : "Extintor"}</td>
      <td style="padding:8px;border-bottom:1px solid #e2e8f0;">${alert.label}</td>
      <td style="padding:8px;border-bottom:1px solid #e2e8f0;">${alert.detail}</td>
      <td style="padding:8px;border-bottom:1px solid #e2e8f0;">${alert.dueDate}</td>
      <td style="padding:8px;border-bottom:1px solid #e2e8f0;">${alert.daysRemaining}</td>
      <td style="padding:8px;border-bottom:1px solid #e2e8f0;">${alert.status}</td>
    </tr>
  `;
}

function alertTable(rows: string): string {
  return `
    <table style="width:100%;border-collapse:collapse;font-size:14px;">
      <thead>
        <tr style="background:#f8fafc;text-align:left;">
          <th style="padding:8px;">Tipo</th>
          <th style="padding:8px;">Elemento</th>
          <th style="padding:8px;">Detalle</th>
          <th style="padding:8px;">Vence</th>
          <th style="padding:8px;">Días</th>
          <th style="padding:8px;">Estado</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}

export class MailAppAdapter {
  sendNoAlerts(params: { recipient: string }): void {
    if (!params.recipient) return;

    MailApp.sendEmail({
      to: params.recipient,
      subject: `[SST Demo] Sin alertas pendientes - ${new Date().toLocaleDateString("es-CO")}`,
      htmlBody:
        "<p>No hay exámenes médicos ni extintores por vencer en el rango configurado.</p>",
    });
  }

  sendIndividualAlert(params: {
    recipient: string;
    recipientName: string;
    alert: AlertItem;
    alertDaysBefore: number;
  }): void {
    if (!params.recipient) return;

    const typeLabel =
      params.alert.type === "examen_medico" ? "Examen médico" : "Extintor";

    MailApp.sendEmail({
      to: params.recipient,
      subject: `[SST Demo] Alerta: ${typeLabel} próximo a vencer - ${params.recipientName}`,
      htmlBody: `
        <div style="font-family:Inter,Arial,sans-serif;color:#0f172a;">
          <h2 style="margin-bottom:8px;">Hola ${params.recipientName},</h2>
          <p style="color:#475569;">
            Tienes un ${typeLabel.toLowerCase()} próximo a vencer en los próximos
            ${params.alertDaysBefore} días.
          </p>
          ${alertTable(alertRow(params.alert))}
          <p style="color:#94a3b8;font-size:12px;margin-top:16px;">
            Este es un mensaje automático del sistema SST Demo.
          </p>
        </div>
      `,
    });
  }

  sendSummary(params: {
    recipient: string;
    alerts: AlertItem[];
    alertDaysBefore: number;
    individualRecipients: string[];
  }): void {
    if (!params.recipient) return;

    const rows = params.alerts.map(alertRow).join("");
    const notifiedList =
      params.individualRecipients.length > 0
        ? `<p style="color:#475569;">Notificaciones individuales enviadas a: ${params.individualRecipients.join(", ")}</p>`
        : "";

    MailApp.sendEmail({
      to: params.recipient,
      subject: `[SST Demo] Resumen de alertas - ${new Date().toLocaleDateString("es-CO")}`,
      htmlBody: `
        <div style="font-family:Inter,Arial,sans-serif;color:#0f172a;">
          <h2 style="margin-bottom:8px;">Resumen de Alertas SST</h2>
          <p style="color:#475569;margin-top:0;">Ventana configurada: ${params.alertDaysBefore} días.</p>
          ${alertTable(rows)}
          ${notifiedList}
        </div>
      `,
    });
  }
}
