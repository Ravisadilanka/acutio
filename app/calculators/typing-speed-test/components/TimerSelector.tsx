interface Props {
  value: number;
  onChange: (
    value: number
  ) => void;
}

export default function TimerSelector({
  value,
  onChange,
}: Props) {
  return (
    <div className="flex gap-3">
      {[60, 120, 300].map(
        (time) => (
          <button
            key={time}
            onClick={() =>
              onChange(time)
            }
            className={`px-5 py-3 rounded-xl border ${
              value === time
                ? "bg-black text-white"
                : ""
            }`}
          >
            {time / 60}m
          </button>
        )
      )}
    </div>
  );
}