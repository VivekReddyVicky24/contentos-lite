import {
  useEffect,
  useState,
} from "react";
import { toast } from "sonner";

import { useWorkspace }
from "@/features/workspace/context";

import AnalyticsCard
from "../components/AnalyticsCard";

import ContentMetricsChart
from "../components/ContentMetricsChart";

import InsightsCard
from "../components/InsightsCard";

import QualityMetricsChart
from "../components/QualityMetricsChart";

import {
  getAnalytics,
} from "../services/analyticsService";

import type {
  Analytics,
} from "../types/analytics";


export default function AnalyticsDashboard() {

  const {
    workspace,
  } = useWorkspace();

  const [
    analytics,
    setAnalytics,
  ] = useState<Analytics | null>(
    null,
  );

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    if (!workspace) {
      return;
    }

    const timer =
      window.setTimeout(() => {
        setLoading(true);

        getAnalytics(
          workspace.id,
        )
          .then(
            setAnalytics,
          )
          .catch((error) => {
            console.error(error);
            toast.error(
              "Could not load analytics.",
            );
          })
          .finally(() =>
            setLoading(false),
          );
      }, 0);

    return () => {
      window.clearTimeout(timer);
    };

  }, [workspace]);


  if (loading || !analytics) {

    return (
      <div className="text-sm text-slate-500">
        Loading...
      </div>
    );
  }

  return (

    <div className="space-y-6 text-left">

      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
          Performance
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
          Analytics Dashboard
        </h1>
        <p className="mt-2 text-slate-500">
          Track generation volume, publishing activity, and quality scores.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-6">

        <AnalyticsCard
          title="Generated"
          value={analytics.content_generated}
        />

        <AnalyticsCard
          title="Published"
          value={analytics.content_published}
        />

        <AnalyticsCard
          title="Readability"
          value={analytics.average_readability}
        />

        <AnalyticsCard
          title="Brand"
          value={analytics.average_brand_alignment}
        />

        <AnalyticsCard
          title="Groundedness"
          value={analytics.average_groundedness}
        />

        <AnalyticsCard
          title="Overall"
          value={analytics.average_overall_score}
        />

      </div>

      <div className="grid gap-6 lg:grid-cols-2">

        <ContentMetricsChart
          analytics={analytics}
        />

        <QualityMetricsChart
          analytics={analytics}
        />

      </div>

      <div>

        <InsightsCard
          analytics={analytics}
        />

      </div>

    </div>
  );
}
