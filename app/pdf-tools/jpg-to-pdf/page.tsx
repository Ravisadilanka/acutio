"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import FileDropzone from "@/components/FileDropzone";
import Image from "next/image";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

interface ImageItem {
  file: File;
  preview: string;
}

export default function JpgToPdfPage() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const addImages = (files: File[]) => {
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setImages((prev) => [...prev, ...newImages]);
  };

  const removeImage = (index: number) => {
    setImages((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  const convertToPdf = async () => {
  if (!images.length) return;

  try {
    setLoading(true);
    setProgress(0);

    const pdfDoc =
      await PDFDocument.create();

    for (
      let i = 0;
      i < images.length;
      i++
    ) {
      const image =
        images[i].file;

      const bytes =
        await image.arrayBuffer();

      let embeddedImage;

      if (
        image.type ===
        "image/png"
      ) {
        embeddedImage =
          await pdfDoc.embedPng(
            bytes
          );
      } else if (
        image.type ===
        "image/jpeg"
      ) {
        embeddedImage =
          await pdfDoc.embedJpg(
            bytes
          );
      } else if (
        image.type ===
        "image/webp"
      ) {
        const bitmap =
          await createImageBitmap(
            new Blob([bytes])
          );

        const canvas =
          document.createElement(
            "canvas"
          );

        canvas.width =
          bitmap.width;

        canvas.height =
          bitmap.height;

        const ctx =
          canvas.getContext(
            "2d"
          );

        if (!ctx) {
          throw new Error(
            "Canvas error"
          );
        }

        ctx.drawImage(
          bitmap,
          0,
          0
        );

        const pngBlob =
          await new Promise<Blob>(
            (
              resolve
            ) => {
              canvas.toBlob(
                (
                  blob
                ) => {
                  if (
                    !blob
                  ) {
                    throw new Error(
                      "Failed to convert WEBP"
                    );
                  }

                  resolve(
                    blob
                  );
                },
                "image/png"
              );
            }
          );

        const pngBytes =
          await pngBlob.arrayBuffer();

        embeddedImage =
          await pdfDoc.embedPng(
            pngBytes
          );
      } else {
        throw new Error(
          `Unsupported image type: ${image.type}`
        );
      }

      const page =
        pdfDoc.addPage([
          embeddedImage.width,
          embeddedImage.height,
        ]);

      page.drawImage(
        embeddedImage,
        {
          x: 0,
          y: 0,
          width:
            embeddedImage.width,
          height:
            embeddedImage.height,
        }
      );

      setProgress(
        Math.round(
          ((i + 1) /
            images.length) *
            100
        )
      );
    }

    const pdfBytes =
      await pdfDoc.save();

    const blob =
      new Blob(
        [
          new Uint8Array(
            pdfBytes
          ),
        ],
        {
          type: "application/pdf",
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
      "images.pdf";

    a.click();

    URL.revokeObjectURL(
      url
    );
  } catch (error) {
    console.error(error);

    toast.error(
  error instanceof Error
    ? error.message
    : "Failed to convert images"
);
  } finally {
    setLoading(false);
  }
};

  return (
    <main className="max-w-6xl mx-auto px-6 py-16">
      <div className="text-center">
        <h1 className="text-5xl font-bold">
          JPG to PDF
        </h1>

        <p className="mt-4 text-gray-500">
          Convert JPG, PNG and WEBP
          images into a PDF document.
        </p>
      </div>

      <div className="mt-10">
        <FileDropzone
          onFilesAdded={addImages}
          title="Select Images"
          subtitle="Upload JPG, PNG or WEBP files"
          accept={{
            "image/jpeg": [
              ".jpg",
              ".jpeg",
            ],
            "image/png": [".png"],
            "image/webp": [
              ".webp",
            ],
          }}
        />
      </div>

      {images.length > 0 && (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {images.map(
              (image, index) => (
                <div
                  key={index}
                  className="border rounded-2xl p-4 bg-white"
                >
                  <Image
                    src={
                      image.preview
                    }
                    alt={
                      image.file.name
                    }
                    width={400}
                    height={300}
                    className="rounded-lg w-full h-48 object-cover"
                  />

                  <div className="mt-4">
                    <h3 className="font-semibold truncate">
                      {
                        image.file
                          .name
                      }
                    </h3>

                    <p className="text-sm text-gray-500">
                      {(
                        image.file
                          .size /
                        1024 /
                        1024
                      ).toFixed(
                        2
                      )}{" "}
                      MB
                    </p>
                  </div>

                  <button
                    onClick={() =>
                      removeImage(
                        index
                      )
                    }
                    className="mt-3 text-red-500"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              )
            )}
          </div>

          {loading && (
            <div className="mt-8">
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

          <div className="mt-10 text-center">
            <button
              onClick={
                convertToPdf
              }
              disabled={
                loading
              }
              className="
                bg-black
                text-white
                px-10
                py-4
                rounded-2xl
                font-semibold
              "
            >
              {loading
                ? "Converting..."
                : `Convert ${images.length} Images`}
            </button>
          </div>
        </>
      )}
    </main>
  );
}