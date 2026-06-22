import type { ExpirationStatus } from "@domain/types";

const styles: Record<ExpirationStatus, string> = {
  Vigente: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  Próximo: "bg-amber-50 text-amber-700 ring-amber-600/20",
  Vencido: "bg-rose-50 text-rose-700 ring-rose-600/20",
};

export function BadgeComponent({
  status,
  label,
}: {
  status: ExpirationStatus;
  label?: string;
}) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${styles[status]}`}
    >
      {label ?? status}
    </span>
  );
}
