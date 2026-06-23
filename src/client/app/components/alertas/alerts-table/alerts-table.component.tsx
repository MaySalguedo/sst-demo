import type { AlertItem } from "@domain/types";
import { BadgeComponent } from "@app/components/ui/badge/badge.component";
import { CardComponent } from "@app/components/ui/card/card.component";
import "./alerts-table.component.css";

export function AlertsTableComponent({ items }: { items: AlertItem[] }) {
  if (items.length === 0) {
    return (
      <CardComponent>
        <p className="alerts-empty">
          No hay alertas dentro del rango configurado.
        </p>
      </CardComponent>
    );
  }

  return (
    <CardComponent className="alerts-table-wrapper">
      <div className="alerts-table-scroll">
        <table className="alerts-table">
          <thead>
            <tr>
              <th>Tipo</th>
              <th>Elemento</th>
              <th>Detalle</th>
              <th>Vence</th>
              <th>Días</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={`${item.type}-${item.id}`}>
                <td className="text-slate-600">
                  {item.type === "examen_medico" ? "Examen médico" : "Extintor"}
                </td>
                <td className="font-medium">{item.label}</td>
                <td className="text-slate-600">{item.detail}</td>
                <td>{item.dueDate}</td>
                <td>{item.daysRemaining}</td>
                <td>
                  <BadgeComponent status={item.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </CardComponent>
  );
}
