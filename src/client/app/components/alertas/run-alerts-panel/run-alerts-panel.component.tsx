import { Mail } from "lucide-react";
import type { AlertRunResult } from "@domain/types";
import { ButtonComponent } from "@app/components/ui/button/button.component";
import { CardComponent } from "@app/components/ui/card/card.component";
import { SpinnerComponent } from "@app/components/ui/spinner/spinner.component";

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
    <CardComponent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h3 className="text-sm font-medium text-slate-900">Alertas por correo</h3>
        <p className="mt-1 text-sm text-slate-500">
          Envía un resumen de vencimientos de exámenes médicos y extintores.
        </p>
        {lastRun ? (
          <p className="mt-2 text-xs text-emerald-700">{lastRun.message}</p>
        ) : null}
      </div>
      <ButtonComponent onClick={onRun} disabled={running}>
        {running ? <SpinnerComponent /> : <Mail className="h-4 w-4" />}
        Ejecutar alertas ahora
      </ButtonComponent>
    </CardComponent>
  );
}
