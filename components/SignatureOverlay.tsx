"use client";

export interface SignaturePlacement {
  id: string;
  page: number;
  source: string;
  mimeType: string;
  xRatio: number;
  yRatio: number;
  widthRatio: number;
}

interface SignatureOverlayProps {
  x: number;
  y: number;
  width: number;
  source: string;
  isDragging?: boolean;
  onMouseDown: () => void;
  onResize: (width: number) => void;
  onDelete: () => void;
}

export default function SignatureOverlay({
  x,
  y,
  width,
  source,
  isDragging = false,
  onMouseDown,
  onResize,
  onDelete,
}: SignatureOverlayProps) {
  return (
    <div
      data-signature-overlay
      onClick={(event) => event.stopPropagation()}
      onMouseDown={(event) => {
        event.stopPropagation();
        onMouseDown();
      }}
      className={`absolute z-20 select-none ${isDragging ? "scale-[1.01]" : ""}`}
      style={{
        left: x,
        top: y,
        width,
        transform: "translate(-50%, -50%)",
      }}
    >
      <div
        className={`relative rounded-2xl border bg-white/95 p-2 shadow-lg backdrop-blur ${
          isDragging ? "ring-2 ring-black" : ""
        }`}
        style={{
          opacity: 0.42,
          backgroundColor: "rgba(255, 255, 255, 0.14)",
          borderColor: "rgba(17, 24, 39, 0.18)",
        }}
      >
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onDelete();
          }}
          className="absolute right-2 top-2 rounded-full border bg-white px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100"
        >
          Delete
        </button>

        <img
          src={source}
          alt="Signature"
          draggable={false}
          className="mt-6 w-full select-none pointer-events-none"
          style={{ opacity: 0.92 }}
        />

        <label className="mt-3 block text-xs font-medium text-gray-500">
          Resize
        </label>

        <input
          type="range"
          min="80"
          max="400"
          value={width}
          onChange={(event) => onResize(Number(event.target.value))}
          onMouseDown={(event) => event.stopPropagation()}
          className="w-full"
        />
      </div>
    </div>
  );
}
