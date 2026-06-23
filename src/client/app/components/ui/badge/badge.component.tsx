import type { ExpirationStatus } from "@domain/types";
import "./badge.component.css";

const styles: Record<ExpirationStatus, string> = {
  Vigente: "badge-vigente",
  Próximo: "badge-proximo",
  Vencido: "badge-vencido",
};

export function BadgeComponent({
  status,
  label,
}: {
  status: ExpirationStatus;
  label?: string;
}) {
  return (
    <span className={`badge ${styles[status]}`}>
      {label ?? status}
    </span>
  );
}
