interface Props {
  draft: Record<
    string,
    unknown
  > | null;
}

export default function DraftPreview({
  draft,
}: Props) {

  if (!draft) {

    return (
      <div className="rounded-xl border p-4">

        <h2 className="mb-4 text-xl font-bold">
          Draft Preview
        </h2>

        <p className="text-gray-500">
          No content generated yet.
        </p>

      </div>
    );
  }

  return (
    <div className="rounded-xl border p-4">

      <h2 className="mb-4 text-xl font-bold">
        Draft Preview
      </h2>

      <pre className="overflow-x-auto whitespace-pre-wrap">
        {JSON.stringify(
          draft,
          null,
          2,
        )}
      </pre>

    </div>
  );
}