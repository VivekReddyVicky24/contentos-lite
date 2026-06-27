import {
  useEffect,
  useState,
} from "react";

import {
  useWorkspace,
} from "@/features/workspace/context/WorkspaceContext";

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

    <div className="mx-auto max-w-6xl p-8">

      <h1 className="mb-8 text-4xl font-bold">
        Evaluation Dashboard
      </h1>

      <div className="space-y-4">

        {evaluations.map(
          (evaluation) => (

            <div
              key={evaluation.id}
              className="rounded-xl border p-6"
            >

              <p>
                Readability:
                {" "}
                {evaluation.readability}
              </p>

              <p>
                Brand Alignment:
                {" "}
                {evaluation.brand_alignment}
              </p>

              <p>
                Groundedness:
                {" "}
                {evaluation.groundedness}
              </p>

            </div>

          ),
        )}

      </div>

    </div>
  );
}