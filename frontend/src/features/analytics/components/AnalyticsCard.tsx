interface Props {
  title: string;
  value: number;
}

export default function AnalyticsCard({
  title,
  value,
}: Props) {
  return (
    <div className="rounded-xl border p-6 shadow-sm">
      <h3 className="text-sm text-gray-500">
        {title}
      </h3>

      <p className="mt-2 text-4xl font-bold">
        {value}
      </p>
    </div>
  );
}