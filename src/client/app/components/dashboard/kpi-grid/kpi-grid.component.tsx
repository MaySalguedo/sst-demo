import {
  AlertTriangle,
  Bell,
  ClipboardCheck,
  Package,
} from "lucide-react";
import type { DashboardSummary } from "@domain/types";
import { CardComponent } from "@app/components/ui/card/card.component";

const KPI_CONFIG = [
  {
    key: "expiredCount" as const,
    label: "Vencidos",
    icon: AlertTriangle,
    tone: "text-rose-600 bg-rose-50",
  },
  {
    key: "upcomingCount" as const,
    label: "Próximos 30 días",
    icon: Bell,
    tone: "text-amber-600 bg-amber-50",
  },
  {
    key: "eppThisMonth" as const,
    label: "EPP este mes",
    icon: Package,
    tone: "text-emerald-600 bg-emerald-50",
  },
  {
    key: "openInspections" as const,
    label: "Inspecciones abiertas",
    icon: ClipboardCheck,
    tone: "text-sky-600 bg-sky-50",
  },
];

export function KpiGridComponent({ summary }: { summary: DashboardSummary }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {KPI_CONFIG.map(({ key, label, icon: Icon, tone }) => (
        <CardComponent key={key} className="flex items-start justify-between">
          <div>
            <p className="text-sm text-slate-500">{label}</p>
            <p className="mt-2 text-3xl font-semibold tracking-tight">
              {summary[key]}
            </p>
          </div>
          <div className={`rounded-xl p-2.5 ${tone}`}>
            <Icon className="h-5 w-5" />
          </div>
        </CardComponent>
      ))}
    </div>
  );
}
