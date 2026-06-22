export const APPSHEET_TABLES = {
  employees: "employees",
  epp: "ppe_deliveries",
  inspections: "inspections",
  extinguishers: "extinguishers",
} as const;

export type AppSheetTableName =
  (typeof APPSHEET_TABLES)[keyof typeof APPSHEET_TABLES];
