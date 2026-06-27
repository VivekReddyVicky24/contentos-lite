import {
  useEffect,
  useState,
} from "react";

import { useWorkspace }
from "@/features/workspace/context/WorkspaceContext";

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

  useEffect(() => {

    if (!workspace) {
      return;
    }

    getAnalytics(
      workspace.id,
    ).then(
      setAnalytics,
    );

  }, [workspace]);


  if (!analytics) {

    return (
      <div className="p-8">
        Loading...
      </div>
    );
  }

  return (

    <div className="mx-auto max-w-7xl p-8">

      <h1 className="mb-8 text-4xl font-bold">
        Analytics Dashboard
      </h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">

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

      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">

        <ContentMetricsChart
          analytics={analytics}
        />

        <QualityMetricsChart
          analytics={analytics}
        />

      </div>

      <div className="mt-8">

        <InsightsCard
          analytics={analytics}
        />

      </div>

    </div>
  );
}