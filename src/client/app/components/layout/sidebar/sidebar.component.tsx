import { HardHat, X } from "lucide-react";
import type { ViewId } from "@domain/types";
import { NAV_ITEMS } from "@app/components/layout/nav-items/nav-items";
import "./sidebar.component.css";

export function SidebarComponent({
  active,
  onNavigate,
  collapsed,
  onToggle,
  open,
  onClose,
}: {
  active: ViewId;
  onNavigate: (view: ViewId) => void;
  collapsed: boolean;
  onToggle: () => void;
  open: boolean;
  onClose: () => void;
}) {
  const handleNavigate = (view: ViewId) => {
    onNavigate(view);
    onClose();
  };

  return (
    <>
      <div
        className={`sidebar-overlay ${open ? "sidebar-overlay-visible" : "sidebar-overlay-hidden"}`}
        onClick={onClose}
        role="presentation"
      />

      <aside
        className={`sidebar-panel ${open ? "sidebar-panel-visible" : "sidebar-panel-hidden"} md:static md:z-auto md:block ${open || !collapsed ? "sidebar-expanded" : "sidebar-collapsed"}`}
      >
        <div className="sidebar-logo">
          <button
            type="button"
            onClick={onToggle}
            className="sidebar-icon"
            aria-label={collapsed ? "Expandir menú" : "Colapsar menú"}
          >
            <HardHat className="h-5 w-5" />
          </button>
          <div
            className={`sidebar-brand ${open || !collapsed ? "sidebar-brand-visible" : "sidebar-brand-hidden"}`}
          >
            <p className="text-sm font-semibold text-slate-900">SST Demo</p>
            <p className="text-xs text-slate-500">Hub DHO</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="sidebar-close md:hidden"
            aria-label="Cerrar menú"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="sidebar-nav">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
            const isActive = active === id;
            const hideLabel = collapsed && !open;
            return (
              <button
                key={id}
                type="button"
                onClick={() => handleNavigate(id)}
                className={`sidebar-nav-item ${isActive ? "sidebar-nav-item-active" : "sidebar-nav-item-inactive"}`}
                title={hideLabel ? label : undefined}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {!hideLabel ? <span>{label}</span> : null}
              </button>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
