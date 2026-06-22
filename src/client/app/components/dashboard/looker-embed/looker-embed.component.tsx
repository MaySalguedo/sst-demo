import { ExternalLink } from "lucide-react";
import { CardComponent } from "@app/components/ui/card/card.component";
import { ButtonComponent } from "@app/components/ui/button/button.component";

export function LookerEmbedComponent({
  embedUrl,
  reportUrl,
}: {
  embedUrl: string;
  reportUrl: string;
}) {
  const hasEmbed = Boolean(embedUrl);

  return (
    <CardComponent className="overflow-hidden p-0">
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
        <div>
          <h3 className="text-sm font-medium text-slate-900">Looker Studio</h3>
          <p className="text-xs text-slate-500">
            Tablero de indicadores SST conectado a la base de datos
          </p>
        </div>
        <ButtonComponent
          variant="secondary"
          className="py-2"
          onClick={() => window.open(reportUrl, "_blank")}
        >
          <ExternalLink className="h-4 w-4" />
          Abrir
        </ButtonComponent>
      </div>

      {hasEmbed ? (
        <iframe
          title="Looker Studio SST"
          src={embedUrl}
          className="h-[420px] w-full border-0 bg-slate-50"
          allowFullScreen
        />
      ) : (
        <div className="flex h-[420px] items-center justify-center bg-slate-50 text-sm text-slate-500">
          Configura la URL de embed en la sección Configuración
        </div>
      )}
    </CardComponent>
  );
}
