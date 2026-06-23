import { ExternalLink, type LucideIcon } from "lucide-react";
import { CardComponent } from "@app/components/ui/card/card.component";
import { ButtonComponent } from "@app/components/ui/button/button.component";
import { QrCodeComponent } from "@app/components/forms/qr-code/qr-code.component";
import "./appsheet-card.component.css";

export function AppSheetCardComponent({
  title,
  description,
  icon: Icon,
  url,
  recentCount,
}: {
  title: string;
  description: string;
  icon: LucideIcon;
  url: string;
  recentCount?: number;
}) {
  return (
    <CardComponent>
      <div className="appsheet-card-header">
        <div className="appsheet-card-icon">
          <Icon className="appsheet-card-icon-inner" />
        </div>
        <div className="appsheet-card-body">
          <h3 className="appsheet-card-title">{title}</h3>
          <p className="appsheet-card-desc">{description}</p>
          {recentCount !== undefined ? (
            <p className="appsheet-card-count">
              Registros recientes en AppSheet: {recentCount}
            </p>
          ) : null}
        </div>
      </div>

      <div className="appsheet-card-footer">
        <QrCodeComponent url={url} />
        <ButtonComponent className="appsheet-card-btn" onClick={() => window.open(url, "_blank")}>
          <ExternalLink className="h-4 w-4" />
          Abrir en AppSheet
        </ButtonComponent>
      </div>
    </CardComponent>
  );
}
