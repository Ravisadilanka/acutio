import GoalSelector from "./GoalSelector";
import NumberInput from "./NumberInput";

import {
  CalculatorValues,
  GoalType,
} from "../types";

interface Props {
  values: CalculatorValues;

  onChange: <
    K extends keyof CalculatorValues,
  >(
    key: K,
    value: CalculatorValues[K]
  ) => void;
}

export default function CalculatorForm({
  values,
  onChange,
}: Props) {
  return (
    <div className="border rounded-2xl p-6">
      <h2 className="text-xl font-bold mb-6">
        Calculator
      </h2>

      <div className="space-y-5">
        <GoalSelector
          value={values.goalType}
          onChange={(value) =>
            onChange(
              "goalType",
              value as GoalType
            )
          }
        />

        <NumberInput
          label={
            values.goalType ===
            "profit"
              ? "Desired Profit ($)"
              : values.goalType ===
                  "roi"
                ? "Desired ROI (%)"
                : "Desired Margin (%)"
          }
          value={
            values.desiredValue
          }
          onChange={(value) =>
            onChange(
              "desiredValue",
              value
            )
          }
        />

        <hr />

        <NumberInput
          label="Item Cost"
          value={values.itemCost}
          onChange={(value) =>
            onChange(
              "itemCost",
              value
            )
          }
        />

        <NumberInput
          label="Shipping Cost"
          value={
            values.shippingCost
          }
          onChange={(value) =>
            onChange(
              "shippingCost",
              value
            )
          }
        />

        <NumberInput
          label="Misc Cost"
          value={values.miscCost}
          onChange={(value) =>
            onChange(
              "miscCost",
              value
            )
          }
        />

        <hr />

        <NumberInput
          label="eBay Fee (%)"
          value={
            values.ebayFeePercent
          }
          onChange={(value) =>
            onChange(
              "ebayFeePercent",
              value
            )
          }
        />

        <NumberInput
          label="Payment Fee (%)"
          value={
            values.paymentFeePercent
          }
          onChange={(value) =>
            onChange(
              "paymentFeePercent",
              value
            )
          }
        />

        <NumberInput
          label="Fixed Fee"
          value={values.fixedFee}
          onChange={(value) =>
            onChange(
              "fixedFee",
              value
            )
          }
        />

        <NumberInput
          label="Promoted Listing (%)"
          value={
            values.promotedListingPercent
          }
          onChange={(value) =>
            onChange(
              "promotedListingPercent",
              value
            )
          }
        />
      </div>
    </div>
  );
}