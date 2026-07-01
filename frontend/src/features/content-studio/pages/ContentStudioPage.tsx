import { useState } from "react";
import { toast } from "sonner";

import {
  useWorkspace,
} from "@/features/workspace/context";

import {
  runPipeline,
} from "../services/agentService";

import TopicForm from "../components/TopicForm";
import AgentTimeline from "../components/AgentTimeline";
import DraftPreview from "../components/DraftPreview";

import type {
  AgentResponse,
} from "../types/contentStudio";

export default function ContentStudioPage() {

  const {
    workspace,
  } = useWorkspace();

  const [loading, setLoading] =
    useState(false);

  const [result, setResult] =
    useState<AgentResponse | null>(
      null,
    );

  async function handleGenerate(
    topic: string,
  ) {

    if (!workspace) {

      alert(
        "No workspace selected.",
      );

      return;
    }

    try {

      setLoading(true);
      setResult(null);

      const response =
        await runPipeline(
          topic,
          workspace.id,
        );

      setResult(response);

    } catch (error) {

      console.error(error);

      toast.error(
        "Pipeline execution failed.",
      );

    } finally {

      setLoading(false);

    }

  }

  return (

    <div className="space-y-6 text-left">

      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
          Agent Pipeline
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
          Content Studio
        </h1>
        <p className="mt-2 text-slate-500">
          Generate content through research, planning, SEO, writing, editing, evaluation, and approval.
        </p>
      </div>

      <TopicForm
        onGenerate={
          handleGenerate
        }
        disabled={loading}
      />

      {result?.failed && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {result.error_message}
        </div>
      )}

      {result?.evaluation && (
        <div className="grid gap-4 md:grid-cols-4">
          {[
            ["Readability", result.evaluation.readability],
            ["Brand", result.evaluation.brand_alignment],
            ["Groundedness", result.evaluation.groundedness],
            ["Overall", result.evaluation.overall_score],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
            >
              <p className="text-sm text-slate-500">
                {label}
              </p>
              <p className="mt-2 text-2xl font-bold text-slate-950">
                {Number(value ?? 0).toFixed(1)}
              </p>
            </div>
          ))}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">

        <AgentTimeline
          logs={
            result?.execution_log ??
            []
          }
          running={loading}
          failed={result?.failed}
        />

        <DraftPreview
          draft={
            result?.edited_draft ??
            null
          }
        />

      </div>

      {result && (
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-950">
            State Verification
          </h2>
          <div className="mt-4 grid gap-2 md:grid-cols-3">
            {[
              "research",
              "plan",
              "seo",
              "draft",
              "edited_draft",
              "evaluation",
            ].map((key) => (
              <div
                key={key}
                className="rounded-md bg-slate-50 px-3 py-2 text-sm text-slate-700"
              >
                <span className="font-medium">
                  state["{key}"]
                </span>
                <span className="float-right text-emerald-700">
                  {result[
                    key as keyof AgentResponse
                  ]
                    ? "present"
                    : "missing"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>

  );
}
