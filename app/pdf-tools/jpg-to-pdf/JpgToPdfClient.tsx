"use client";

import { useState } from "react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  type DropResult,
} from "@hello-pangea/dnd";
import { PDFDocument } from "pdf-lib";
import FileDropzone from "@/components/FileDropzone";
import Image from "next/image";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import ToolSEO from "@/components/ToolSEO";

interface ImageItem {
  file: File;
  preview: string;
  id: string;
}

export default function JpgToPdfPage() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const addImages = (files: File[]) => {
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      id: crypto.randomUUID(),
    }));

    setImages((prev) => [...prev, ...newImages]);
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const reordered = [...images];

    const [removed] = reordered.splice(result.source.index, 1);

    reordered.splice(result.destination.index, 0, removed);

    setImages(reordered);
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const convertToPdf = async () => {
    if (!images.length) return;

    try {
      setLoading(true);
      setProgress(0);

      const pdfDoc = await PDFDocument.create();

      for (let i = 0; i < images.length; i++) {
        const image = images[i].file;

        const bytes = await image.arrayBuffer();

        let embeddedImage;

        if (image.type === "image/heic" || image.type === "image/heif") {
          const { default: heic2any } = await import("heic2any");

          const converted = await heic2any({
            blob: image,
            toType: "image/png",
          });

          const convertedBlob = Array.isArray(converted)
            ? converted[0]
            : converted;

          if (!(convertedBlob instanceof Blob)) {
            throw new Error("Failed to convert HEIC/HEIF");
          }

          const pngBytes = await convertedBlob.arrayBuffer();

          embeddedImage = await pdfDoc.embedPng(pngBytes);
        } else if (image.type === "image/png") {
          embeddedImage = await pdfDoc.embedPng(bytes);
        } else if (image.type === "image/jpeg") {
          embeddedImage = await pdfDoc.embedJpg(bytes);
        } else if (
          image.type === "image/webp" ||
          image.type === "image/gif" ||
          image.type === "image/bmp" ||
          image.type === "image/tiff"
        ) {
          const bitmap = await createImageBitmap(new Blob([bytes]));

          const canvas = document.createElement("canvas");

          canvas.width = bitmap.width;

          canvas.height = bitmap.height;

          const ctx = canvas.getContext("2d");

          if (!ctx) {
            throw new Error("Canvas error");
          }

          ctx.drawImage(bitmap, 0, 0);

          const pngBlob = await new Promise<Blob>((resolve) => {
            canvas.toBlob((blob) => {
              if (!blob) {
                throw new Error("Failed to convert image");
              }

              resolve(blob);
            }, "image/png");
          });

          const pngBytes = await pngBlob.arrayBuffer();

          embeddedImage = await pdfDoc.embedPng(pngBytes);
        } else {
          throw new Error(`Unsupported image type: ${image.type}`);
        }

        const page = pdfDoc.addPage([
          embeddedImage.width,
          embeddedImage.height,
        ]);

        page.drawImage(embeddedImage, {
          x: 0,
          y: 0,
          width: embeddedImage.width,
          height: embeddedImage.height,
        });

        setProgress(Math.round(((i + 1) / images.length) * 100));
      }

      const pdfBytes = await pdfDoc.save();

      const blob = new Blob([new Uint8Array(pdfBytes)], {
        type: "application/pdf",
      });

      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");

      a.href = url;
      a.download = "images.pdf";

      a.click();

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);

      toast.error(
        error instanceof Error ? error.message : "Failed to convert images",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-6xl mx-auto px-6 py-16">
      <div className="text-center">
        <h1 className="text-5xl font-bold">JPG to PDF</h1>

        <p className="mt-4 text-gray-500">
          Convert JPG, PNG and WEBP images into a PDF document.
        </p>
      </div>

      <div className="mt-10">
        <FileDropzone
          onFilesAdded={addImages}
          title="Select Images"
          subtitle="Upload JPG, PNG, WEBP, HEIC, HEIF, GIF, BMP or TIFF files"
          accept={{
            "image/jpeg": [".jpg", ".jpeg"],
            "image/png": [".png"],
            "image/webp": [".webp"],
            "image/heic": [".heic"],
            "image/heif": [".heif"],
            "image/gif": [".gif"],
            "image/bmp": [".bmp"],
            "image/tiff": [".tif", ".tiff"],
          }}
        />
      </div>

      {images.length > 0 && (
        <>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="images">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="flex flex-col gap-6 mt-8 items-center"
                >
                  {images.map((image, index) => (
                    <Draggable
                      key={image.id}
                      draggableId={image.id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="border rounded-2xl p-4 bg-white"
                        >
                          <Image
                            src={image.preview}
                            alt={image.file.name}
                            width={400}
                            height={300}
                            className="rounded-lg w-48 h-48 object-cover"
                          />

                          <div className="mt-4">
                            <h3 className="font-semibold truncate">
                              {image.file.name}
                            </h3>

                            <p className="text-sm text-gray-500">
                              {(image.file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>

                          <button
                            onClick={() => removeImage(index)}
                            className="mt-3 text-red-500"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
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

          <div className="mt-10 text-center">
            <button
              onClick={convertToPdf}
              disabled={loading}
              className="
                bg-black
                text-white
                px-10
                py-4
                rounded-2xl
                font-semibold
              "
            >
              {loading ? "Converting..." : `Convert ${images.length} Images`}
            </button>
          </div>
        </>
      )}
      <ToolSEO
        title="JPG to PDF Converter"
        description="Convert JPG, PNG, WEBP, HEIC, GIF, BMP, and TIFF images into PDF documents. Arrange images and create professional PDFs online."
        steps={[
          "Upload images",
          "Reorder images if needed",
          "Click Convert to PDF",
          "Download your PDF document",
        ]}
        features={[
          "Supports multiple image formats",
          "Drag and reorder pages",
          "Fast conversion",
          "No uploads to servers",
        ]}
        faqs={[
          {
            question: "Can I convert multiple images into one PDF?",
            answer:
              "Yes. Upload multiple images and combine them into a single PDF.",
          },
          {
            question: "Does it support HEIC images?",
            answer: "Yes. HEIC and HEIF images are supported.",
          },
          {
            question: "Can I change image order?",
            answer: "Yes. Drag and drop images before converting.",
          },
        ]}
      />
    </main>
  );
}
