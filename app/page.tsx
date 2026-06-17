import Hero from "@/components/Hero";
import CategoryCard from "@/components/CategoryCard";

import {
  FileText,
  ImageIcon,
  Calculator,
  RefreshCw,
  Sparkles,
} from "lucide-react";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Online Tools",
  description:
    "Free online tools for PDF editing, file conversion, productivity, calculators and more. Fast, secure and easy to use.",
};

export default function Home() {
  return (
    <main>
      <Hero />

      <section className="max-w-6xl mx-auto px-6 pb-20">
        <h2 className="text-3xl font-bold mb-10">
          Categories
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CategoryCard
            title="PDF Tools"
            description="Merge, split, compress and edit PDF files."
            href="/pdf-tools"
            icon={<FileText size={32} />}
            color="bg-blue-100"
          />

          <CategoryCard
            title="Image Tools"
            description="Convert, resize and optimize images."
            href="/image-tools"
            icon={<ImageIcon size={32} />}
            color="bg-orange-100"
          />

          <CategoryCard
            title="Calculators"
            description="eBay, PayPal, ROI, profit margin and business calculators."
            href="/calculators"
            icon={<Calculator size={32} />}
            color="bg-emerald-100"
          />

          <CategoryCard
            title="Converters"
            description="Unit, file and measurement conversion tools."
            href="/converters"
            icon={<RefreshCw size={32} />}
            color="bg-purple-100"
          />

          <CategoryCard
            title="AI Tools"
            description="AI-powered productivity and content tools."
            href="/ai-tools"
            icon={<Sparkles size={32} />}
            color="bg-pink-100"
          />
        </div>
      </section>
    </main>
  );
}