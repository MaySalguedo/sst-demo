import { Pencil, Trash2 } from "lucide-react";
import "./data-table.component.css";

export function DataTableComponent({
  columns,
  rows,
  keyColumn,
  onEdit,
  onDelete,
}: {
  columns: string[];
  rows: Record<string, unknown>[];
  keyColumn: string;
  onEdit: (row: Record<string, unknown>) => void;
  onDelete: (row: Record<string, unknown>) => void;
}) {
  if (rows.length === 0) {
    return <div className="data-table-empty">No hay registros.</div>;
  }

  return (
    <div className="data-table-wrapper">
      <div className="data-table-scroll">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col}>{col}</th>
              ))}
              <th className="w-24 text-center">Acción</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={String(row[keyColumn] ?? i)}>
                {columns.map((col) => (
                  <td key={col} title={String(row[col] ?? "")}>
                    <span className="line-clamp-1 max-w-[200px]">
                      {String(row[col] ?? "")}
                    </span>
                  </td>
                ))}
                <td>
                  <div className="data-table-actions justify-center">
                    <button
                      type="button"
                      className="data-table-action data-table-action-edit"
                      onClick={() => onEdit(row)}
                      aria-label="Editar"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      className="data-table-action data-table-action-delete"
                      onClick={() => onDelete(row)}
                      aria-label="Eliminar"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
