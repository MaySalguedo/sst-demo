import { ExternalLink, HardHat, ShieldCheck } from "lucide-react";
import { CardComponent } from "@app/components/ui/card/card.component";
import { ButtonComponent } from "@app/components/ui/button/button.component";

function QrCodeComponent({ url }: { url: string }) {
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(url)}`;
  return (
    <img
      src={qrUrl}
      alt="Código QR"
      className="rounded-xl border border-slate-200 bg-white p-2"
      width={140}
      height={140}
    />
  );
}

function AppSheetCardComponent({
  title,
  description,
  icon: Icon,
  url,
  recentCount,
}: {
  title: string;
  description: string;
  icon: typeof HardHat;
  url: string;
  recentCount?: number;
}) {
  return (
    <CardComponent>
      <div className="flex items-start gap-3">
        <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-600">
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-slate-900">{title}</h3>
          <p className="mt-1 text-sm text-slate-500">{description}</p>
          {recentCount !== undefined ? (
            <p className="mt-2 text-xs text-slate-400">
              Registros recientes en AppSheet: {recentCount}
            </p>
          ) : null}
        </div>
      </div>

      <div className="mt-5 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
        <QrCodeComponent url={url} />
        <ButtonComponent
          className="w-full sm:w-auto"
          onClick={() => window.open(url, "_blank")}
        >
          <ExternalLink className="h-4 w-4" />
          Abrir en AppSheet
        </ButtonComponent>
      </div>
    </CardComponent>
  );
}

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
