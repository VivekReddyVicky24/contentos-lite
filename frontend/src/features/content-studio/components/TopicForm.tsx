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
      className="space-y-4"
    >
      <input
        value={topic}
        onChange={(e) =>
          setTopic(e.target.value)
        }
        placeholder="Enter a content topic..."
        className="w-full rounded-lg border p-3"
      />

      <button
        disabled={disabled}
        className="rounded-lg bg-black px-6 py-3 text-white disabled:opacity-50"
      >
        Generate Content
      </button>
    </form>
  );
}