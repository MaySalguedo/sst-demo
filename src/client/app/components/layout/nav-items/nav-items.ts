import {
  Bell,
  ClipboardList,
  Flame,
  LayoutDashboard,
  Settings,
} from "lucide-react";
import type { ViewId } from "@domain/types";

export const NAV_ITEMS: {
  id: ViewId;
  label: string;
  icon: typeof LayoutDashboard;
}[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "alertas", label: "Alertas", icon: Bell },
  { id: "forms", label: "AppSheet", icon: ClipboardList },
  { id: "extintores", label: "Extintores", icon: Flame },
  { id: "config", label: "Configuración", icon: Settings },
];
