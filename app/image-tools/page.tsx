import type { Metadata } from "next";
import CategoryCard from "@/components/CategoryCard";

import { ImageIcon, Minimize2, RefreshCw, Crop } from "lucide-react";

export const metadata: Metadata = {
  title: "Image Tools",
  description:
    "Free image tools including image compression, resizing, conversion and cropping. Fast, secure and easy to use directly in your browser.",
};

export default function ImageToolsPage() {
  return (
    <main className="max-w-6xl mx-auto px-6 py-20">
      <h1 className="text-3xl md:text-5xl font-bold mb-8">Image Tools</h1>

      <p className="mt-4 text-gray-600">
        Free image editing, conversion and optimization tools.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
        <CategoryCard
          title="Compress Image"
          description="Reduce JPG, PNG and WEBP image file sizes."
          href="/image-tools/compress-image"
          icon={<Minimize2 size={32} />}
          color="bg-blue-100"
        />

        <CategoryCard
          title="Resize Image"
          description="Resize images to custom dimensions."
          href="/image-tools/resize-image"
          icon={<ImageIcon size={32} />}
          color="bg-emerald-100"
        />

        <CategoryCard
          title="Image Converter"
          description="Convert JPG, PNG and WEBP images."
          href="/image-tools/image-converter"
          icon={<RefreshCw size={32} />}
          color="bg-purple-100"
        />

        <CategoryCard
          title="Crop Image"
          description="Crop images online with custom dimensions."
          href="/image-tools/crop-image"
          icon={<Crop size={32} />}
          color="bg-orange-100"
        />
      </div>
    </main>
  );
}
