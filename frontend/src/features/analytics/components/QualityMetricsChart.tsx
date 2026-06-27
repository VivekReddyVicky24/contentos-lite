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
      },
    ],
  };

  return (
    <div className="rounded-xl border p-6">
      <Line data={data} />
    </div>
  );
}