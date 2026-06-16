import type { Metadata } from "next";
import CategoryCard from "@/components/CategoryCard";

export const metadata: Metadata = {
  title: "Free Online Calculators",
  description:
    "Free online calculators for fees, finance, business, profit, ROI, percentages and everyday calculations. Fast, accurate and easy to use.",

  keywords: [
    "online calculators",
    "free calculators",
    "business calculators",
    "finance calculators",
    "ebay fee calculator",
    "profit calculator",
    "ROI calculator",
    "percentage calculator",
  ],

  openGraph: {
    title: "Free Online Calculators | Acutio",
    description:
      "Free online calculators for fees, finance, business, profit and everyday use.",
    url: "https://acutio.com/calculators",
    siteName: "Acutio",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Free Online Calculators | Acutio",
    description:
      "Free online calculators for fees, finance, business, profit and everyday use.",
  },
};

export default function CalculatorsPage() {
  return (
    <main className="max-w-6xl mx-auto px-6 py-20">
      <h1 className="text-3xl md:text-5xl font-bold">
        Calculators
      </h1>

      <p className="mt-4 text-gray-600">
        Free online calculators for fees,
        finance, business and everyday use.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
        <CategoryCard
          title="eBay Fee Calculator"
          description="Calculate eBay fees, profit and margins."
          href="/calculators/ebay-fee-calculator"
        />
      </div>
    </main>
  );
}