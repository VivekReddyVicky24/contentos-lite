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
      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">

        <h2 className="mb-4 text-lg font-semibold text-slate-950">
          Draft Preview
        </h2>

        <p className="text-sm text-slate-500">
          No content generated yet.
        </p>

      </div>
    );
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 text-left shadow-sm">

      <h2 className="mb-4 text-lg font-semibold text-slate-950">
        Edited Draft
      </h2>

      <pre className="max-h-[520px] overflow-auto whitespace-pre-wrap rounded-md bg-slate-950 p-4 text-sm leading-6 text-slate-100">
        {JSON.stringify(
          draft,
          null,
          2,
        )}
      </pre>

    </div>
  );
}
