import CategoryCard from "@/components/CategoryCard";
import type { Metadata } from "next";

import {
  Combine,
  Scissors,
  PenSquare,
  RotateCw,
  FileImage,
  Images,
} from "lucide-react";

export const metadata: Metadata = {
  title: "PDF Tools",
  description:
    "Free PDF tools including Merge PDF, Split PDF, Rotate PDF, JPG to PDF, PDF to JPG and Sign PDF.",
};

export default function PDFToolsPage() {
  return (
    <main className="max-w-6xl mx-auto px-6 py-20">
      <h1 className="text-3xl md:text-5xl font-bold mb-8">PDF Tools</h1>

      <p className="mt-4 text-gray-600">
        Free PDF editing, conversion and document management tools.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
        <CategoryCard
          title="Merge PDF"
          description="Combine multiple PDF files into a single document."
          href="/pdf-tools/merge-pdf"
          icon={<Combine size={32} />}
          color="bg-blue-100"
        />

        <CategoryCard
          title="Split PDF"
          description="Divide PDF files into pages or custom ranges."
          href="/pdf-tools/split-pdf"
          icon={<Scissors size={32} />}
          color="bg-indigo-100"
        />

        <CategoryCard
          title="Sign PDF"
          description="Draw or upload your signature and sign PDF documents."
          href="/pdf-tools/sign-pdf"
          icon={<PenSquare size={32} />}
          color="bg-emerald-100"
        />

        <CategoryCard
          title="Rotate PDF"
          description="Rotate PDF pages to the correct orientation."
          href="/pdf-tools/rotate-pdf"
          icon={<RotateCw size={32} />}
          color="bg-orange-100"
        />

        <CategoryCard
          title="PDF to JPG"
          description="Convert PDF pages into high-quality JPG images."
          href="/pdf-tools/pdf-to-jpg"
          icon={<FileImage size={32} />}
          color="bg-purple-100"
        />

        <CategoryCard
          title="JPG to PDF"
          description="Convert JPG, PNG, WEBP and other images into PDF files."
          href="/pdf-tools/jpg-to-pdf"
          icon={<Images size={32} />}
          color="bg-pink-100"
        />
      </div>
    </main>
  );
}
