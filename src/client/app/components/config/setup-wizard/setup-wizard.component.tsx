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
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-3">
        {STEPS.map((step) => (
          <CardComponent key={step.id}>
            <div className="mb-3 flex items-center gap-2 text-emerald-600">
              <step.icon className="h-4 w-4" />
              <span className="text-xs font-semibold uppercase">
                Paso {step.id}
              </span>
            </div>
            <h3 className="font-medium text-slate-900">{step.title}</h3>
            <p className="mt-2 text-sm text-slate-500">{step.description}</p>
          </CardComponent>
        ))}
      </div>

      <CardComponent className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-medium text-slate-900">
              Paso 1 · Conexión a la base de AppSheet
            </h3>
            <p className="text-sm text-slate-500">
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

        <div className="grid gap-4 md:grid-cols-2">
          <label className="block text-sm">
            <span className="mb-1 block text-slate-600">App ID</span>
            <input
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none ring-emerald-600/30 focus:ring-2"
              value={form.appsheetAppId}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, appsheetAppId: event.target.value }))
              }
            />
          </label>

          <label className="block text-sm">
            <span className="mb-1 block text-slate-600">Región (base URL)</span>
            <input
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none ring-emerald-600/30 focus:ring-2"
              value={form.appsheetRegion}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, appsheetRegion: event.target.value }))
              }
            />
          </label>

          <label className="block text-sm md:col-span-2">
            <span className="mb-1 block text-slate-600">
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
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none ring-emerald-600/30 focus:ring-2"
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
            className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm ${
              lastTest.ok
                ? "bg-emerald-50 text-emerald-700"
                : "bg-rose-50 text-rose-700"
            }`}
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

      <CardComponent className="grid gap-4 md:grid-cols-2">
        <label className="block text-sm md:col-span-2">
          <span className="mb-1 block text-slate-600">AppSheet DB URL</span>
          <input
            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none ring-emerald-600/30 focus:ring-2"
            value={form.appsheetDbUrl}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, appsheetDbUrl: event.target.value }))
            }
          />
        </label>

        <label className="block text-sm">
          <span className="mb-1 block text-slate-600">Looker report URL</span>
          <input
            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none ring-emerald-600/30 focus:ring-2"
            value={form.lookerReportUrl}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                lookerReportUrl: event.target.value,
              }))
            }
          />
        </label>

        <label className="block text-sm">
          <span className="mb-1 block text-slate-600">Looker embed URL</span>
          <input
            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none ring-emerald-600/30 focus:ring-2"
            value={form.lookerEmbedUrl}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, lookerEmbedUrl: event.target.value }))
            }
          />
        </label>

        <label className="block text-sm">
          <span className="mb-1 block text-slate-600">Días de anticipación</span>
          <input
            type="number"
            min={1}
            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none ring-emerald-600/30 focus:ring-2"
            value={form.alertDaysBefore}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                alertDaysBefore: event.target.value,
              }))
            }
          />
        </label>

        <label className="block text-sm">
          <span className="mb-1 block text-slate-600">Email SST</span>
          <input
            type="email"
            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none ring-emerald-600/30 focus:ring-2"
            value={form.emailSst}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, emailSst: event.target.value }))
            }
          />
        </label>

        <div className="md:col-span-2">
          <ButtonComponent disabled={saving} onClick={handleSave}>
            {saving ? <SpinnerComponent /> : null}
            Guardar configuración
          </ButtonComponent>
        </div>
      </CardComponent>
    </div>
  );
}
