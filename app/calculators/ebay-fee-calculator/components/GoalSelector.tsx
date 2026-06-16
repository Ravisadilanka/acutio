import { GoalType } from "../types";

interface Props {
  value: GoalType;

  onChange: (
    value: GoalType
  ) => void;
}

export default function GoalSelector({
  value,
  onChange,
}: Props) {
  return (
    <div>
      <label className="block font-medium mb-3">
        Goal
      </label>

      <div className="flex gap-4 flex-wrap">
        <label>
          <input
            type="radio"
            checked={
              value ===
              "profit"
            }
            onChange={() =>
              onChange(
                "profit"
              )
            }
          />{" "}
          Profit ($)
        </label>

        <label>
          <input
            type="radio"
            checked={
              value === "roi"
            }
            onChange={() =>
              onChange("roi")
            }
          />{" "}
          ROI (%)
        </label>

        <label>
          <input
            type="radio"
            checked={
              value ===
              "margin"
            }
            onChange={() =>
              onChange(
                "margin"
              )
            }
          />{" "}
          Margin (%)
        </label>
      </div>
    </div>
  );
}