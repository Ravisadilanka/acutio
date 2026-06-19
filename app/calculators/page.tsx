import type { Metadata } from "next";
import CategoryCard from "@/components/CategoryCard";

import { Calculator, TrendingUp, Percent, Keyboard } from "lucide-react";

export const metadata: Metadata = {
  title: "Free Online Calculators",
  description:
    "Free online calculators for fees, finance, business, profit, ROI, percentages and everyday calculations. Fast, accurate and easy to use.",

  keywords: [
    "online calculators",
    "free calculators",
    "business calculators",
    "finance calculators",
    "ebay calculator",
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
      <h1 className="text-3xl md:text-5xl font-bold mb-8">Calculators</h1>

      <p className="mt-4 text-gray-600">
        Free online calculators for profit, ROI, fees, finance, business and
        everyday use.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
        <CategoryCard
          title="eBay Profit Calculator"
          description="Calculate selling price, profit, ROI and margins after eBay fees."
          href="/calculators/ebay-fee-calculator"
          icon={<TrendingUp size={32} />}
          color="bg-emerald-100"
        />

        {/* Future calculators */}

        <CategoryCard
          title="ROI Calculator"
          description="Calculate return on investment and profitability."
          href="#"
          icon={<Percent size={32} />}
          color="bg-blue-100"
        />

        <CategoryCard
          title="Business Calculators"
          description="Finance, profit and business planning calculators."
          href="#"
          icon={<Calculator size={32} />}
          color="bg-purple-100"
        />

        <CategoryCard
          title="Typing Speed Test"
          description="Measure typing speed, WPM, accuracy and keyboard performance."
          href="/calculators/typing-speed-test"
          icon={<Keyboard size={32} />}
          color="bg-blue-100"
        />
      </div>
    </main>
  );
}
