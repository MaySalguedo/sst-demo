import type { ExpirationStatus } from "@domain/models/expiration-status";

export interface Extinguisher {
  code: string;
  location: string;
  type: string;
  lastRecharge: string;
  nextRecharge: string;
  status: ExpirationStatus;
}
