import { Settings } from "lucide-react";
import { useConfig } from "@app/hooks/use-config";
import { PageHeaderComponent } from "@app/components/layout/page-header/page-header.component";
import { SetupWizardComponent } from "@app/components/config/setup-wizard/setup-wizard.component";
import { SpinnerComponent } from "@app/components/ui/spinner/spinner.component";
import "./config.page.css";

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
      <div className="config-loading">
        <SpinnerComponent className="spinner-lg" />
      </div>
    );
  }

  return (
    <div className="config-page">
      <PageHeaderComponent
        title="Configuración"
        description="Integración con AppSheet DB, Looker Studio y parámetros de alertas"
        icon={Settings}
      />
      {error ? <div className="config-error">{error}</div> : null}
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
