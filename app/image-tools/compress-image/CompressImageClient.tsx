"use client";

import { useState } from "react";
import Image from "next/image";

import { resizeImage } from "./utils/imageResize";

import { convertFormat } from "./utils/imageFormat";

import FileDropzone from "@/components/FileDropzone";

import { ImageItem, CompressedImage } from "./types";

import { compressImage } from "./utils/imageCompression";

import { convertImageForCompression } from "./utils/imageConverter";
import ToolSEO from "@/components/ToolSEO";

export default function CompressImagePage() {
  const [resizeOption, setResizeOption] = useState("50");

  const [removeMetadata, setRemoveMetadata] = useState(true);

  const [outputFormat, setOutputFormat] = useState<"original" | "jpg" | "webp">(
    "webp",
  );

  const [images, setImages] = useState<ImageItem[]>([]);

  const [results, setResults] = useState<CompressedImage[]>([]);

  const [quality, setQuality] = useState(65);

  const [loading, setLoading] = useState(false);

  const addImages = (files: File[]) => {
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setImages((prev) => [...prev, ...newImages]);
  };

  const compressImages = async () => {
    if (!images.length) return;

    try {
      setLoading(true);

      const compressed = await Promise.all(
        images.map(async (image) => {
          let workingFile = await convertImageForCompression(image.file);

          workingFile = await resizeImage(
            workingFile,
            resizeOption === "original" ? 100 : Number(resizeOption),
          );

          workingFile = await convertFormat(workingFile, outputFormat);

          const compressedFile = await compressImage(workingFile, quality);

          return {
            originalFile: image.file,

            compressedFile,

            preview: URL.createObjectURL(compressedFile),
          };
        }),
      );

      setResults(compressed);
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = (image: CompressedImage) => {
    const url = URL.createObjectURL(image.compressedFile);

    const a = document.createElement("a");

    a.href = url;
    a.download = image.compressedFile.name;

    a.click();

    URL.revokeObjectURL(url);
  };

  const totalOriginal = images.reduce((sum, image) => sum + image.file.size, 0);

  const estimatedSize = totalOriginal * (quality / 100);

  const estimatedSaved = totalOriginal
    ? (((totalOriginal - estimatedSize) / totalOriginal) * 100).toFixed(1)
    : "0";

  return (
    <main className="max-w-6xl mx-auto px-6 py-16">
      <div className="text-center">
        <h1 className="text-5xl font-bold">Compress Image</h1>

        <p className="mt-4 text-gray-500">
          Compress JPG, PNG, WEBP, HEIC, GIF, BMP, TIFF and AVIF images.
        </p>
      </div>

      <div className="mt-10">
        <label className="block font-medium mb-2">Compression Quality</label>

        <input
          type="range"
          min="10"
          max="100"
          value={quality}
          onChange={(e) => setQuality(Number(e.target.value))}
          className="w-full"
        />

        <p className="mt-2 text-gray-500">{quality}%</p>

        <div className="mt-8">
          <label className="block font-medium mb-2">Resize</label>

          <select
            value={resizeOption}
            onChange={(e) => setResizeOption(e.target.value)}
            className="
      border
      rounded-xl
      px-4
      py-3
      w-full
    "
          >
            <option value="original">Keep Original</option>

            <option value="90">90%</option>

            <option value="75">75%</option>

            <option value="50">50%</option>

            <option value="25">25%</option>
          </select>
        </div>

        <div className="mt-8">
          <label className="block font-medium mb-2">Output Format</label>

          <select
            value={outputFormat}
            onChange={(e) =>
              setOutputFormat(e.target.value as "original" | "jpg" | "webp")
            }
            className="
      border
      rounded-xl
      px-4
      py-3
      w-full
    "
          >
            <option value="original">Keep Original</option>

            <option value="jpg">JPG</option>

            <option value="webp">WEBP</option>
          </select>
        </div>

        <label className="flex gap-3 mt-6">
          <input
            type="checkbox"
            checked={removeMetadata}
            onChange={(e) => setRemoveMetadata(e.target.checked)}
          />
          Remove Metadata
        </label>
      </div>

      <div className="mt-8">
        <FileDropzone
          onFilesAdded={addImages}
          title="Select Images"
          subtitle="Upload images to compress"
          accept={{
            "image/*": [],
          }}
        />
      </div>

      {images.length > 0 && (
        <>
          <div className="border rounded-2xl p-6 mt-8">
            <h2 className="font-bold text-xl">Compression Preview</h2>

            <div className="grid md:grid-cols-3 gap-4 mt-4">
              <div>
                <p>Original</p>

                <p className="font-semibold">
                  {(totalOriginal / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>

              <div>
                <p>Estimated</p>

                <p className="font-semibold">
                  {(estimatedSize / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>

              <div>
                <p>Savings</p>

                <p className="font-semibold">{estimatedSaved}%</p>
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <button
              onClick={compressImages}
              disabled={loading}
              className="bg-black text-white px-8 py-4 rounded-2xl"
            >
              {loading ? "Compressing..." : "Compress Images"}
            </button>
          </div>
        </>
      )}

      {results.length > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
          {results.map((image, index) => {
            const original = image.originalFile.size / 1024;

            const compressed = image.compressedFile.size / 1024;

            const saved = (((original - compressed) / original) * 100).toFixed(
              1,
            );

            return (
              <div key={index} className="border rounded-2xl p-4">
                <Image
                  src={image.preview}
                  alt={image.compressedFile.name}
                  width={400}
                  height={300}
                  className="w-full h-48 object-cover rounded-xl"
                />

                <h3 className="mt-4 font-semibold truncate">
                  {image.compressedFile.name}
                </h3>

                <div className="mt-3 text-sm">
                  <p>Original: {original.toFixed(1)} KB</p>

                  <p>Compressed: {compressed.toFixed(1)} KB</p>

                  <p>Saved: {saved}%</p>
                </div>

                <button
                  onClick={() => downloadImage(image)}
                  className="mt-4 w-full bg-black text-white py-3 rounded-xl"
                >
                  Download
                </button>
              </div>
            );
          })}
        </div>
      )}

      <ToolSEO
        title="Compress Image Online Free"
        description="Compress JPG, PNG, WEBP, HEIC, AVIF and other image formats online for free. Reduce image file size while maintaining quality directly in your browser."
        steps={[
          "Upload one or more images",
          "Choose compression quality",
          "Select resize percentage if needed",
          "Choose output format",
          "Click Compress Images",
          "Download the optimized images",
        ]}
        features={[
          "Supports JPG, PNG, WEBP, HEIC, HEIF, GIF, BMP, TIFF and AVIF",
          "Batch image compression",
          "Resize images before compression",
          "Convert images to JPG or WEBP",
          "Browser-based processing",
          "No file uploads to external servers",
          "Fast image optimization",
        ]}
        faqs={[
          {
            question: "How do I compress an image?",
            answer:
              "Upload your image, choose your compression settings and download the optimized version.",
          },
          {
            question: "Is this image compressor free?",
            answer: "Yes. All Acutio image tools are free to use.",
          },
          {
            question: "Are my images uploaded to a server?",
            answer:
              "No. All image processing happens directly inside your browser.",
          },
          {
            question: "Which image formats are supported?",
            answer:
              "JPG, JPEG, PNG, WEBP, GIF, BMP, TIFF, HEIC, HEIF and AVIF images are supported.",
          },
          {
            question: "Will image compression reduce quality?",
            answer:
              "Compression may slightly reduce image quality depending on your settings, but it significantly decreases file size.",
          },
        ]}
      />
    </main>
  );
}
