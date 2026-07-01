import {
  BarChart3,
  Brain,
  FileText,
  LayoutDashboard,
  Megaphone,
  PenLine,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { NavLink } from "react-router-dom";

import LogoutButton from "@/components/LogoutButton";
import WorkspaceSelector from "@/features/workspace/components/WorkspaceSelector";

const navItems = [
  {
    to: "/",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    to: "/analytics",
    label: "Analytics",
    icon: BarChart3,
  },
  {
    to: "/brand-setup",
    label: "Brand Setup",
    icon: ShieldCheck,
  },
  {
    to: "/documents",
    label: "Documents",
    icon: FileText,
  },
  {
    to: "/brand-brain",
    label: "Brand Brain",
    icon: Brain,
  },
  {
    to: "/content-studio",
    label: "Content Studio",
    icon: PenLine,
  },
  {
    to: "/evaluations",
    label: "Evaluations",
    icon: Sparkles,
  },
  {
    to: "/publishing",
    label: "Publishing",
    icon: Megaphone,
  },
];

export default function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <div className="grid size-10 shrink-0 place-items-center rounded-lg bg-emerald-600 text-sm font-bold text-white">
              CC
            </div>
            <div className="min-w-0 text-left">
              <p className="text-sm font-semibold text-slate-900">
                ContentCrew
              </p>
              <WorkspaceSelector />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <LogoutButton />
          </div>
        </div>

        <nav className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 pb-3">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  [
                    "inline-flex h-10 shrink-0 items-center gap-2 rounded-md px-3 text-sm font-medium transition",
                    isActive
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-950",
                  ].join(" ")
                }
              >
                <Icon className="size-4" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
      </header>

      <main className="mx-auto w-full max-w-7xl px-4 py-8">
        {children}
      </main>
    </div>
  );
}
