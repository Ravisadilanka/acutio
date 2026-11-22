"use client";

import { useEffect, useMemo, useState } from "react";

import CalculatorForm from "./components/CalculatorForm";
import CalculatorResults from "./components/CalculatorResults";

import { CalculatorValues } from "./types";
import { calculateResults } from "./calculate";
import { faqs } from "./faqs";
const STORAGE_KEY = "ebay-calculator";

const defaultValues: CalculatorValues = {
  goalType: "roi",

  desiredValue: 0,

  itemCost: 0,

  shippingCost: 0,

  miscCost: 0,

  ebayFeePercent: 0,

  paymentFeePercent: 0,

  fixedFee: 0,

  promotedListingPercent: 0,
};

export default function EbayFeeCalculatorPage() {
  const [values, setValues] = useState<CalculatorValues>(() => {
    if (typeof window === "undefined") {
      return defaultValues;
    }

    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error(error);
    }

    return defaultValues;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(values));
    } catch (error) {
      console.error(error);
    }
  }, [values]);

  const results = useMemo(() => calculateResults(values), [values]);

  const updateValue = <K extends keyof CalculatorValues>(
    key: K,
    value: CalculatorValues[K],
  ) => {
    setValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const reset = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error(error);
    }

    setValues(defaultValues);
  };

  return (
    <div>

      <div className="mt-8 flex justify-center">
        <button
          onClick={reset}
          className="
            border
            px-5
            py-3
            rounded-xl
            hover:bg-gray-100
          "
        >
          Reset Calculator
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 mt-10">
        <CalculatorForm values={values} onChange={updateValue} />

        <CalculatorResults results={results} />
      </div>

    </div>
  );
}
