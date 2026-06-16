export type GoalType =
  | "profit"
  | "roi"
  | "margin";

export interface CalculatorValues {
  goalType: GoalType;

  desiredValue: number;

  itemCost: number;

  shippingCost: number;

  miscCost: number;

  ebayFeePercent: number;

  paymentFeePercent: number;

  fixedFee: number;

  promotedListingPercent: number;
}

export interface CalculatorResults {
  requiredSalePrice: number;

  profit: number;

  roi: number;

  margin: number;

  totalCosts: number;

  totalFees: number;
}