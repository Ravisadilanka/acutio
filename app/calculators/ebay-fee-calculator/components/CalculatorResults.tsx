import {
  CalculatorResults as Result,
} from "../types";

interface Props {
  results: Result;
}

export default function CalculatorResults({
  results,
}: Props) {
  const money = (
    value: number
  ) =>
    value.toLocaleString(
      undefined,
      {
        style: "currency",
        currency: "USD",
      }
    );

  return (
    <div className="border rounded-2xl p-6">
      <h2 className="text-xl font-bold mb-6">
        Results
      </h2>

      <div className="space-y-4">
        <ResultRow
          label="Required Sale Price"
          value={money(
            results.requiredSalePrice
          )}
          highlight
        />

        <hr />

        <ResultRow
          label="Profit"
          value={money(
            results.profit
          )}
        />

        <ResultRow
          label="ROI"
          value={`${results.roi.toFixed(
            2
          )}%`}
        />

        <ResultRow
          label="Margin"
          value={`${results.margin.toFixed(
            2
          )}%`}
        />

        <ResultRow
          label="Total Costs"
          value={money(
            results.totalCosts
          )}
        />

        <ResultRow
          label="Total Fees"
          value={money(
            results.totalFees
          )}
        />
      </div>
    </div>
  );
}

function ResultRow({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex justify-between items-center">
      <span>{label}</span>

      <span
        className={
          highlight
            ? "text-3xl font-bold"
            : "font-semibold"
        }
      >
        {value}
      </span>
    </div>
  );
}