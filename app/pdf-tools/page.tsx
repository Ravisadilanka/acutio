import CategoryCard from "@/components/CategoryCard";

export default function PDFToolsPage() {
  return (
    <main className="max-w-6xl mx-auto px-6 py-20">
      <h1 className="text-5xl font-bold">PDF Tools</h1>

      <p className="mt-4 text-gray-600">
        Free PDF editing and conversion tools.
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
        <CategoryCard
          title="Merge PDF"
          description="Combine multiple PDF files into a single document."
          href="/pdf-tools/merge-pdf"
        />

        <CategoryCard
          title="Split PDF"
          description="Divide a PDF file into individual pages or custom ranges."
          href="/pdf-tools/split-pdf"
        />

        <CategoryCard
          title="Sign PDF"
          description="Draw and add your signature to PDF documents."
          href="/pdf-tools/sign-pdf"
        />

        <CategoryCard
          title="Rotate PDF"
          description="Rotate PDF pages to the desired orientation."
          href="/pdf-tools/rotate-pdf"
        />
        
        <CategoryCard
          title="PDF to JPG"
          description="Convert PDF pages to high-quality JPG images."
          href="/pdf-tools/pdf-to-jpg"
        />

        <CategoryCard
          title="JPG to PDF"
          description="Convert JPG images to PDF documents."
          href="/pdf-tools/jpg-to-pdf"
        />

      </div>
    </main>
  );
}
