import { Bell } from "lucide-react";
import { useAlertas } from "@app/hooks/use-alertas";
import { PageHeaderComponent } from "@app/components/layout/page-header/page-header.component";
import { AlertsTableComponent } from "@app/components/alertas/alerts-table/alerts-table.component";
import { RunAlertsPanelComponent } from "@app/components/alertas/run-alerts-panel/run-alerts-panel.component";
import { SpinnerComponent } from "@app/components/ui/spinner/spinner.component";
import "./alertas.page.css";

export function AlertasPage() {
  const { items, loading, error, lastRun, running, runNow } = useAlertas();

  return (
    <div className="alertas-page">
      <PageHeaderComponent
        title="Alertas automáticas"
        description="Vencimientos de exámenes médicos ocupacionales y recargas de extintores"
        icon={Bell}
      />
      <RunAlertsPanelComponent
        running={running}
        lastRun={lastRun}
        onRun={() => void runNow()}
      />
      {loading ? (
        <div className="alertas-loading">
          <SpinnerComponent className="spinner-lg" />
        </div>
      ) : error ? (
        <div className="alertas-error">{error}</div>
      ) : (
        <AlertsTableComponent items={items} />
      )}
    </div>
  );
}
