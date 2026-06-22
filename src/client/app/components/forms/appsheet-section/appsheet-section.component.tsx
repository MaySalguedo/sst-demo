import { HardHat, ShieldCheck } from "lucide-react";
import { AppSheetCardComponent } from "@app/components/forms/appsheet-card/appsheet-card.component";

export function AppSheetSectionComponent({
  appsheetDbUrl,
  recentEppCount,
}: {
  appsheetDbUrl: string;
  recentEppCount: number;
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <AppSheetCardComponent
        title="Entrega de EPP"
        description="Formulario digital para registrar entrega de Elementos de Protección Personal."
        icon={HardHat}
        url={appsheetDbUrl}
        recentCount={recentEppCount}
      />
      <AppSheetCardComponent
        title="Inspección de seguridad"
        description="Registro de hallazgos, nivel de riesgo y seguimiento de inspecciones SST."
        icon={ShieldCheck}
        url={appsheetDbUrl}
      />
    </div>
  );
}
