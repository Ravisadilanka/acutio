"use client";

import { FileText, X } from "lucide-react";
import { formatBytes } from "@/components/ui/kit";

export default function PdfFileBar({ file, pages, onClear }: { file: File; pages?: number; onClear: () => void }) {
  return (
    <div className="card flex items-center gap-3 p-4">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
        <FileText className="h-5 w-5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-gray-900">{file.name}</p>
        <p className="text-sm text-gray-500">{formatBytes(file.size)}{pages ? ` · ${pages} page${pages > 1 ? "s" : ""}` : ""}</p>
      </div>
      <button className="btn-ghost p-2" onClick={onClear} aria-label="Remove file"><X className="h-5 w-5" /></button>
    </div>
  );
}
