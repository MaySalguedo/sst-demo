import { ExternalLink } from "lucide-react";
import { CardComponent } from "@app/components/ui/card/card.component";
import { ButtonComponent } from "@app/components/ui/button/button.component";
import "./looker-embed.component.css";

export function LookerEmbedComponent({
  embedUrl,
  reportUrl,
}: {
  embedUrl: string;
  reportUrl: string;
}) {
  const hasEmbed = Boolean(embedUrl);

  return (
    <CardComponent className="looker-card">
      <div className="looker-header">
        <div>
          <h3 className="looker-title">Looker Studio</h3>
          <p className="looker-desc">
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
          className="looker-iframe"
          allowFullScreen
        />
      ) : (
        <div className="looker-empty">
          Configura la URL de embed en la sección Configuración
        </div>
      )}
    </CardComponent>
  );
}
