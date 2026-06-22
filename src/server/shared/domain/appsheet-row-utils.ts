import type { AppSheetRow } from "@infra/adapters/appsheet-api-adapter";

export function cell(row: AppSheetRow, key: string): string {
  return String(row[key] ?? "").trim();
}
