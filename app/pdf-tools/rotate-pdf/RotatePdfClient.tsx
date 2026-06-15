"use client";

import { useState } from "react";
import { PDFDocument, degrees } from "pdf-lib";
import PdfFileCard from "@/components/PdfFileCard";
import FileDropzone from "@/components/FileDropzone";
import { toast } from "sonner";
import ToolSEO from "@/components/ToolSEO";

export default function RotatePdfPage() {
  const [file, setFile] = useState<File | null>(null);

  const [pageCount, setPageCount] = useState(0);

  const [rotation, setRotation] = useState(90);

  const [loading, setLoading] = useState(false);

  const [progress, setProgress] = useState(0);

  const handleFiles = async (files: File[]) => {
    const pdfFile = files[0];

    if (!pdfFile) return;

    const bytes = await pdfFile.arrayBuffer();

    const pdf = await PDFDocument.load(bytes);

    setPageCount(pdf.getPageCount());
    setFile(pdfFile);
  };

  const rotatePdf = async () => {
    if (!file) return;

    try {
      setLoading(true);
      setProgress(0);

      const bytes = await file.arrayBuffer();

      const pdf = await PDFDocument.load(bytes);

      const pages = pdf.getPages();

      for (let i = 0; i < pages.length; i++) {
        pages[i].setRotation(degrees(rotation));

        setProgress(Math.round(((i + 1) / pages.length) * 100));
      }

      const pdfBytes = await pdf.save();

      const blob = new Blob([new Uint8Array(pdfBytes)], {
        type: "application/pdf",
      });

      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");

      a.href = url;
      a.download = "rotated-pdf.pdf";

      a.click();

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      toast.error("Failed to rotate PDF");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-5xl mx-auto px-6 py-16">
      <div className="text-center">
        <h1 className="text-5xl font-bold">Rotate PDF</h1>

        <p className="mt-4 text-gray-500">Rotate pages in a PDF file.</p>
      </div>

      <div className="mt-10">
        <FileDropzone
          onFilesAdded={handleFiles}
          title="Select PDF File"
          subtitle="Upload a PDF to rotate"
          accept={{
            "application/pdf": [".pdf"],
          }}
        />
      </div>

      {file && (
        <div className="mt-8 space-y-6">
          <PdfFileCard
            file={file}
            pages={pageCount}
            onRemove={() => {
              setFile(null);
              setPageCount(0);
            }}
          />

          <div className="bg-white border rounded-2xl p-6">
            <h2 className="font-semibold mb-4">Rotation</h2>

            <div className="flex flex-wrap gap-3">
              {[90, 180, 270].map((angle) => (
                <button
                  key={angle}
                  onClick={() => setRotation(angle)}
                  className={`px-5 py-3 rounded-xl border ${
                    rotation === angle ? "bg-black text-white" : "bg-white"
                  }`}
                >
                  {angle}°
                </button>
              ))}
            </div>

            {loading && (
              <div className="mt-6">
                <div className="flex justify-between mb-2">
                  <span>Processing...</span>

                  <span>{progress}%</span>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-black h-3 rounded-full"
                    style={{
                      width: `${progress}%`,
                    }}
                  />
                </div>
              </div>
            )}

            <button
              onClick={rotatePdf}
              disabled={loading}
              className="
                mt-6
                bg-black
                text-white
                px-8
                py-4
                rounded-xl
              "
            >
              {loading ? "Rotating..." : `Rotate ${rotation}°`}
            </button>
          </div>
        </div>
      )}
      <ToolSEO
        title="Rotate PDF Online Free"
        description="Rotate PDF pages by 90, 180, or 270 degrees. Fix incorrectly oriented PDF pages quickly and securely."
        steps={[
          "Upload a PDF file",
          "Choose the rotation angle",
          "Click Rotate PDF",
          "Download the rotated PDF",
        ]}
        features={[
          "Rotate all pages",
          "Multiple angle options",
          "Fast browser processing",
          "No software installation",
        ]}
        faqs={[
          {
            question: "Can I rotate PDF pages online?",
            answer:
              "Yes. Upload your file and choose the desired rotation angle.",
          },
          {
            question: "Does rotating affect quality?",
            answer: "No. The PDF content remains unchanged.",
          },
          {
            question: "Is this tool free?",
            answer: "Yes. Acutio Rotate PDF is free to use.",
          },
        ]}
      />
    </main>
  );
}
