import { Flame } from "lucide-react";
import { useExtintores } from "@app/hooks/use-extintores";
import { PageHeaderComponent } from "@app/components/layout/page-header/page-header.component";
import { ExtinguisherTableComponent } from "@app/components/extintores/extinguisher-table/extinguisher-table.component";
import { SpinnerComponent } from "@app/components/ui/spinner/spinner.component";
import "./extintores.page.css";

export function ExtintoresPage() {
  const { items, loading, error } = useExtintores();

  return (
    <div className="extintores-page">
      <PageHeaderComponent
        title="Extintores"
        description="Gestión operativa de recargas y estado de elementos de emergencia"
        icon={Flame}
      />
      {loading ? (
        <div className="extintores-loading">
          <SpinnerComponent className="spinner-lg" />
        </div>
      ) : error ? (
        <div className="extintores-error">{error}</div>
      ) : (
        <ExtinguisherTableComponent items={items} />
      )}
    </div>
  );
}
