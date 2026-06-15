"use client";

import { useState } from "react";
import { toast } from "sonner";
import FileDropzone from "@/components/FileDropzone";
import PdfFileCard from "@/components/PdfFileCard";
import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc =
  "/pdf.worker.min.mjs";

export default function PdfToJpgPage() {
  const [file, setFile] =
    useState<File | null>(null);

  const [pageCount, setPageCount] =
    useState(0);

  const [loading, setLoading] =
    useState(false);

  const [progress, setProgress] =
    useState(0);

  const handleFiles = async (
    files: File[]
  ) => {
    const pdfFile = files[0];

    if (!pdfFile) return;

    try {
      const bytes =
        await pdfFile.arrayBuffer();

      const pdf =
        await pdfjsLib.getDocument({
          data: bytes,
        }).promise;

      setPageCount(pdf.numPages);
      setFile(pdfFile);
    } catch (error) {
  console.error("PDF to JPG Error:", error);

  toast.error(
    error instanceof Error
      ? error.message
      : JSON.stringify(error)
  );
}
  };

  const convertToJpg = async () => {
    if (!file) return;

    try {
      setLoading(true);
      setProgress(0);

      const loadingToast =
        toast.loading(
          "Converting PDF..."
        );

      const bytes =
        await file.arrayBuffer();

      const pdf =
        await pdfjsLib.getDocument({
          data: bytes,
        }).promise;

      for (
        let pageNum = 1;
        pageNum <= pdf.numPages;
        pageNum++
      ) {
        const page =
          await pdf.getPage(
            pageNum
          );

        const viewport =
          page.getViewport({
            scale: 2,
          });

        const canvas =
          document.createElement(
            "canvas"
          );

        const context =
          canvas.getContext(
            "2d"
          );

        if (!context) {
          throw new Error(
            "Canvas error"
          );
        }

        canvas.width =
          viewport.width;

        canvas.height =
          viewport.height;

        await page.render({
  canvasContext: context,
  viewport,
}).promise;

        const blob =
          await new Promise<Blob>(
            (resolve) => {
              canvas.toBlob(
                (
                  blob
                ) =>
                  resolve(
                    blob!
                  ),
                "image/jpeg",
                0.95
              );
            }
          );

        const url =
          URL.createObjectURL(
            blob
          );

        const a =
          document.createElement(
            "a"
          );

        a.href = url;

        a.download =
          `page-${pageNum}.jpg`;

        a.click();

        URL.revokeObjectURL(
          url
        );

        setProgress(
          Math.round(
            (pageNum /
              pdf.numPages) *
              100
          )
        );
      }

      toast.success(
        "Conversion completed",
        {
          id: loadingToast,
        }
      );
    } catch (error) {
      console.error(error);

      toast.error(
        error instanceof
          Error
          ? error.message
          : "Conversion failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-5xl mx-auto px-6 py-16">
      <div className="text-center">
        <h1 className="text-5xl font-bold">
          PDF to JPG
        </h1>

        <p className="mt-4 text-gray-500">
          Convert PDF pages into
          JPG images.
        </p>
      </div>

      <div className="mt-10">
        <FileDropzone
          onFilesAdded={
            handleFiles
          }
          title="Select PDF File"
          subtitle="Upload a PDF to convert"
          accept={{
            "application/pdf":
              [".pdf"],
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

          {loading && (
            <div>
              <div className="flex justify-between mb-2">
                <span>
                  Processing...
                </span>

                <span>
                  {progress}%
                </span>
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
            onClick={
              convertToJpg
            }
            disabled={
              loading
            }
            className="
              bg-black
              text-white
              px-8
              py-4
              rounded-xl
            "
          >
            {loading
              ? "Converting..."
              : "Convert to JPG"}
          </button>
        </div>
      )}
    </main>
  );
}