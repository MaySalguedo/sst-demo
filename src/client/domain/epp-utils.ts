import { normalizeDate } from "@domain/date-utils";

export function countEppThisMonth(
  rows: { date: string }[],
  referenceDate = new Date(),
): number {
  const month = referenceDate.getMonth();
  const year = referenceDate.getFullYear();

  return rows.filter((row) => {
    const isoDate = normalizeDate(row.date);
    if (!isoDate) return false;
    const date = new Date(`${isoDate}T00:00:00`);
    return date.getMonth() === month && date.getFullYear() === year;
  }).length;
}

export function countRecentEpp(total: number, limit = 5): number {
  return Math.min(limit, total);
}
