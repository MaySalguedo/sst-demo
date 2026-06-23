import { useState, type ReactNode } from "react";
import { Menu } from "lucide-react";
import type { ViewId } from "@domain/types";
import { SidebarComponent } from "@app/components/layout/sidebar/sidebar.component";
import "./app-shell.component.css";

export function AppShellComponent({
  active,
  onNavigate,
  children,
}: {
  active: ViewId;
  onNavigate: (view: ViewId) => void;
  children: ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="shell">
      <div className="shell-layout">
        <SidebarComponent
          active={active}
          onNavigate={onNavigate}
          collapsed={collapsed}
          onToggle={() => setCollapsed((v) => !v)}
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <main className="shell-main">
          <div className="shell-header md:hidden">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-600 hover:bg-slate-100"
              aria-label="Abrir menú"
            >
              <Menu className="h-5 w-5" />
            </button>
            <span className="text-sm font-semibold text-slate-900">SST Demo</span>
          </div>
          <div className="shell-main-content">{children}</div>
        </main>
      </div>
    </div>
  );
}
