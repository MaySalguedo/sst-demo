import { Flame } from "lucide-react";
import { useExtintores } from "@app/hooks/use-extintores";
import { PageHeaderComponent } from "@app/components/layout/page-header/page-header.component";
import { ExtinguisherTableComponent } from "@app/components/extintores/extinguisher-table/extinguisher-table.component";
import { SpinnerComponent } from "@app/components/ui/spinner/spinner.component";

export function ExtintoresPage() {
  const { items, loading, error } = useExtintores();

  return (
    <div>
      <PageHeaderComponent
        title="Extintores"
        description="Gestión operativa de recargas y estado de elementos de emergencia"
        icon={Flame}
      />
      {loading ? (
        <div className="flex justify-center py-10">
          <SpinnerComponent className="h-8 w-8" />
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {error}
        </div>
      ) : (
        <ExtinguisherTableComponent items={items} />
      )}
    </div>
  );
}
