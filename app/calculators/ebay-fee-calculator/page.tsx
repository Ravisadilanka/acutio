import { Metadata } from "next";
import EbayFeeCalculatorClient from "./EbayFeeCalculatorClient";

export const metadata: Metadata = {
  title:
    "eBay Profit Calculator",

  description:
    "Calculate the selling price needed to achieve a target profit, ROI or margin after eBay fees.",
};


export default function EbayFeeCalculatorPage() {
    return <EbayFeeCalculatorClient />
}