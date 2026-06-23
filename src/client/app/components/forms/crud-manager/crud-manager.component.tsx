import { useCallback, useState } from "react";
import { Plus } from "lucide-react";
import axios from "axios";
import { useGateway } from "@app/hooks/use-gateway";
import { APPSHEET_TABLES } from "@domain/constants/appsheet-tables";
import type { AppSheetRow } from "@domain/appsheet-row-utils";
import { ButtonComponent } from "@app/components/ui/button/button.component";
import { CardComponent } from "@app/components/ui/card/card.component";
import { SpinnerComponent } from "@app/components/ui/spinner/spinner.component";
import { DataTableComponent } from "@app/components/forms/data-table/data-table.component";
import { RowFormComponent } from "@app/components/forms/row-form/row-form.component";
import "./crud-manager.component.css";

const SYSTEM_COLUMNS = new Set(["Row ID", "RowId", "_RowNumber"]);

const TABLE_LABELS: Record<string, string> = {
  [APPSHEET_TABLES.employees]: "Empleados",
  [APPSHEET_TABLES.epp]: "Entrega de EPP",
  [APPSHEET_TABLES.inspections]: "Inspecciones",
  [APPSHEET_TABLES.extinguishers]: "Extintores",
};

async function fetchRows(table: string): Promise<AppSheetRow[]> {
  const response = await axios.post(
    `/appsheet-proxy/${encodeURIComponent(table)}`,
    {
      Action: "Find",
      Properties: { Locale: "en-US", Timezone: "UTC" },
      Rows: [],
    },
    { headers: { "Content-Type": "application/json" } },
  );
  const data = response.data;
  if (Array.isArray(data)) return data;
  if (data?.Rows && Array.isArray(data.Rows)) return data.Rows;
  return [];
}

export function CrudManagerComponent() {
  const gateway = useGateway();
  const [table, setTable] = useState<string>(APPSHEET_TABLES.employees);
  const [rows, setRows] = useState<AppSheetRow[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<AppSheetRow | null>(null);
  const [showAdd, setShowAdd] = useState(false);

  const load = useCallback(
    async (t: string) => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchRows(t);
        setRows(data);
        if (data.length > 0) {
          const all = Object.keys(data[0] as Record<string, string>);
          setColumns(all.filter((c) => !SYSTEM_COLUMNS.has(c)));
        } else {
          setColumns([]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al cargar datos");
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const keyColumn: string = columns[0] ?? "";

  const handleAdd = async (row: AppSheetRow) => {
    setSaving(true);
    try {
      await gateway.addRow(table, row);
      setShowAdd(false);
      await load(table);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al agregar");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = async (row: AppSheetRow) => {
    if (!editing) return;
    setSaving(true);
    try {
      const keys = { [keyColumn]: editing[keyColumn] };
      await gateway.updateRow(table, keys, row);
      setEditing(null);
      await load(table);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al editar");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (row: AppSheetRow) => {
    const keys = { [keyColumn]: row[keyColumn] };
    if (!confirm(`¿Eliminar registro "${String(row[keyColumn])}"?`)) return;
    try {
      await gateway.deleteRow(table, keys);
      await load(table);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al eliminar");
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <CardComponent className="space-y-4">
        <div className="crud-selector">
          <label className="block text-sm">
            <span className="crud-selector-label">Tabla</span>
            <select
              className="crud-selector-select"
              value={table}
              onChange={(e) => {
                setTable(e.target.value);
                setError(null);
                void load(e.target.value);
              }}
            >
              {Object.entries(TABLE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {error ? <div className="crud-error">{error}</div> : null}

        {loading ? (
          <div className="flex justify-center py-10">
            <SpinnerComponent className="spinner-lg" />
          </div>
        ) : columns.length > 0 ? (
          <>
            <div className="crud-toolbar">
              <p className="crud-count">{rows.length} registro(s)</p>
              <ButtonComponent onClick={() => setShowAdd(true)}>
                <Plus className="h-4 w-4" />
                Agregar
              </ButtonComponent>
            </div>

            <DataTableComponent
              columns={columns}
              rows={rows}
              keyColumn={keyColumn}
              onEdit={(row) => setEditing(row)}
              onDelete={handleDelete}
            />
          </>
        ) : (
          <p className="py-8 text-center text-sm text-slate-500">
            Selecciona una tabla para ver sus registros.
          </p>
        )}
      </CardComponent>

      {showAdd ? (
        <RowFormComponent
          columns={columns}
          initial={null}
          title={`Agregar - ${TABLE_LABELS[table] ?? table}`}
          saving={saving}
          onSave={handleAdd}
          onClose={() => setShowAdd(false)}
        />
      ) : null}

      {editing ? (
        <RowFormComponent
          columns={columns}
          initial={editing}
          title={`Editar - ${TABLE_LABELS[table] ?? table}`}
          saving={saving}
          onSave={handleEdit}
          onClose={() => setEditing(null)}
        />
      ) : null}
    </div>
  );
}
