import { Metadata } from "next";
import EbayFeeCalculatorClient from "./EbayFeeCalculatorClient";

export const metadata: Metadata = {
  title:
    "eBay Profit Calculator | Calculate eBay Fees, ROI & Margin",

  description:
    "Free eBay profit calculator. Calculate selling price, eBay fees, PayPal fees, profit, ROI and profit margin. Find the exact selling price needed to achieve your target profit.",

  keywords: [
    "ebay profit calculator",
    "ebay fee calculator",
    "ebay fees calculator",
    "ebay selling fees",
    "ebay roi calculator",
    "ebay margin calculator",
    "ebay seller calculator",
    "ebay profit margin",
    "ebay selling price calculator",
    "ebay business calculator",
    "online ebay calculator",
    "free ebay calculator",
  ],

  alternates: {
    canonical:
      "https://acutio.com/calculators/ebay-fee-calculator",
  },

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    title:
      "eBay Profit Calculator | Calculate eBay Fees, ROI & Margin",

    description:
      "Calculate eBay fees, profit, ROI and profit margin. Find the selling price required to achieve your target profit.",

    url:
      "https://acutio.com/calculators/ebay-fee-calculator",

    siteName: "Acutio",

    type: "website",
  },

  twitter: {
    card: "summary",

    title:
      "eBay Profit Calculator | Calculate eBay Fees, ROI & Margin",

    description:
      "Free eBay calculator for fees, profit, ROI and margin calculations.",
  },
};


export default function EbayFeeCalculatorPage() {
    return <EbayFeeCalculatorClient />
}