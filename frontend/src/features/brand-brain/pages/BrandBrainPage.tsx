import {
  useEffect,
  useRef,
  useState,
} from "react";

import { useWorkspace } from "@/features/workspace/context";

import {
  askBrandBrain,
  getBrandHistory,
} from "../services/brandBrainService";

import ChatInput from "../components/ChatInput";

import ChatMessage from "../components/ChatMessage";


export default function BrandBrainPage() {

  const { workspace } =
    useWorkspace();

  const messagesEndRef =
    useRef<HTMLDivElement>(null);

  const [messages, setMessages] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(false);


  useEffect(() => {

    if (!workspace) {
      return;
    }

    getBrandHistory(
      workspace.id,
    ).then(
      setMessages,
    );

  }, [workspace]);


  useEffect(() => {

    messagesEndRef.current
      ?.scrollIntoView({
        behavior: "smooth",
      });

  }, [messages]);


  async function handleSend(
    question: string,
  ) {

    if (!workspace) {
      return;
    }

    setLoading(true);

    try {

      await askBrandBrain(
        workspace.id,
        question,
      );

      const history =
        await getBrandHistory(
          workspace.id,
        );

      setMessages(history);

    } catch (error) {

      console.error(error);

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

        {messages.map(
          (message) => (
            <ChatMessage
              key={message.id}
              message={{
                id: message.id,
                role: message.role,
                content: message.message,
                confidence: 100,
                sources: [],
              }}
            />
          ),
        )}

        {loading && (

          <div className="animate-pulse">
            Brand Brain is thinking...
          </div>

        )}

        <div ref={messagesEndRef} />

      </div>

      <ChatInput
        onSend={handleSend}
        loading={loading}
      />

    </div>
  );
}