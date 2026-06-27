import {
  useEffect,
  useState,
} from "react";

import {
  useWorkspace,
} from "@/features/workspace/context/WorkspaceContext";

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


  useEffect(() => {

    if (!workspace) {
      return;
    }

    getEvaluations(
      workspace.id,
    ).then(
      setEvaluations,
    );

  }, [workspace]);


  return (

    <div className="mx-auto max-w-7xl p-8">

      <h1 className="mb-8 text-4xl font-bold">
        Evaluation Dashboard
      </h1>

      <EvaluationTrendChart
        evaluations={evaluations}
      />

      <div className="mt-8 space-y-4">

        {evaluations.map(
          (evaluation) => (
            <EvaluationCard
              key={evaluation.id}
              evaluation={evaluation}
            />
          ),
        )}

      </div>

    </div>
  );
}