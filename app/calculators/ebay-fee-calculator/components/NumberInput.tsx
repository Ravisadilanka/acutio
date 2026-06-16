interface Props {
  label: string;

  value: number;

  onChange: (
    value: number
  ) => void;
}

export default function NumberInput({
  label,
  value,
  onChange,
}: Props) {
  return (
    <div>
      <label className="block mb-2 text-sm font-medium">
        {label}
      </label>

      <input
        type="number"
        value={value}
        step="0.01"
        onChange={(e) =>
          onChange(
            Number(
              e.target.value
            )
          )
        }
        className="
          w-full
          border
          rounded-xl
          px-4
          py-3
        "
      />
    </div>
  );
}