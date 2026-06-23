import type { LucideIcon } from "lucide-react";
import "./page-header.component.css";

export function PageHeaderComponent({
  title,
  description,
  icon: Icon,
}: {
  title: string;
  description?: string;
  icon?: LucideIcon;
}) {
  return (
    <div className="page-header">
      <div className="page-header-inner">
        {Icon ? (
          <div className="page-header-icon">
            <Icon className="page-header-icon-inner" />
          </div>
        ) : null}
        <div>
          <h1 className="page-header-title">{title}</h1>
          {description ? (
            <p className="page-header-description">{description}</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
