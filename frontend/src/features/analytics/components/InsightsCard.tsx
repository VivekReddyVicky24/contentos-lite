import type {
  Analytics,
} from "../types/analytics";

interface Props {
  analytics: Analytics;
}

export default function InsightsCard({
  analytics,
}: Props) {

  const bestMetric = Math.max(
    analytics.average_readability,
    analytics.average_brand_alignment,
    analytics.average_groundedness,
  );

  let insight =
    "Groundedness needs improvement.";

  if (
    bestMetric ===
    analytics.average_readability
  ) {
    insight =
      "Readability is your strongest area.";
  }

  if (
    bestMetric ===
    analytics.average_brand_alignment
  ) {
    insight =
      "Brand consistency is excellent.";
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 text-left shadow-sm">

      <h2 className="mb-4 text-lg font-semibold text-slate-950">
        AI Insights
      </h2>

      <p className="text-slate-600">
        {insight}
      </p>

    </div>
  );
}
