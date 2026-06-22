import { LayoutDashboard } from "lucide-react";
import { useDashboard } from "@app/hooks/use-dashboard";
import { useConfig } from "@app/hooks/use-config";
import { PageHeaderComponent } from "@app/components/layout/page-header/page-header.component";
import { KpiGridComponent } from "@app/components/dashboard/kpi-grid/kpi-grid.component";
import { TrendsChartComponent } from "@app/components/dashboard/trends-chart/trends-chart.component";
import { LookerEmbedComponent } from "@app/components/dashboard/looker-embed/looker-embed.component";
import { SpinnerComponent } from "@app/components/ui/spinner/spinner.component";

export function DashboardPage() {
  const { summary, trends, refresh } = useDashboard();
  const { config } = useConfig();

  if (summary.loading || trends.loading) {
    return (
      <div className="flex justify-center py-20">
        <SpinnerComponent className="h-8 w-8" />
      </div>
    );
  }

  if (summary.error || trends.error || !summary.data || !trends.data) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
        {summary.error ?? trends.error}
        <button
          type="button"
          className="ml-3 underline"
          onClick={() => void refresh()}
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div>
      <PageHeaderComponent
        title="Dashboard SST"
        description="Indicadores de gestión, tendencias e integración con Looker Studio"
        icon={LayoutDashboard}
      />
      <div className="space-y-6">
        <KpiGridComponent summary={summary.data} />
        <TrendsChartComponent data={trends.data} />
        <LookerEmbedComponent
          embedUrl={config?.lookerEmbedUrl ?? ""}
          reportUrl={config?.lookerReportUrl ?? ""}
        />
      </div>
    </div>
  );
}
