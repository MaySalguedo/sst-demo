import type { ExpirationStatus } from "./entities";

export function daysUntil(dateValue: string | Date, today = new Date()): number {
  const target =
    dateValue instanceof Date ? dateValue : new Date(`${dateValue}T00:00:00`);
  const start = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );
  const end = new Date(target.getFullYear(), target.getMonth(), target.getDate());
  return Math.round((end.getTime() - start.getTime()) / 86_400_000);
}

export function resolveExpirationStatus(
  daysRemaining: number,
  warningThreshold = 30,
): ExpirationStatus {
  if (daysRemaining < 0) return "Vencido";
  if (daysRemaining <= warningThreshold) return "Próximo";
  return "Vigente";
}

export function formatDate(date: Date): string {
  return Utilities.formatDate(date, "America/Bogota", "yyyy-MM-dd");
}

export function normalizeDate(value: string): string {
  const raw = String(value ?? "").trim();
  if (!raw) return "";

  const iso = raw.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (iso) return `${iso[1]}-${iso[2]}-${iso[3]}`;

  const mdy = raw.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (mdy) {
    const month = (mdy[1] ?? "").padStart(2, "0");
    const day = (mdy[2] ?? "").padStart(2, "0");
    return `${mdy[3] ?? ""}-${month}-${day}`;
  }

  const parsed = new Date(raw);
  if (!Number.isNaN(parsed.getTime())) {
    const year = parsed.getFullYear();
    const month = String(parsed.getMonth() + 1).padStart(2, "0");
    const day = String(parsed.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  return raw;
}

export function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

export function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}
