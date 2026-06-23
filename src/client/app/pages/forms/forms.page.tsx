import { Database } from "lucide-react";
import { PageHeaderComponent } from "@app/components/layout/page-header/page-header.component";
import { CrudManagerComponent } from "@app/components/forms/crud-manager/crud-manager.component";
import "./forms.page.css";

export function FormsPage() {
  return (
    <div className="forms-page">
      <PageHeaderComponent
        title="Gestión de datos AppSheet"
        description="Administra registros de empleados, EPP, inspecciones y extintores directamente desde aquí"
        icon={Database}
      />
      <CrudManagerComponent />
    </div>
  );
}
