"use client";

import { GripVertical, Trash2, FileText } from "lucide-react";

interface PdfFileCardProps {
  file: File;
  pages: number;
  onRemove: () => void;
}

export default function PdfFileCard({
  file,
  pages,
  onRemove,
}: PdfFileCardProps) {
  return (
    <div className="bg-white border rounded-2xl shadow-sm p-4 hover:shadow-md transition">
      <div className="flex items-center gap-4">
        <GripVertical className="w-5 h-5 text-gray-400" />

        <div className="w-16 h-20 bg-red-50 rounded-lg flex items-center justify-center">
          <FileText className="w-8 h-8 text-red-500" />
        </div>

        <div className="flex-1">
          <h3 className="font-semibold truncate">
            {file.name}
          </h3>

          <p className="text-sm text-gray-500">
            {pages} pages
          </p>

          <p className="text-sm text-gray-500">
            {(file.size / 1024 / 1024).toFixed(2)} MB
          </p>
        </div>

        <button
          onClick={onRemove}
          className="text-red-500 hover:text-red-700"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}