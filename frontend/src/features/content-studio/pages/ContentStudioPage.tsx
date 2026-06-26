import { useState } from "react";

import TopicForm from "../components/TopicForm";
import AgentTimeline from "../components/AgentTimeline";
import DraftPreview from "../components/DraftPreview";

import type {
  AgentResponse,
} from "../types/contentStudio";

export default function ContentStudioPage() {

  const [loading, setLoading] =
    useState(false);

  const [result, setResult] =
    useState<AgentResponse | null>(
      null,
    );

  async function handleGenerate(
    topic: string,
  ) {

    // IMPORTANT:
    // No API calls yet.
    // Phase 5I will enable this.

    console.log(
      "Generate clicked:",
      topic,
    );

    alert(
      "Pipeline execution will be enabled in Phase 5I.",
    );
  }

  return (
    <div className="mx-auto max-w-7xl p-8">

      <h1 className="mb-8 text-4xl font-bold">
        Content Studio
      </h1>

      <TopicForm
        onGenerate={
          handleGenerate
        }
        disabled={loading}
      />

      <div className="mt-8 grid gap-8 lg:grid-cols-2">

        <AgentTimeline
          logs={
            result?.execution_log ??
            []
          }
        />

        <DraftPreview
          draft={
            result?.edited_draft ??
            null
          }
        />

      </div>

    </div>
  );
}