import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useWorkspace,
} from "@/features/workspace/context/WorkspaceContext";

import {
  streamBrandBrain,
} from "../services/brandBrainService";

import ChatInput from "../components/ChatInput";
import ChatMessage from "../components/ChatMessage";

import type {
  ChatMessage as Message,
} from "../types/brandBrain";

export default function BrandBrainPage() {
  const { workspace } =
    useWorkspace();

  const messagesEndRef =
    useRef<HTMLDivElement>(null);

  const [messages, setMessages] =
    useState<Message[]>([]);

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  async function handleSend(
    question: string,
  ) {
    if (!workspace) {
      return;
    }

    const userMessage: Message =
      {
        id: crypto.randomUUID(),
        role: "user",
        content: question,
      };

    setMessages((prev) => [
      ...prev,
      userMessage,
    ]);

    try {
      setLoading(true);

      const aiId =
        crypto.randomUUID();

      setMessages((prev) => [
        ...prev,
        {
          id: aiId,
          role: "assistant",
          content: "",
          confidence: 0,
          sources: [],
        },
      ]);

      await streamBrandBrain(
          question,
          workspace.id,
          (chunk) => {
            setMessages((prev) =>
              prev.map((message) => {
                if (
                  message.id ===
                  aiId
                ) {
                  return {
                    ...message,
                    content:
                      message.content +
                      chunk,
                  };
                }

                return message;
              }),
            );
          },
        );
    } catch (error) {
      console.error(error);

      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content:
            "Something went wrong while talking to Brand Brain.",
          confidence: 0,
          sources: [],
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl p-8">
      <h1 className="mb-6 text-4xl font-bold">
        Brand Brain
      </h1>

      <div className="mb-6 flex h-[500px] flex-col gap-4 overflow-y-auto rounded-xl border p-6">
        {messages.length ===
        0 ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <h2 className="mb-2 text-2xl font-bold">
                Brand Brain
              </h2>
              <p className="text-gray-500">
                Ask questions about your
                uploaded documents.
              </p>
              <p className="mt-4 text-sm text-gray-400">
                Examples:
              </p>
              <ul className="mt-2 text-sm text-gray-400">
                <li>
                  • What is our mission?
                </li>
                <li>
                  • What tone should we use?
                </li>
                <li>
                  • Summarize our brand guidelines.
                </li>
              </ul>
            </div>
          </div>
        ) : (
          messages.map(
            (message) => (
              <ChatMessage
                key={message.id}
                message={message}
              />
            ),
          )
        )}

        {loading && (
          <div className="flex justify-start">
            <div className="rounded-xl border bg-white p-4">
              <div className="animate-pulse">
                Brand Brain is typing...
              </div>
            </div>
          </div>
        )}
      </div>

      <ChatInput
        onSend={handleSend}
        loading={loading}
      />

      <div ref={messagesEndRef} />
    </div>
  );
}