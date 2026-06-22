export type AppSheetRow = Record<string, unknown>;

export function cell(row: AppSheetRow, key: string): string {
  return String(row[key] ?? "").trim();
}
