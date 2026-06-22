import { Settings } from "lucide-react";
import { useConfig } from "@app/hooks/use-config";
import { PageHeaderComponent } from "@app/components/layout/page-header/page-header.component";
import { SetupWizardComponent } from "@app/components/config/setup-wizard/setup-wizard.component";
import { SpinnerComponent } from "@app/components/ui/spinner/spinner.component";

export function ConfigPage() {
  const {
    config,
    loading,
    saving,
    testing,
    error,
    lastTest,
    save,
    testConnection,
  } = useConfig();

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
        title="Configuración"
        description="Integración con AppSheet DB, Looker Studio y parámetros de alertas"
        icon={Settings}
      />
      {error ? (
        <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {error}
        </div>
      ) : null}
      <SetupWizardComponent
        config={config}
        saving={saving}
        testing={testing}
        onSave={save}
        onTestConnection={testConnection}
        lastTest={lastTest}
      />
    </div>
  );
}
