interface Props {
  title: string;
  value: number;
}

export default function AnalyticsCard({
  title,
  value,
}: Props) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 text-left shadow-sm">
      <h3 className="text-sm font-medium text-slate-500">
        {title}
      </h3>

      <p className="mt-2 text-3xl font-bold text-slate-950">
        {Number(value).toFixed(
          Number.isInteger(value) ? 0 : 1,
        )}
      </p>
    </div>
  );
}
