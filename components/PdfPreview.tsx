"use client";

import SignatureOverlay, {
  type SignaturePlacement,
} from "@/components/SignatureOverlay";

interface PdfPagePreview {
  pageNumber: number;
  preview: string;
  width: number;
  height: number;
}

interface PdfPreviewProps {
  pages: PdfPagePreview[];
  signatures: SignaturePlacement[];
  draggingId: string | null;
  onPlaceSignature: (pageNumber: number, x: number, y: number) => void;
  onDragStart: (id: string) => void;
  onDragMove: (id: string, pageNumber: number, x: number, y: number) => void;
  onDragEnd: () => void;
  onResize: (id: string, width: number) => void;
  onDelete: (id: string) => void;
}

export default function PdfPreview({
  pages,
  signatures,
  draggingId,
  onPlaceSignature,
  onDragStart,
  onDragMove,
  onDragEnd,
  onResize,
  onDelete,
}: PdfPreviewProps) {
  return (
    <section className="mt-6">
      <label className="block font-medium mb-2">All Pages Preview</label>

      <div className="space-y-8 rounded-2xl border bg-gray-50 p-4">
        {pages.length > 0 ? (
          pages.map((page) => {
            const visibleSignatures = signatures.filter(
              (signature) => signature.page === page.pageNumber,
            );

            return (
              <div
                key={page.pageNumber}
                className="overflow-hidden rounded-2xl border bg-white shadow-sm"
              >
                <div className="border-b px-4 py-3 text-sm font-medium text-gray-600">
                  Page {page.pageNumber}
                </div>

                <div
                  onClick={(event) => {
                    const rect = event.currentTarget.getBoundingClientRect();
                    const x = event.clientX - rect.left;
                    const y = event.clientY - rect.top;

                    if (x < 0 || y < 0 || x > page.width || y > page.height) {
                      return;
                    }

                    onPlaceSignature(page.pageNumber, x, y);
                  }}
                  onMouseMove={(event) => {
                    if (!draggingId) return;

                    const rect = event.currentTarget.getBoundingClientRect();
                    const x = event.clientX - rect.left;
                    const y = event.clientY - rect.top;

                    if (x < 0 || y < 0 || x > page.width || y > page.height) {
                      return;
                    }

                    onDragMove(draggingId, page.pageNumber, x, y);
                  }}
                  onMouseUp={onDragEnd}
                  onMouseLeave={onDragEnd}
                  className="relative cursor-crosshair"
                  style={{ width: page.width, height: page.height }}
                >
                  <img
                    src={page.preview}
                    alt={`Preview of page ${page.pageNumber}`}
                    className="absolute inset-0 h-full w-full"
                  />

                  <div className="absolute inset-0 flex items-center justify-center bg-white/10 text-sm text-gray-400 pointer-events-none">
                    Click anywhere to place signature
                  </div>

                  {visibleSignatures.map((signature) => (
                    <SignatureOverlay
                      key={signature.id}
                      x={signature.xRatio * page.width}
                      y={signature.yRatio * page.height}
                      width={signature.widthRatio * page.width}
                      source={signature.source}
                      isDragging={draggingId === signature.id}
                      onMouseDown={() => onDragStart(signature.id)}
                      onResize={(width) => onResize(signature.id, width)}
                      onDelete={() => onDelete(signature.id)}
                    />
                  ))}
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex h-64 items-center justify-center text-sm text-gray-400">
            Upload a PDF to preview all pages
          </div>
        )}
      </div>
    </section>
  );
}
