import { ClipboardList } from "lucide-react";
import { useDashboard } from "@app/hooks/use-dashboard";
import { useConfig } from "@app/hooks/use-config";
import { PageHeaderComponent } from "@app/components/layout/page-header/page-header.component";
import { AppSheetSectionComponent } from "@app/components/forms/appsheet-section/appsheet-section.component";
import { SpinnerComponent } from "@app/components/ui/spinner/spinner.component";

export function FormsPage() {
  const { config, loading } = useConfig();
  const { summary } = useDashboard();

  if (loading || !config) {
    return (
      <div className="flex justify-center py-20">
        <SpinnerComponent className="h-8 w-8" />
      </div>
    );
  }

  return (
    <div>
      <PageHeaderComponent
        title="Formularios AppSheet"
        description="Digitalización de formatos EPP e inspecciones con sync en tiempo real"
        icon={ClipboardList}
      />
      <AppSheetSectionComponent
        appsheetDbUrl={config.appsheetDbUrl}
        recentEppCount={summary.data?.recentEppCount ?? 0}
      />
    </div>
  );
}
