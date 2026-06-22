import type { ExpirationStatus } from "@domain/models/expiration-status";

export interface Employee {
  id: string;
  name: string;
  area: string;
  email: string;
  medicalExamExpires: string;
  status: ExpirationStatus;
}
