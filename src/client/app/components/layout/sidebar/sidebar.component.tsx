import { HardHat } from "lucide-react";
import type { ViewId } from "@domain/types";
import { NAV_ITEMS } from "@app/components/layout/nav-items/nav-items";

export function SidebarComponent({
  active,
  onNavigate,
  collapsed,
  onToggle,
}: {
  active: ViewId;
  onNavigate: (view: ViewId) => void;
  collapsed: boolean;
  onToggle: () => void;
}) {
  return (
    <aside
      className={`flex shrink-0 flex-col border-r border-slate-200 bg-white transition-all ${collapsed ? "w-[72px]" : "w-64"}`}
    >
      <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white">
          <HardHat className="h-5 w-5" />
        </div>
        {!collapsed ? (
          <div>
            <p className="text-sm font-semibold text-slate-900">SST Demo</p>
            <p className="text-xs text-slate-500">Hub DHO</p>
          </div>
        ) : null}
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onNavigate(id)}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                isActive
                  ? "bg-emerald-50 text-emerald-700"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
              title={collapsed ? label : undefined}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {!collapsed ? <span>{label}</span> : null}
            </button>
          );
        })}
      </nav>

      <div className="border-t border-slate-100 p-3">
        <button
          type="button"
          onClick={onToggle}
          className="w-full rounded-xl px-3 py-2 text-xs text-slate-500 hover:bg-slate-50"
        >
          {collapsed ? "→" : "← Colapsar"}
        </button>
      </div>
    </aside>
  );
}
