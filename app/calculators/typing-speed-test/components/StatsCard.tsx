interface Props {
  label: string;
  value:
    | string
    | number;
}

export default function StatsCard({
  label,
  value,
}: Props) {
  return (
    <div className="border rounded-2xl p-6">
      <p className="text-gray-500">
        {label}
      </p>

      <p className="text-3xl font-bold mt-2">
        {value}
      </p>
    </div>
  );
}