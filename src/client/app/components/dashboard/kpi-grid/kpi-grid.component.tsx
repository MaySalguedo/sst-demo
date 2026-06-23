import {
  AlertTriangle,
  Bell,
  ClipboardCheck,
  Package,
} from "lucide-react";
import type { DashboardSummary } from "@domain/types";
import { CardComponent } from "@app/components/ui/card/card.component";
import "./kpi-grid.component.css";

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
    <div className="kpi-grid">
      {KPI_CONFIG.map(({ key, label, icon: Icon, tone }) => (
        <CardComponent key={key} className="kpi-card">
          <div>
            <p className="kpi-label">{label}</p>
            <p className="kpi-value">{summary[key]}</p>
          </div>
          <div className={`kpi-icon ${tone}`}>
            <Icon className="kpi-icon-inner" />
          </div>
        </CardComponent>
      ))}
    </div>
  );
}
