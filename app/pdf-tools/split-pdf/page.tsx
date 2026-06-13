"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import PdfFileCard from "@/components/PdfFileCard";
import FileDropzone from "@/components/FileDropzone";
import { toast } from "sonner";

type SplitMode = "all" | "ranges" | "extract";

export default function SplitPdfPage() {
  const [file, setFile] = useState<File | null>(null);

  const [pageCount, setPageCount] = useState(0);

  const [loading, setLoading] = useState(false);

  const [progress, setProgress] = useState(0);

  const [mode, setMode] = useState<SplitMode>("all");

  const [input, setInput] = useState("");

  const handleFiles = async (files: File[]) => {
    const pdfFile = files[0];

    if (!pdfFile) return;

    const bytes = await pdfFile.arrayBuffer();

    const pdf = await PDFDocument.load(bytes);

    setPageCount(pdf.getPageCount());
    setFile(pdfFile);
  };

  const downloadPdf = async (pdfDoc: PDFDocument, filename: string) => {
    const bytes = await pdfDoc.save();

    const blob = new Blob([new Uint8Array(bytes)], {
      type: "application/pdf",
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;
    a.download = filename;
    a.click();

    URL.revokeObjectURL(url);
  };

  const splitPdf = async () => {
    if (!file) return;

    try {
      setLoading(true);
      setProgress(0);

      const bytes = await file.arrayBuffer();

      const pdf = await PDFDocument.load(bytes);

      const totalPages = pdf.getPageCount();

      if (mode === "all") {
        for (let i = 0; i < totalPages; i++) {
          const newPdf = await PDFDocument.create();

          const [page] = await newPdf.copyPages(pdf, [i]);

          newPdf.addPage(page);

          await downloadPdf(newPdf, `page-${i + 1}.pdf`);

          setProgress(Math.round(((i + 1) / totalPages) * 100));
        }
      }

      if (mode === "extract") {
        const pages = input
          .split(",")
          .map((p) => parseInt(p.trim()))
          .filter((p) => !isNaN(p) && p >= 1 && p <= totalPages);

        if (!pages.length) {
          toast.error("Enter valid page numbers");
          return;
        }

        const newPdf = await PDFDocument.create();

        const copied = await newPdf.copyPages(
          pdf,
          pages.map((p) => p - 1),
        );

        copied.forEach((page) => newPdf.addPage(page));

        await downloadPdf(newPdf, "selected-pages.pdf");

        setProgress(100);
      }

      if (mode === "ranges") {
        const ranges = input.split(",");

        for (let i = 0; i < ranges.length; i++) {
          const range = ranges[i].trim();

          const [start, end] = range.split("-").map(Number);

          if (!start || !end || start > end) continue;

          const indexes = [];

          for (let p = start; p <= end; p++) {
            indexes.push(p - 1);
          }

          const newPdf = await PDFDocument.create();

          const copied = await newPdf.copyPages(pdf, indexes);

          copied.forEach((page) => newPdf.addPage(page));

          await downloadPdf(newPdf, `part-${i + 1}.pdf`);

          setProgress(Math.round(((i + 1) / ranges.length) * 100));
        }
      }
    } catch (error) {
      console.error(error);

      toast.error("Failed to split PDF");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-5xl mx-auto px-6 py-16">
      <div className="text-center">
        <h1 className="text-5xl font-bold">Split PDF</h1>

        <p className="mt-4 text-gray-500">
          Split PDF pages exactly how you want.
        </p>
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
        <div className="mt-8 bg-white border rounded-2xl p-6">
          <PdfFileCard
            file={file}
            pages={pageCount}
            onRemove={() => {
              setFile(null);
              setPageCount(0);
            }}
          />

          <div className="mt-6 space-y-3">
            <label className="flex gap-2">
              <input
                type="radio"
                checked={mode === "all"}
                onChange={() => setMode("all")}
              />
              Split every page
            </label>

            <label className="flex gap-2">
              <input
                type="radio"
                checked={mode === "ranges"}
                onChange={() => setMode("ranges")}
              />
              Custom ranges
            </label>

            <label className="flex gap-2">
              <input
                type="radio"
                checked={mode === "extract"}
                onChange={() => setMode("extract")}
              />
              Extract pages
            </label>
          </div>

          {mode === "ranges" && (
            <input
              type="text"
              placeholder="1-5,6-10,11-15"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="
                mt-4
                w-full
                border
                rounded-xl
                p-3
              "
            />
          )}

          {mode === "extract" && (
            <input
              type="text"
              placeholder="1,3,7,10"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="
                mt-4
                w-full
                border
                rounded-xl
                p-3
              "
            />
          )}

          {loading && (
            <div className="mt-6">
              <div className="flex justify-between mb-2">
                <span>Processing...</span>

                <span>{progress}%</span>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="
                    bg-black
                    h-3
                    rounded-full
                  "
                  style={{
                    width: `${progress}%`,
                  }}
                />
              </div>
            </div>
          )}

          <button
            onClick={splitPdf}
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
            {loading ? "Processing..." : "Split PDF"}
          </button>
        </div>
      )}
    </main>
  );
}
