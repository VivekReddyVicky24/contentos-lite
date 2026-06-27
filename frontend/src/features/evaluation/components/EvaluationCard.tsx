import type { Evaluation } from "../types/evaluation";

interface Props {
  evaluation: Evaluation;
}

export default function EvaluationCard({
  evaluation,
}: Props) {
  return (
    <div className="rounded-xl border p-6 shadow-sm">

      <h3 className="mb-4 text-lg font-semibold">
        Evaluation Report
      </h3>

      <div className="space-y-2">

        <div>
          Readability:
          <span className="ml-2 font-bold">
            {evaluation.readability}/100
          </span>
        </div>

        <div>
          Brand Alignment:
          <span className="ml-2 font-bold">
            {evaluation.brand_alignment}/100
          </span>
        </div>

        <div>
          Groundedness:
          <span className="ml-2 font-bold">
            {evaluation.groundedness}/100
          </span>
        </div>

      </div>

    </div>
  );
}