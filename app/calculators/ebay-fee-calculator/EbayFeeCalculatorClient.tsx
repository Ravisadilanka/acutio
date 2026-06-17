"use client";

import { useEffect, useMemo, useState } from "react";

import CalculatorForm from "./components/CalculatorForm";
import CalculatorResults from "./components/CalculatorResults";

import { CalculatorValues } from "./types";
import { calculateResults } from "./calculate";
import ToolSEO from "@/components/ToolSEO";
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
  const [values, setValues] =
    useState<CalculatorValues>(() => {
      if (typeof window === "undefined") {
        return defaultValues;
      }

      try {
        const saved =
          localStorage.getItem(
            STORAGE_KEY
          );

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
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(values)
      );
    } catch (error) {
      console.error(error);
    }
  }, [values]);

  const results = useMemo(
    () =>
      calculateResults(
        values
      ),
    [values]
  );

  const updateValue = <
    K extends keyof CalculatorValues,
  >(
    key: K,
    value: CalculatorValues[K]
  ) => {
    setValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const reset = () => {
    try {
      localStorage.removeItem(
        STORAGE_KEY
      );
    } catch (error) {
      console.error(error);
    }

    setValues(defaultValues);
  };

  return (
    <main className="max-w-6xl mx-auto px-6 py-16">
      <div className="text-center">
        <h1 className="text-3xl md:text-5xl font-bold mb-4">
          eBay Profit Calculator
        </h1>

        <p className="mt-4 text-gray-500">
          Calculate the selling
          price required to reach
          your target profit,
          ROI or margin.
        </p>
      </div>

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
        <CalculatorForm
          values={values}
          onChange={
            updateValue
          }
        />

        <CalculatorResults
          results={results}
        />
      </div>

      <ToolSEO
        title="eBay Profit Calculator"
        description="Calculate the selling price needed to reach a target profit, ROI or margin after fees."
        steps={[
          "Select your goal type",
          "Enter costs",
          "Enter fee percentages",
          "View the required sale price",
        ]}
        features={[
          "ROI calculations",
          "Profit calculations",
          "Margin calculations",
          "Local save support",
          "Mobile friendly",
        ]}
        faqs={faqs}
      />

    </main>
  );
}