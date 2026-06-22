import type { ExpirationStatus } from "@domain/models/expiration-status";

export interface AlertItem {
  id: string;
  type: "examen_medico" | "extintor";
  label: string;
  detail: string;
  dueDate: string;
  daysRemaining: number;
  status: ExpirationStatus;
}
