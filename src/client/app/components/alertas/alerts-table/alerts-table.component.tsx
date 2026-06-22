import type { AlertItem } from "@domain/types";
import { BadgeComponent } from "@app/components/ui/badge/badge.component";
import { CardComponent } from "@app/components/ui/card/card.component";

export function AlertsTableComponent({ items }: { items: AlertItem[] }) {
  if (items.length === 0) {
    return (
      <CardComponent>
        <p className="text-sm text-slate-500">
          No hay alertas dentro del rango configurado.
        </p>
      </CardComponent>
    );
  }

  return (
    <CardComponent className="overflow-hidden p-0">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-5 py-3">Tipo</th>
              <th className="px-5 py-3">Elemento</th>
              <th className="px-5 py-3">Detalle</th>
              <th className="px-5 py-3">Vence</th>
              <th className="px-5 py-3">Días</th>
              <th className="px-5 py-3">Estado</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={`${item.type}-${item.id}`} className="border-t border-slate-100">
                <td className="px-5 py-3 text-slate-600">
                  {item.type === "examen_medico" ? "Examen médico" : "Extintor"}
                </td>
                <td className="px-5 py-3 font-medium">{item.label}</td>
                <td className="px-5 py-3 text-slate-600">{item.detail}</td>
                <td className="px-5 py-3">{item.dueDate}</td>
                <td className="px-5 py-3">{item.daysRemaining}</td>
                <td className="px-5 py-3">
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
