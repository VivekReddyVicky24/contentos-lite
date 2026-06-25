import {
  useState,
} from "react";

interface Props {
  onSend: (
    question: string,
  ) => Promise<void>;

  loading: boolean;
}

export default function ChatInput({
  onSend,
  loading,
}: Props) {
  const [question, setQuestion] =
    useState("");

  async function handleSubmit(
    e: React.FormEvent,
  ) {
    e.preventDefault();

    if (!question.trim()) {
      return;
    }

    await onSend(question);

    setQuestion("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex gap-2"
    >
      <input
        value={question}
        onChange={(e) =>
          setQuestion(
            e.target.value,
          )
        }
        placeholder="Ask about your brand..."
        className="flex-1 rounded-lg border p-3"
      />

      <button
        disabled={loading}
        className="rounded-lg bg-black px-6 py-3 text-white disabled:opacity-50"
      >
        {loading
          ? "Brand Brain is thinking..."
          : "Send"}
      </button>
    </form>
  );
}