import type { Extinguisher } from "@domain/types";
import { BadgeComponent } from "@app/components/ui/badge/badge.component";
import { CardComponent } from "@app/components/ui/card/card.component";

export function ExtinguisherTableComponent({ items }: { items: Extinguisher[] }) {
  return (
    <CardComponent className="overflow-hidden p-0">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-5 py-3">Código</th>
              <th className="px-5 py-3">Ubicación</th>
              <th className="px-5 py-3">Tipo</th>
              <th className="px-5 py-3">Última recarga</th>
              <th className="px-5 py-3">Próxima recarga</th>
              <th className="px-5 py-3">Estado</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.code} className="border-t border-slate-100">
                <td className="px-5 py-3 font-medium">{item.code}</td>
                <td className="px-5 py-3">{item.location}</td>
                <td className="px-5 py-3">{item.type}</td>
                <td className="px-5 py-3">{item.lastRecharge}</td>
                <td className="px-5 py-3">{item.nextRecharge}</td>
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
