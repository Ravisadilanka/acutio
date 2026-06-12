"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

import PdfDropzone from "@/components/PdfDropzone";
import PdfFileCard from "@/components/PdfFileCard";

interface PdfItem {
  file: File;
  pages: number;
}

export default function MergePdfPage() {
  const [files, setFiles] = useState<PdfItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const addFiles = async (newFiles: File[]) => {
    const processed: PdfItem[] = [];

    for (const file of newFiles) {
      try {
        const bytes = await file.arrayBuffer();

        const pdf = await PDFDocument.load(bytes);

        processed.push({
          file,
          pages: pdf.getPageCount(),
        });
      } catch {
        console.error("Invalid PDF:", file.name);
      }
    }

    setFiles((prev) => [...prev, ...processed]);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = [...files];

    const [reordered] = items.splice(result.source.index, 1);

    items.splice(result.destination.index, 0, reordered);

    setFiles(items);
  };

  const mergePdfs = async () => {
    if (files.length < 2) {
      alert("Please upload at least 2 PDFs");
      return;
    }

    try {
      setLoading(true);
      setProgress(0);

      const mergedPdf = await PDFDocument.create();

      for (let i = 0; i < files.length; i++) {
        const file = files[i].file;

        const bytes = await file.arrayBuffer();

        const pdf = await PDFDocument.load(bytes);

        const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());

        pages.forEach((page) => mergedPdf.addPage(page));

        setProgress(Math.round(((i + 1) / files.length) * 100));
      }

      const mergedBytes = await mergedPdf.save();

      const blob = new Blob([new Uint8Array(mergedBytes)], {
        type: "application/pdf",
      });

      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;
      link.download = "merged.pdf";

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);

      alert("Failed to merge PDFs");
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  return (
    <main className="max-w-6xl mx-auto px-6 py-16">
      <div className="text-center mb-10">
        <h1 className="text-5xl font-bold mb-4">Merge PDF</h1>

        <p className="text-gray-500">
          Combine multiple PDF files into one document.
        </p>
      </div>

      <PdfDropzone onFilesAdded={addFiles} />

      {files.length > 0 && (
        <>
          <div className="mt-8 flex justify-between items-center">
            <h2 className="text-2xl font-bold">Files ({files.length})</h2>

            <button
              onClick={() =>
                (
                  document.querySelector(
                    'input[type="file"]',
                  ) as HTMLInputElement | null
                )?.click()
              }
              className="
                bg-gray-100
                hover:bg-gray-200
                px-4
                py-2
                rounded-xl
              "
            >
              + Add More Files
            </button>
          </div>

          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="pdfs">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="mt-6 space-y-4"
                >
                  {files.map((item, index) => (
                    <Draggable
                      key={item.file.name + index}
                      draggableId={item.file.name + index}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <PdfFileCard
                            file={item.file}
                            pages={item.pages}
                            onRemove={() => removeFile(index)}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}

                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

          {loading && (
            <div className="mt-8">
              <div className="flex justify-between mb-2">
                <span>Merging PDFs...</span>

                <span>{progress}%</span>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="
                    bg-black
                    h-3
                    rounded-full
                    transition-all
                  "
                  style={{
                    width: `${progress}%`,
                  }}
                />
              </div>
            </div>
          )}

          <div className="mt-8 grid grid-cols-3 gap-4">
            <div className="border rounded-xl p-4">
              <h3>Total Files</h3>
              <p>{files.length}</p>
            </div>

            <div className="border rounded-xl p-4">
              <h3>Total Pages</h3>
              <p>{files.reduce((sum, file) => sum + file.pages, 0)}</p>
            </div>

            <div className="border rounded-xl p-4">
              <h3>Total Size</h3>
              <p>
                {(
                  files.reduce((sum, file) => sum + file.file.size, 0) /
                  1024 /
                  1024
                ).toFixed(2)}
                MB
              </p>
            </div>
          </div>

          <div className="mt-10 text-center">
            <button
              onClick={mergePdfs}
              disabled={loading}
              className="
                bg-black
                text-white
                px-10
                py-4
                rounded-2xl
                text-lg
                font-semibold
                hover:opacity-90
              "
            >
              {loading ? "Merging..." : `Merge ${files.length} PDFs`}
            </button>
          </div>
        </>
      )}
    </main>
  );
}
