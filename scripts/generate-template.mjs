import * as fs from "node:fs";
import * as XLSX from "xlsx";

XLSX.set_fs(fs);

const APPSHEET_DB_URL =
  "https://www.appsheet.com/dbs/database/kAc94rySy04cmcWkmLkfY5";
const LOOKER_REPORT_URL =
  "https://datastudio.google.com/reporting/1a884822-b283-4330-ae16-9d1b44bf266a";
const LOOKER_EMBED_URL =
  "https://lookerstudio.google.com/embed/reporting/1a884822-b283-4330-ae16-9d1b44bf266a";

const today = new Date();

function isoDate(offsetDays) {
  const date = new Date(today);
  date.setDate(date.getDate() + offsetDays);
  return date.toISOString().slice(0, 10);
}

const sheets = {
  employees: [
    ["employee_id", "full_name", "area", "email", "medical_exam_expiry", "status"],
    ["EMP-001", "Ana Rodríguez", "Producción", "ana.r@demo.com", isoDate(-5), "Vencido"],
    ["EMP-002", "Carlos Méndez", "Logística", "carlos.m@demo.com", isoDate(12), "Próximo"],
    ["EMP-003", "Laura Gómez", "Administración", "laura.g@demo.com", isoDate(45), "Vigente"],
    ["EMP-004", "Diego Pérez", "Mantenimiento", "diego.p@demo.com", isoDate(8), "Próximo"],
    ["EMP-005", "María Torres", "Calidad", "maria.t@demo.com", isoDate(90), "Vigente"],
  ],
  ppe_deliveries: [
    ["delivery_id", "date", "employee_id", "items", "quantity", "delivered_by", "notes"],
    ["EPP-001", isoDate(-3), "EMP-001", "Casco, Guantes", 2, "SST Demo", "Entrega programada"],
    ["EPP-002", isoDate(-10), "EMP-003", "Gafas, Botas", 2, "SST Demo", "Reposición anual"],
    ["EPP-003", isoDate(-1), "EMP-002", "Arnés, Casco", 2, "SST Demo", "Trabajo en alturas"],
  ],
  inspections: [
    ["inspection_id", "date", "area", "type", "findings", "risk_level", "status", "inspector"],
    ["INS-001", isoDate(-7), "Producción", "Rutinaria", "Señalización desgastada", "Medio", "Abierta", "SST Demo"],
    ["INS-002", isoDate(-2), "Logística", "Preoperacional", "Extintor sin precinto", "Alto", "Pendiente", "SST Demo"],
    ["INS-003", isoDate(-15), "Administración", "Rutinaria", "Salidas despejadas", "Bajo", "Cerrada", "SST Demo"],
    ["INS-004", isoDate(-4), "Mantenimiento", "Correctiva", "EPP incompleto en estación", "Medio", "Abierta", "SST Demo"],
  ],
  extinguishers: [
    ["code", "location", "type", "last_recharge", "next_recharge", "status"],
    ["EXT-01", "Planta 1 - Entrada", "PQS 6kg", isoDate(-300), isoDate(15), "Próximo"],
    ["EXT-02", "Bodega A", "CO2 10kg", isoDate(-200), isoDate(-2), "Vencido"],
    ["EXT-03", "Oficinas", "PQS 2.5kg", isoDate(-120), isoDate(60), "Vigente"],
    ["EXT-04", "Taller", "PQS 6kg", isoDate(-280), isoDate(20), "Próximo"],
  ],
  config: [
    ["key", "value"],
    ["appsheet_db_url", APPSHEET_DB_URL],
    ["looker_report_url", LOOKER_REPORT_URL],
    ["looker_embed_url", LOOKER_EMBED_URL],
    ["alert_days_before", "30"],
    ["email_sst", ""],
  ],
};

const workbook = XLSX.utils.book_new();
for (const [name, rows] of Object.entries(sheets)) {
  const worksheet = XLSX.utils.aoa_to_sheet(rows);
  XLSX.utils.book_append_sheet(workbook, worksheet, name);
}

XLSX.writeFile(workbook, "sst-demo-template.xlsx", {
  bookType: "xlsx",
  compression: true,
});
console.log("Generado: sst-demo-template.xlsx");
