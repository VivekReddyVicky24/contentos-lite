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

import type { Evaluation } from "../types/evaluation";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
);

interface Props {
  evaluations: Evaluation[];
}

export default function EvaluationTrendChart({
  evaluations,
}: Props) {

  const data = {
    labels: evaluations.map(
      (_, index) => `Run ${index + 1}`,
    ),

    datasets: [
      {
        label: "Readability",
        data: evaluations.map(
          (e) => e.readability,
        ),
        borderColor: "#0284c7",
        tension: 0.35,
      },

      {
        label: "Brand Alignment",
        data: evaluations.map(
          (e) => e.brand_alignment,
        ),
        borderColor: "#059669",
        tension: 0.35,
      },

      {
        label: "Groundedness",
        data: evaluations.map(
          (e) => e.groundedness,
        ),
        borderColor: "#7c3aed",
        tension: 0.35,
      },
    ],
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-slate-950">
        Evaluation Trend
      </h2>
      {evaluations.length === 0 ? (
        <p className="text-sm text-slate-500">
          Generate content to see quality trends.
        </p>
      ) : (
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
      )}
    </div>
  );
}
