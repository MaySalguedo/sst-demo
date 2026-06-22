import type { AlertItem } from "@domain/entities";

export class MailAppAdapter {
  sendAlertEmail(params: {
    recipient: string;
    alerts: AlertItem[];
    alertDaysBefore: number;
  }): void {
    if (!params.recipient) {
      throw new Error("Configure Email_SST antes de enviar alertas.");
    }

    if (params.alerts.length === 0) {
      MailApp.sendEmail({
        to: params.recipient,
        subject: `[SST Demo] Sin alertas pendientes - ${new Date().toLocaleDateString("es-CO")}`,
        htmlBody:
          "<p>No hay exámenes médicos ni extintores por vencer en el rango configurado.</p>",
      });
      return;
    }

    const rows = params.alerts
      .map(
        (alert) => `
          <tr>
            <td style="padding:8px;border-bottom:1px solid #e2e8f0;">${alert.type === "examen_medico" ? "Examen médico" : "Extintor"}</td>
            <td style="padding:8px;border-bottom:1px solid #e2e8f0;">${alert.label}</td>
            <td style="padding:8px;border-bottom:1px solid #e2e8f0;">${alert.detail}</td>
            <td style="padding:8px;border-bottom:1px solid #e2e8f0;">${alert.dueDate}</td>
            <td style="padding:8px;border-bottom:1px solid #e2e8f0;">${alert.daysRemaining}</td>
            <td style="padding:8px;border-bottom:1px solid #e2e8f0;">${alert.status}</td>
          </tr>
        `,
      )
      .join("");

    MailApp.sendEmail({
      to: params.recipient,
      subject: `[SST Demo] Alertas de vencimiento - ${new Date().toLocaleDateString("es-CO")}`,
      htmlBody: `
        <div style="font-family:Inter,Arial,sans-serif;color:#0f172a;">
          <h2 style="margin-bottom:8px;">Alertas SST</h2>
          <p style="color:#475569;margin-top:0;">Ventana configurada: ${params.alertDaysBefore} días.</p>
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
        </div>
      `,
    });
  }
}
