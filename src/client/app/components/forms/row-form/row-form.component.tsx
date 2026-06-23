import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { ButtonComponent } from "@app/components/ui/button/button.component";
import { SpinnerComponent } from "@app/components/ui/spinner/spinner.component";
import "./row-form.component.css";

export function RowFormComponent({
  columns,
  initial,
  title,
  saving,
  onSave,
  onClose,
}: {
  columns: string[];
  initial: Record<string, unknown> | null;
  title: string;
  saving: boolean;
  onSave: (row: Record<string, unknown>) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initial) {
      const mapped: Record<string, string> = {};
      for (const col of columns) {
        mapped[col] = String(initial[col] ?? "");
      }
      setForm(mapped);
    } else {
      const empty: Record<string, string> = {};
      for (const col of columns) {
        empty[col] = "";
      }
      setForm(empty);
    }
  }, [initial, columns]);

  const handleSave = () => {
    const row: Record<string, unknown> = {};
    for (const col of columns) {
      row[col] = form[col] ?? "";
    }
    onSave(row);
  };

  return (
    <div className="row-form-overlay" onClick={onClose}>
      <div className="row-form-panel" onClick={(e) => e.stopPropagation()}>
        <div className="row-form-header">
          <h2 className="row-form-title">{title}</h2>
          <button
            type="button"
            className="row-form-close"
            onClick={onClose}
            aria-label="Cerrar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="row-form-body">
          {columns.map((col) => (
            <label key={col} className="row-form-field">
              <span className="row-form-label">{col}</span>
              <input
                className="row-form-input"
                value={form[col] ?? ""}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, [col]: e.target.value }))
                }
              />
            </label>
          ))}
        </div>

        <div className="row-form-footer">
          <ButtonComponent variant="secondary" onClick={onClose}>
            Cancelar
          </ButtonComponent>
          <ButtonComponent disabled={saving} onClick={handleSave}>
            {saving ? <SpinnerComponent /> : null}
            Guardar
          </ButtonComponent>
        </div>
      </div>
    </div>
  );
}
