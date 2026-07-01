import {
  CheckCircle2,
  Circle,
  Loader2,
  XCircle,
} from "lucide-react";

const stages = [
  "research",
  "planner",
  "seo",
  "writer",
  "editor",
  "approval",
];

interface Props {
  logs: string[];
  running?: boolean;
  failed?: boolean;
}

export default function AgentTimeline({
  logs,
  running = false,
  failed = false,
}: Props) {
  const completed =
    new Set(
      logs.map((log) =>
        log.split(":")[0],
      ),
    );

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">

      <h2 className="mb-4 text-lg font-semibold text-slate-950">
        Agent Execution
      </h2>

      <div className="space-y-3">
        {stages.map((stage) => {
          const isDone =
            completed.has(stage);

          const isActive =
            running &&
            !isDone &&
            stages.find(
              (item) =>
                !completed.has(item),
            ) === stage;

          const Icon =
            failed && isActive
              ? XCircle
              : isDone
                ? CheckCircle2
                : isActive
                  ? Loader2
                  : Circle;

          return (
            <div
              key={stage}
              className="flex items-center gap-3 rounded-md border border-slate-100 bg-slate-50 px-3 py-2"
            >
              <Icon
                className={[
                  "size-4",
                  isDone
                    ? "text-emerald-600"
                    : isActive
                      ? "animate-spin text-sky-600"
                      : "text-slate-300",
                ].join(" ")}
              />
              <span className="text-sm font-medium capitalize text-slate-700">
                {stage}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-5 space-y-2">

        {logs.length === 0 ? (
          <p className="text-sm text-slate-500">
            No execution yet.
          </p>
        ) : (
          logs.map(
            (log, index) => (
              <div
                key={index}
                className="rounded-md bg-slate-100 px-3 py-2 text-sm text-slate-600"
              >
                {log}
              </div>
            ),
          )
        )}

      </div>

    </div>
  );
}
