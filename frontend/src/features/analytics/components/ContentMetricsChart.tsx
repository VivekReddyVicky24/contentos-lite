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
        backgroundColor: [
          "#059669",
          "#0284c7",
        ],
        borderRadius: 6,
      },
    ],
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-slate-950">
        Content Metrics
      </h2>
      <Bar
        data={data}
        options={{
          responsive: true,
          plugins: {
            legend: {
              display: false,
            },
          },
        }}
      />
    </div>
  );
}
