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
    <div className="rounded-xl border p-6">

      <h2 className="mb-4 text-xl font-bold">
        AI Insights
      </h2>

      <p>{insight}</p>

    </div>
  );
}