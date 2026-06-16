import {
  CalculatorResults,
  CalculatorValues,
} from "./types";

export function calculateResults(
  values: CalculatorValues
): CalculatorResults {
  const costs =
    values.itemCost +
    values.shippingCost +
    values.miscCost;

  const feePercent =
    (values.ebayFeePercent +
      values.paymentFeePercent +
      values.promotedListingPercent) /
    100;

  let requiredSalePrice = 0;

  if (
    values.goalType ===
    "profit"
  ) {
    requiredSalePrice =
      (
        costs +
        values.desiredValue +
        values.fixedFee
      ) /
      (1 - feePercent);
  }

  if (
    values.goalType === "roi"
  ) {
    const desiredProfit =
      costs *
      (values.desiredValue /
        100);

    requiredSalePrice =
      (
        costs +
        desiredProfit +
        values.fixedFee
      ) /
      (1 - feePercent);
  }

  if (
    values.goalType ===
    "margin"
  ) {
    const margin =
      values.desiredValue /
      100;

    requiredSalePrice =
      (
        costs +
        values.fixedFee
      ) /
      (1 -
        feePercent -
        margin);
  }

  const ebayFee =
    requiredSalePrice *
    (values.ebayFeePercent /
      100);

  const paymentFee =
    requiredSalePrice *
      (values.paymentFeePercent /
        100) +
    values.fixedFee;

  const promotedFee =
    requiredSalePrice *
    (values.promotedListingPercent /
      100);

  const totalFees =
    ebayFee +
    paymentFee +
    promotedFee;

  const profit =
    requiredSalePrice -
    costs -
    totalFees;

  const roi =
    costs > 0
      ? (profit / costs) *
        100
      : 0;

  const margin =
    requiredSalePrice > 0
      ? (profit /
          requiredSalePrice) *
        100
      : 0;

  return {
    requiredSalePrice,
    profit,
    roi,
    margin,
    totalCosts: costs,
    totalFees,
  };
}