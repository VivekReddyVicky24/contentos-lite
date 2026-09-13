import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { useWorkspace } from "@/features/workspace/context";

import {
  askBrandBrain,
  getBrandHistory,
} from "../services/brandBrainService";

import ChatInput from "../components/ChatInput";

import ChatMessage from "../components/ChatMessage";

interface BrandBrainMessage {
  id: string;
  role: "user" | "assistant";
  message: string;
}

export default function BrandBrainPage() {

  const {
    workspace,
  } = useWorkspace();

  const queryClient =
    useQueryClient();

  const messagesEndRef =
    useRef<HTMLDivElement>(null);

  const [
    loading,
    setLoading,
  ] = useState(false);

  const {
    data: messages = [],
    isLoading: historyLoading,
    isError: historyError,
  } = useQuery<BrandBrainMessage[]>({
    queryKey: [
      "brand-brain-history",
      workspace?.id,
    ],

    queryFn: async () => {

      const history =
        await getBrandHistory(
          workspace!.id,
        );

      return history || [];
    },

    enabled:
      !!workspace?.id,

    staleTime: 30_000,
  });

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

    try {

      setLoading(true);

      await askBrandBrain(
        workspace.id,
        question,
      );

      await queryClient.invalidateQueries({
        queryKey: [
          "brand-brain-history",
          workspace.id,
        ],
        exact: true,
      });

    } catch (error) {

      console.error(
        "Brand Brain request failed:",
        error,
      );

    } finally {

      setLoading(false);

    }
  }

  if (
    historyLoading &&
    messages.length === 0
  ) {

    return (
      <div className="mx-auto max-w-5xl p-8">

        <h1 className="mb-6 text-4xl font-bold">
          Brand Brain
        </h1>

        <div className="mb-6 flex h-[500px] items-center justify-center rounded-xl border p-6 text-gray-500">
          Loading Brand Brain history...
        </div>

        <ChatInput
          onSend={handleSend}
          loading={loading}
        />

      </div>
    );
  }

  if (
    historyError &&
    messages.length === 0
  ) {

    return (
      <div className="mx-auto max-w-5xl p-8">

        <h1 className="mb-6 text-4xl font-bold">
          Brand Brain
        </h1>

        <div className="mb-6 rounded-xl border border-red-200 p-6 text-red-600">
          Unable to load Brand Brain history.
        </div>

        <ChatInput
          onSend={handleSend}
          loading={loading}
        />

      </div>
    );
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

        <div
          ref={messagesEndRef}
        />

      </div>

      <ChatInput
        onSend={handleSend}
        loading={loading}
      />

    </div>
  );
}
