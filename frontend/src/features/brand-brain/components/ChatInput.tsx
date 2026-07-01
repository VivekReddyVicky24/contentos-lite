import {
  useState,
} from "react";
import { Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
      className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-2 shadow-sm sm:flex-row"
    >
      <Input
        value={question}
        onChange={(e) =>
          setQuestion(
            e.target.value,
          )
        }
        placeholder="Ask about your brand..."
        className="h-11 flex-1 border-0 shadow-none focus-visible:ring-0"
      />

      <Button
        type="submit"
        disabled={
          loading ||
          !question.trim()
        }
        className="h-11 shrink-0"
      >
        <Send className="size-4" />
        {loading
          ? "Thinking..."
          : "Send"}
      </Button>
    </form>
  );
}
