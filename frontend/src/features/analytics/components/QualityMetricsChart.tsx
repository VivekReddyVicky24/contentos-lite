import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
} from "chart.js";

import { Line } from "react-chartjs-2";

import type {
  Analytics,
} from "../types/analytics";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
);

interface Props {
  analytics: Analytics;
}

export default function QualityMetricsChart({
  analytics,
}: Props) {

  const data = {
    labels: [
      "Readability",
      "Brand",
      "Groundedness",
    ],

    datasets: [
      {
        label: "Quality Metrics",
        data: [
          analytics.average_readability,
          analytics.average_brand_alignment,
          analytics.average_groundedness,
        ],
        borderColor: "#059669",
        backgroundColor: "rgba(5, 150, 105, 0.16)",
        tension: 0.35,
      },
    ],
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-slate-950">
        Quality Metrics
      </h2>
      <Line
        data={data}
        options={{
          responsive: true,
          scales: {
            y: {
              min: 0,
              max: 100,
            },
          },
        }}
      />
    </div>
  );
}
