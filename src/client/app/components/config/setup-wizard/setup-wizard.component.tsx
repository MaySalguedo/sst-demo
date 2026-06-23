import { useEffect, useState } from "react";
import { CheckCircle2, Database, LineChart, Smartphone, XCircle } from "lucide-react";
import type {
  AppConfig,
  AppConfigInput,
  ConnectionTestResult,
} from "@domain/types";
import { ButtonComponent } from "@app/components/ui/button/button.component";
import { CardComponent } from "@app/components/ui/card/card.component";
import { SpinnerComponent } from "@app/components/ui/spinner/spinner.component";
import "./setup-wizard.component.css";

const STEPS = [
  {
    id: 1,
    title: "Conectar AppSheet API",
    icon: Database,
    description:
      "Habilita la API en tu App (Settings -> Integrations) y pega App ID + Access Key.",
  },
  {
    id: 2,
    title: "Formularios AppSheet",
    icon: Smartphone,
    description:
      "Crea vistas Form para EPP e Inspecciones sobre la misma base de datos.",
  },
  {
    id: 3,
    title: "Conectar Looker Studio",
    icon: LineChart,
    description:
      "Usa la base como fuente de datos y publica el tablero embebido.",
  },
];

export function SetupWizardComponent({
  config,
  saving,
  testing,
  onSave,
  onTestConnection,
  lastTest,
}: {
  config: AppConfig;
  saving: boolean;
  testing: boolean;
  onSave: (partial: AppConfigInput) => Promise<void>;
  onTestConnection: (table?: string) => Promise<ConnectionTestResult | null>;
  lastTest: ConnectionTestResult | null;
}) {
  const [form, setForm] = useState({
    appsheetAppId: config.appsheetAppId,
    appsheetRegion: config.appsheetRegion,
    appsheetAccessKey: "",
    appsheetDbUrl: config.appsheetDbUrl,
    lookerReportUrl: config.lookerReportUrl,
    lookerEmbedUrl: config.lookerEmbedUrl,
    alertDaysBefore: String(config.alertDaysBefore),
    emailSst: config.emailSst,
  });

  useEffect(() => {
    setForm({
      appsheetAppId: config.appsheetAppId,
      appsheetRegion: config.appsheetRegion,
      appsheetAccessKey: "",
      appsheetDbUrl: config.appsheetDbUrl,
      lookerReportUrl: config.lookerReportUrl,
      lookerEmbedUrl: config.lookerEmbedUrl,
      alertDaysBefore: String(config.alertDaysBefore),
      emailSst: config.emailSst,
    });
  }, [config]);

  const handleSave = () => {
    const payload: AppConfigInput = {
      appsheetAppId: form.appsheetAppId,
      appsheetRegion: form.appsheetRegion,
      appsheetDbUrl: form.appsheetDbUrl,
      lookerReportUrl: form.lookerReportUrl,
      lookerEmbedUrl: form.lookerEmbedUrl,
      alertDaysBefore: Number(form.alertDaysBefore),
      emailSst: form.emailSst,
    };
    if (form.appsheetAccessKey) {
      payload.appsheetAccessKey = form.appsheetAccessKey;
    }
    void onSave(payload);
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="wizard-steps">
        {STEPS.map((step) => (
          <CardComponent key={step.id}>
            <div className="wizard-step-icon">
              <step.icon className="wizard-step-icon-inner" />
              <span className="wizard-step-number">Paso {step.id}</span>
            </div>
            <h3 className="text-sm font-medium text-slate-900 md:text-base">{step.title}</h3>
            <p className="mt-1 text-xs text-slate-500 md:mt-2 md:text-sm">{step.description}</p>
          </CardComponent>
        ))}
      </div>

      <CardComponent className="space-y-3 md:space-y-4">
        <div className="wizard-connection">
          <div>
            <h3 className="text-sm font-medium text-slate-900 md:text-base">
              Paso 1 · Conexión a la base de AppSheet
            </h3>
            <p className="text-xs text-slate-500 md:text-sm">
              Prueba que las credenciales lean la tabla <code>employees</code>.
            </p>
          </div>
          <ButtonComponent
            variant="secondary"
            disabled={testing}
            onClick={() => void onTestConnection()}
          >
            {testing ? <SpinnerComponent /> : <CheckCircle2 className="h-4 w-4" />}
            Probar conexión
          </ButtonComponent>
        </div>

        <div className="wizard-form-grid">
          <label className="wizard-field">
            <span className="wizard-label">App ID</span>
            <input
              className="wizard-input"
              value={form.appsheetAppId}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, appsheetAppId: event.target.value }))
              }
            />
          </label>

          <label className="wizard-field">
            <span className="wizard-label">Región (base URL)</span>
            <input
              className="wizard-input"
              value={form.appsheetRegion}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, appsheetRegion: event.target.value }))
              }
            />
          </label>

          <label className="wizard-field wizard-form-full">
            <span className="wizard-label">
              Application Access Key{" "}
              {config.hasAccessKey ? (
                <span className="text-emerald-600">(configurada)</span>
              ) : (
                <span className="text-rose-500">(pendiente)</span>
              )}
            </span>
            <input
              type="password"
              placeholder={
                config.hasAccessKey ? "•••••••• (dejar vacío para conservar)" : "V2-..."
              }
              className="wizard-input"
              value={form.appsheetAccessKey}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  appsheetAccessKey: event.target.value,
                }))
              }
            />
          </label>
        </div>

        {lastTest ? (
          <p
            className={`${lastTest.ok ? "wizard-status-ok" : "wizard-status-error"}`}
          >
            {lastTest.ok ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <XCircle className="h-4 w-4" />
            )}
            {lastTest.message}
          </p>
        ) : null}
      </CardComponent>

      <CardComponent className="wizard-form-grid">
        <label className="wizard-field wizard-form-full">
          <span className="wizard-label">AppSheet DB URL</span>
          <input
            className="wizard-input"
            value={form.appsheetDbUrl}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, appsheetDbUrl: event.target.value }))
            }
          />
        </label>

        <label className="wizard-field">
          <span className="wizard-label">Looker report URL</span>
          <input
            className="wizard-input"
            value={form.lookerReportUrl}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                lookerReportUrl: event.target.value,
              }))
            }
          />
        </label>

        <label className="wizard-field">
          <span className="wizard-label">Looker embed URL</span>
          <input
            className="wizard-input"
            value={form.lookerEmbedUrl}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, lookerEmbedUrl: event.target.value }))
            }
          />
        </label>

        <label className="wizard-field">
          <span className="wizard-label">Días de anticipación</span>
          <input
            type="number"
            min={1}
            className="wizard-input"
            value={form.alertDaysBefore}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                alertDaysBefore: event.target.value,
              }))
            }
          />
        </label>

        <label className="wizard-field">
          <span className="wizard-label">Email SST</span>
          <input
            type="email"
            className="wizard-input"
            value={form.emailSst}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, emailSst: event.target.value }))
            }
          />
        </label>

        <div className="wizard-form-full">
          <ButtonComponent disabled={saving} onClick={handleSave}>
            {saving ? <SpinnerComponent /> : null}
            Guardar configuración
          </ButtonComponent>
        </div>
      </CardComponent>
    </div>
  );
}
