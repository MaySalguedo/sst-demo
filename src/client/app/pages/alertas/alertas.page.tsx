import { Bell } from "lucide-react";
import { useAlertas } from "@app/hooks/use-alertas";
import { PageHeaderComponent } from "@app/components/layout/page-header/page-header.component";
import { AlertsTableComponent } from "@app/components/alertas/alerts-table/alerts-table.component";
import { RunAlertsPanelComponent } from "@app/components/alertas/run-alerts-panel/run-alerts-panel.component";
import { SpinnerComponent } from "@app/components/ui/spinner/spinner.component";

export function AlertasPage() {
  const { items, loading, error, lastRun, running, runNow } = useAlertas();

  return (
    <div>
      <PageHeaderComponent
        title="Alertas automáticas"
        description="Vencimientos de exámenes médicos ocupacionales y recargas de extintores"
        icon={Bell}
      />
      <div className="space-y-6">
        <RunAlertsPanelComponent
          running={running}
          lastRun={lastRun}
          onRun={() => void runNow()}
        />
        {loading ? (
          <div className="flex justify-center py-10">
            <SpinnerComponent className="h-8 w-8" />
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            {error}
          </div>
        ) : (
          <AlertsTableComponent items={items} />
        )}
      </div>
    </div>
  );
}
