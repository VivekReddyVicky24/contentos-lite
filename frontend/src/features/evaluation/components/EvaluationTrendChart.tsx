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
      },

      {
        label: "Brand Alignment",
        data: evaluations.map(
          (e) => e.brand_alignment,
        ),
      },

      {
        label: "Groundedness",
        data: evaluations.map(
          (e) => e.groundedness,
        ),
      },
    ],
  };

  return (
    <div className="rounded-xl border p-6">
      <Line data={data} />
    </div>
  );
}