import Link from "next/link";

export default function PDFToolsPage() {
  return (
    <main className="max-w-6xl mx-auto px-6 py-20">

      <h1 className="text-5xl font-bold">
        PDF Tools
      </h1>

      <p className="mt-4 text-gray-600">
        Free PDF editing and conversion tools.
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">

        <Link href="/pdf-tools/merge-pdf">
          <div className="border rounded-2xl p-6">
            Merge PDF
          </div>
        </Link>

        <Link href="/pdf-tools/split-pdf">
          <div className="border rounded-2xl p-6">
            Split PDF
          </div>
        </Link>

        <Link href="/pdf-tools/compress-pdf">
          <div className="border rounded-2xl p-6">
            Compress PDF
          </div>
        </Link>

        <Link href="/pdf-tools/pdf-to-jpg">
          <div className="border rounded-2xl p-6">
            PDF to JPG
          </div>
        </Link>

        <div className="border rounded-2xl p-6">
          JPG to PDF
        </div>

        <div className="border rounded-2xl p-6">
          Rotate PDF
        </div>

      </div>

    </main>
  );
}