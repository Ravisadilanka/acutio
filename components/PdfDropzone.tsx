"use client";

import { useDropzone } from "react-dropzone";
import { Upload } from "lucide-react";

export default function PdfDropzone({
  onFilesAdded,
}: {
  onFilesAdded: (files: File[]) => void;
}) {
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "application/pdf": [".pdf"],
    },
    multiple: true,
    onDrop: (acceptedFiles) => {
      onFilesAdded(acceptedFiles);
    },
  });

  return (
    <div
      {...getRootProps()}
      className="
      border-2
      border-dashed
      border-gray-300
      rounded-3xl
      p-8 md:p-16
      text-center
      cursor-pointer
      hover:border-black
      transition
      "
    >
      <input {...getInputProps()} />

      <Upload className="w-12 h-12 mx-auto mb-4" />

      <h2 className="text-2xl font-bold">Select PDF Files</h2>

      <p className="text-gray-500 mt-2">Drag and drop PDFs here</p>
    </div>
  );
}
