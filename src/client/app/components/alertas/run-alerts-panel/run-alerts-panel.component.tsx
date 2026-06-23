import { Mail } from "lucide-react";
import type { AlertRunResult } from "@domain/types";
import { ButtonComponent } from "@app/components/ui/button/button.component";
import { CardComponent } from "@app/components/ui/card/card.component";
import { SpinnerComponent } from "@app/components/ui/spinner/spinner.component";
import "./run-alerts-panel.component.css";

export function RunAlertsPanelComponent({
  running,
  lastRun,
  onRun,
}: {
  running: boolean;
  lastRun: AlertRunResult | null;
  onRun: () => void;
}) {
  return (
    <CardComponent className="alerts-panel">
      <div>
        <h3 className="alerts-panel-title">Alertas por correo</h3>
        <p className="alerts-panel-desc">
          Envía un resumen de vencimientos de exámenes médicos y extintores.
        </p>
        {lastRun ? (
          <p className="alerts-panel-result">{lastRun.message}</p>
        ) : null}
      </div>
      <ButtonComponent onClick={onRun} disabled={running}>
        {running ? <SpinnerComponent /> : <Mail className="h-4 w-4" />}
        Ejecutar alertas ahora
      </ButtonComponent>
    </CardComponent>
  );
}
