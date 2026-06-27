import {
  useEffect,
  useState,
} from "react";

import {
  useWorkspace,
} from "@/features/workspace/context/WorkspaceContext";

import AnalyticsCard
from "../components/AnalyticsCard";

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
          title="Content Generated"
          value={analytics.content_generated}
        />

        <AnalyticsCard
          title="Content Published"
          value={analytics.content_published}
        />

        <AnalyticsCard
          title="Avg Readability"
          value={analytics.average_readability}
        />

        <AnalyticsCard
          title="Avg Brand Alignment"
          value={analytics.average_brand_alignment}
        />

        <AnalyticsCard
          title="Avg Groundedness"
          value={analytics.average_groundedness}
        />

      </div>

    </div>
  );
}