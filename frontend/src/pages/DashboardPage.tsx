import { Link } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  Brain,
  FileText,
  Megaphone,
  PenLine,
  ShieldCheck,
} from "lucide-react";
import {
  useEffect,
  useState,
} from "react";

import {
  useWorkspace,
} from "@/features/workspace/context";
import {
  getAnalytics,
} from "@/features/analytics/services/analyticsService";
import type {
  Analytics,
} from "@/features/analytics/types/analytics";

const actions = [
  {
    to: "/brand-setup",
    label: "Brand Setup",
    detail: "Define voice, audience, goals, and platforms.",
    icon: ShieldCheck,
  },
  {
    to: "/documents",
    label: "Documents",
    detail: "Upload source material for grounded content.",
    icon: FileText,
  },
  {
    to: "/brand-brain",
    label: "Brand Brain",
    detail: "Ask questions across memory and documents.",
    icon: Brain,
  },
  {
    to: "/content-studio",
    label: "Content Studio",
    detail: "Run research, SEO, writing, editing, and approval.",
    icon: PenLine,
  },
  {
    to: "/publishing",
    label: "Publishing",
    detail: "Schedule and track channel publishing.",
    icon: Megaphone,
  },
  {
    to: "/analytics",
    label: "Analytics",
    detail: "Monitor quality, volume, and AI insights.",
    icon: BarChart3,
  },
];

function formatScore(value?: number) {
  return Number.isFinite(value)
    ? Number(value).toFixed(1)
    : "0.0";
}

export default function DashboardPage() {
  const { workspace } =
    useWorkspace();

  const [analytics, setAnalytics] =
    useState<Analytics | null>(null);

  useEffect(() => {
    if (!workspace) {
      return;
    }

    void getAnalytics(workspace.id).then(setAnalytics);
  }, [workspace]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2 text-left">
        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
          Workspace Command Center
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-slate-950">
          {workspace?.name}
        </h1>
        <p className="text-slate-500">
          {workspace?.slug}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {[
          ["Generated", analytics?.content_generated ?? 0],
          ["Published", analytics?.content_published ?? 0],
          ["Overall", formatScore(analytics?.average_overall_score)],
          ["Brand", formatScore(analytics?.average_brand_alignment)],
        ].map(([label, value]) => (
          <div
            key={label}
            className="rounded-lg border border-slate-200 bg-white p-5 text-left shadow-sm"
          >
            <p className="text-sm text-slate-500">
              {label}
            </p>
            <p className="mt-2 text-3xl font-bold text-slate-950">
              {value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <Link
              key={action.to}
              to={action.to}
              className="group rounded-lg border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="rounded-md bg-emerald-50 p-2 text-emerald-700">
                  <Icon className="size-5" />
                </div>
                <ArrowRight className="size-5 text-slate-400 transition group-hover:translate-x-1 group-hover:text-emerald-700" />
              </div>
              <h2 className="mt-4 text-lg font-semibold text-slate-950">
                {action.label}
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                {action.detail}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
