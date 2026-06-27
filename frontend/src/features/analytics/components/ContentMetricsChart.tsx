import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
} from "chart.js";

import { Bar } from "react-chartjs-2";

import type {
  Analytics,
} from "../types/analytics";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
);

interface Props {
  analytics: Analytics;
}

export default function ContentMetricsChart({
  analytics,
}: Props) {

  const data = {
    labels: [
      "Generated",
      "Published",
    ],

    datasets: [
      {
        label: "Content",
        data: [
          analytics.content_generated,
          analytics.content_published,
        ],
      },
    ],
  };

  return (
    <div className="rounded-xl border p-6">
      <Bar data={data} />
    </div>
  );
}