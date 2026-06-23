import type { Extinguisher } from "@domain/types";
import { BadgeComponent } from "@app/components/ui/badge/badge.component";
import { CardComponent } from "@app/components/ui/card/card.component";
import "./extinguisher-table.component.css";

export function ExtinguisherTableComponent({ items }: { items: Extinguisher[] }) {
  return (
    <CardComponent className="ext-table-wrapper">
      <div className="ext-table-scroll">
        <table className="ext-table">
          <thead>
            <tr>
              <th>Código</th>
              <th>Ubicación</th>
              <th>Tipo</th>
              <th>Última recarga</th>
              <th>Próxima recarga</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.code}>
                <td className="font-medium">{item.code}</td>
                <td>{item.location}</td>
                <td>{item.type}</td>
                <td>{item.lastRecharge}</td>
                <td>{item.nextRecharge}</td>
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
