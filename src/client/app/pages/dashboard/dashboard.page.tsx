import { LayoutDashboard } from "lucide-react";
import { useDashboard } from "@app/hooks/use-dashboard";
import { useConfig } from "@app/hooks/use-config";
import { PageHeaderComponent } from "@app/components/layout/page-header/page-header.component";
import { KpiGridComponent } from "@app/components/dashboard/kpi-grid/kpi-grid.component";
import { TrendsChartComponent } from "@app/components/dashboard/trends-chart/trends-chart.component";
import { LookerEmbedComponent } from "@app/components/dashboard/looker-embed/looker-embed.component";
import { SpinnerComponent } from "@app/components/ui/spinner/spinner.component";
import "./dashboard.page.css";

export function DashboardPage() {
  const { summary, trends, refresh } = useDashboard();
  const { config } = useConfig();

  if (summary.loading || trends.loading) {
    return (
      <div className="dashboard-loading">
        <SpinnerComponent className="spinner-lg" />
      </div>
    );
  }

  if (summary.error || trends.error || !summary.data || !trends.data) {
    return (
      <div className="dashboard-error">
        {summary.error ?? trends.error}
        <button
          type="button"
          className="dashboard-error-btn"
          onClick={() => void refresh()}
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <PageHeaderComponent
        title="Dashboard SST"
        description="Indicadores de gestión, tendencias e integración con Looker Studio"
        icon={LayoutDashboard}
      />
      <KpiGridComponent summary={summary.data} />
      <TrendsChartComponent data={trends.data} />
      <LookerEmbedComponent
        embedUrl={config?.lookerEmbedUrl ?? ""}
        reportUrl={config?.lookerReportUrl ?? ""}
      />
    </div>
  );
}
