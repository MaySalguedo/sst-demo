import { useState } from "react";
import type { ViewId } from "@domain/types";
import { AppShellComponent } from "@app/components/layout/app-shell/app-shell.component";
import { DashboardPage } from "@app/pages/dashboard/dashboard.page";
import { AlertasPage } from "@app/pages/alertas/alertas.page";
import { FormsPage } from "@app/pages/forms/forms.page";
import { ExtintoresPage } from "@app/pages/extintores/extintores.page";
import { ConfigPage } from "@app/pages/config/config.page";

const PAGES: Record<ViewId, () => React.JSX.Element> = {
  dashboard: DashboardPage,
  alertas: AlertasPage,
  forms: FormsPage,
  extintores: ExtintoresPage,
  config: ConfigPage,
};

export function AppComponent() {
  const [activeView, setActiveView] = useState<ViewId>("dashboard");
  const Page = PAGES[activeView];

  return (
    <AppShellComponent active={activeView} onNavigate={setActiveView}>
      <Page />
    </AppShellComponent>
  );
}
