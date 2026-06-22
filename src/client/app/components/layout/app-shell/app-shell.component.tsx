import { useState, type ReactNode } from "react";
import type { ViewId } from "@domain/types";
import { SidebarComponent } from "@app/components/layout/sidebar/sidebar.component";

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

  return (
    <div className="flex min-h-screen">
      <SidebarComponent
        active={active}
        onNavigate={onNavigate}
        collapsed={collapsed}
        onToggle={() => setCollapsed((value) => !value)}
      />
      <main className="flex-1 overflow-auto p-4 md:p-8">{children}</main>
    </div>
  );
}
