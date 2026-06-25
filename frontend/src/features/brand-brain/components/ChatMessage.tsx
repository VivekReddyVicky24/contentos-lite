import type {
  ChatMessage as Message,
} from "../types/brandBrain";

interface Props {
  message: Message;
}

export default function ChatMessage({
  message,
}: Props) {
  const isUser =
    message.role === "user";

  return (
    <div
      className={`flex ${
        isUser
          ? "justify-end"
          : "justify-start"
      }`}
    >
      <div
        className={`max-w-3xl rounded-xl p-4 ${
          isUser
            ? "bg-blue-600 text-white"
            : "border bg-white"
        }`}
      >
        <p className="whitespace-pre-wrap">
          {message.content}
        </p>

        {!isUser &&
          message.confidence !==
            undefined && (
            <div className="mt-3 text-sm text-gray-500">
              Confidence:{" "}
              {message.confidence}%
            </div>
          )}

        {!isUser &&
          message.sources &&
          message.sources.length >
            0 && (
            <div className="mt-2">
              <p className="text-sm font-semibold">
                Sources:
              </p>

              <ul className="text-xs">
                {[
                  ...new Set(message.sources),
                ].map((source, index) => (
                  <li
                    key={`${source}-${index}`}
                  >
                    • {source}
                  </li>
                ))}
              </ul>
            </div>
          )}
      </div>
    </div>
  );
}