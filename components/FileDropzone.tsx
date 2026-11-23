"use client";

import { useDropzone } from "react-dropzone";
import { UploadCloud, Lock } from "lucide-react";

interface FileDropzoneProps {
  onFilesAdded: (files: File[]) => void;
  title?: string;
  subtitle?: string;
  accept?: Record<string, string[]>;
  multiple?: boolean;
  compact?: boolean;
}

export default function FileDropzone({
  onFilesAdded,
  title = "Select Files",
  subtitle = "or drag and drop them here",
  accept,
  multiple = true,
  compact = false,
}: FileDropzoneProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept,
    multiple,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length) onFilesAdded(acceptedFiles);
    },
  });

  return (
    <div
      {...getRootProps()}
      className={`group relative cursor-pointer rounded-3xl border-2 border-dashed text-center transition ${
        compact ? "p-6" : "p-10 md:p-16"
      } ${isDragActive ? "border-brand bg-brand-soft" : "border-gray-300 bg-gray-50 hover:border-brand hover:bg-brand-soft"}`}
    >
      <input {...getInputProps({ "aria-label": title })} />
      <span className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand text-white shadow-lg shadow-brand/30 transition group-hover:scale-105">
        <UploadCloud className="h-8 w-8" />
      </span>
      <p className="text-xl font-bold text-gray-900">{isDragActive ? "Drop files here" : title}</p>
      <p className="mt-1 text-gray-500">{subtitle}</p>
      <p className="mt-4 inline-flex items-center gap-1.5 text-xs text-gray-500">
        <Lock className="h-3.5 w-3.5" /> Files are processed on your device and never uploaded
      </p>
    </div>
  );
}
