interface Props {
  logs: string[];
}

export default function AgentTimeline({
  logs,
}: Props) {

  return (
    <div className="rounded-xl border p-4">

      <h2 className="mb-4 text-xl font-bold">
        Agent Execution
      </h2>

      <div className="space-y-2">

        {logs.length === 0 ? (
          <p className="text-gray-500">
            No execution yet.
          </p>
        ) : (
          logs.map(
            (log, index) => (
              <div
                key={index}
                className="rounded-lg bg-gray-100 p-2"
              >
                ✓ {log}
              </div>
            ),
          )
        )}

      </div>

    </div>
  );
}