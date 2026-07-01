import {
  useEffect,
  useState,
} from "react";
import { toast } from "sonner";

import {
  useWorkspace,
} from "@/features/workspace/context";

import EvaluationCard from "../components/EvaluationCard";
import EvaluationTrendChart from "../components/EvaluationTrendChart";

import {
  getEvaluations,
} from "../services/evaluationService";

import type {
  Evaluation,
} from "../types/evaluation";


export default function EvaluationDashboard() {

  const {
    workspace,
  } = useWorkspace();

  const [
    evaluations,
    setEvaluations,
  ] = useState<Evaluation[]>([]);

  const [loading, setLoading] =
    useState(true);


  useEffect(() => {

    if (!workspace) {
      return;
    }

    const timer =
      window.setTimeout(() => {
        setLoading(true);

        getEvaluations(
          workspace.id,
        )
          .then(
            setEvaluations,
          )
          .catch((error) => {
            console.error(error);
            toast.error(
              "Could not load evaluations.",
            );
          })
          .finally(() =>
            setLoading(false),
          );
      }, 0);

    return () => {
      window.clearTimeout(timer);
    };

  }, [workspace]);


  return (

    <div className="space-y-6 text-left">

      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
          Quality System
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
          Evaluation Dashboard
        </h1>
        <p className="mt-2 text-slate-500">
          Review readability, brand alignment, groundedness, and overall score.
        </p>
      </div>

      <EvaluationTrendChart
        evaluations={evaluations}
      />

      {loading ? (
        <div className="rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-500">
          Loading evaluations...
        </div>
      ) : evaluations.length === 0 ? (
        <div className="rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-500">
          No evaluations yet.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">

          {evaluations.map(
            (evaluation) => (
              <EvaluationCard
                key={evaluation.id}
                evaluation={evaluation}
              />
            ),
          )}

        </div>
      )}

    </div>
  );
}
