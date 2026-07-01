import { Play } from "lucide-react";
import { useState } from "react";

interface Props {
  onGenerate: (
    topic: string,
  ) => void;

  disabled: boolean;
}

export default function TopicForm({
  onGenerate,
  disabled,
}: Props) {

  const [topic, setTopic] =
    useState("");

  function handleSubmit(
    e: React.FormEvent,
  ) {

    e.preventDefault();

    if (!topic.trim()) {
      return;
    }

    onGenerate(topic);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
    >
      <label className="block text-left">
        <span className="text-sm font-medium text-slate-700">
          Topic
        </span>
        <textarea
          rows={3}
          value={topic}
          onChange={(e) =>
            setTopic(e.target.value)
          }
          placeholder="AI content marketing for fitness startups"
          className="mt-2 w-full resize-none rounded-md border border-slate-300 p-3 text-slate-950 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
        />
      </label>

      <button
        disabled={disabled}
        className="mt-4 inline-flex h-10 items-center gap-2 rounded-md bg-emerald-600 px-4 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:opacity-50"
      >
        <Play className="size-4" />
        {disabled ? "Running..." : "Run Pipeline"}
      </button>
    </form>
  );
}
