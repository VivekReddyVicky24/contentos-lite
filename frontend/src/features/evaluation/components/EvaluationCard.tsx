import type { Evaluation } from "../types/evaluation";

interface Props {
  evaluation: Evaluation;
}

export default function EvaluationCard({
  evaluation,
}: Props) {
  const metrics = [
    [
      "Readability",
      evaluation.readability,
    ],
    [
      "Brand Alignment",
      evaluation.brand_alignment,
    ],
    [
      "Groundedness",
      evaluation.groundedness,
    ],
  ];

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 text-left shadow-sm">
      <h3 className="text-lg font-semibold text-slate-950">
        Evaluation Report
      </h3>

      <div className="mt-3 text-3xl font-bold text-slate-950">
        {evaluation.overall_score}
        <span className="text-base font-medium text-slate-500">
          /100 overall
        </span>
      </div>

      <div className="mt-5 space-y-3">
        {metrics.map(([label, value]) => (
          <div key={label as string}>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">
                {label}
              </span>
              <span className="font-semibold text-slate-900">
                {value}/100
              </span>
            </div>
            <div className="mt-1 h-2 rounded-full bg-slate-100">
              <div
                className="h-2 rounded-full bg-emerald-600"
                style={{
                  width: `${value}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
