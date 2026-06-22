export function isOpenInspectionStatus(status: string): boolean {
  return ["abierta", "pendiente", "open", "pending"].includes(
    status.toLowerCase(),
  );
}

export function trendsByArea(
  rows: { area: string }[],
): { label: string; value: number }[] {
  const counts = new Map<string, number>();
  for (const row of rows) {
    const area = row.area || "Sin área";
    counts.set(area, (counts.get(area) ?? 0) + 1);
  }
  return [...counts.entries()].map(([label, value]) => ({ label, value }));
}
