"use client";

import Image from "next/image";
import { Trash2, GripVertical } from "lucide-react";

interface ImageCardProps {
  file: File;
  preview: string;
  onRemove: () => void;
}

export default function ImageCard({
  file,
  preview,
  onRemove,
}: ImageCardProps) {
  return (
    <div className="border rounded-2xl p-4 bg-white shadow-sm">
      <div className="flex items-center gap-4">
        <GripVertical className="w-5 h-5 text-gray-400" />

        <Image
          src={preview}
          alt={file.name}
          width={80}
          height={80}
          className="rounded-lg object-cover"
        />

        <div className="flex-1">
          <h3 className="font-semibold truncate">
            {file.name}
          </h3>

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