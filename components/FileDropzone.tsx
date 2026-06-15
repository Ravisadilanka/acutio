"use client";

import { useDropzone } from "react-dropzone";
import { Upload } from "lucide-react";

interface FileDropzoneProps {
  onFilesAdded: (files: File[]) => void;
  title?: string;
  subtitle?: string;
  accept?: Record<string, string[]>;
  multiple?: boolean;
}

export default function FileDropzone({
  onFilesAdded,
  title = "Select Files",
  subtitle = "Drag and drop files here",
  accept,
  multiple = true,
}: FileDropzoneProps) {
  const { getRootProps, getInputProps } = useDropzone({
    accept,
    multiple,
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

      <h2 className="text-2xl font-bold">{title}</h2>

      <p className="text-gray-500 mt-2">{subtitle}</p>
    </div>
  );
}
