"use client";

import SignatureCanvas from "react-signature-canvas";

import FileDropzone from "@/components/FileDropzone";

interface SignatureToolbarProps {
  signatureMode: "draw" | "upload";
  onSignatureModeChange: (mode: "draw" | "upload") => void;
  signatureColor: string;
  onSignatureColorChange: (color: string) => void;
  signatureWidth: number;
  onSignatureWidthChange: (width: number) => void;
  includeDate: boolean;
  onIncludeDateChange: (includeDate: boolean) => void;
  initials: string;
  onInitialsChange: (initials: string) => void;
  applyToAllPages: boolean;
  onApplyToAllPagesChange: (applyToAllPages: boolean) => void;
  pageCount: number;
  signaturePreview: string | null;
  onSignatureUpload: (file: File) => void;
  onSignatureDrawEnd: (dataUrl: string | null) => void;
  onClearDraft: () => void;
  onSign: () => void;
  loading: boolean;
  signatureCanvasRef: React.RefObject<SignatureCanvas | null>;
}

export default function SignatureToolbar({
  signatureMode,
  onSignatureModeChange,
  signatureColor,
  onSignatureColorChange,
  signatureWidth,
  onSignatureWidthChange,
  includeDate,
  onIncludeDateChange,
  initials,
  onInitialsChange,
  applyToAllPages,
  onApplyToAllPagesChange,
  pageCount,
  signaturePreview,
  onSignatureUpload,
  onSignatureDrawEnd,
  onClearDraft,
  onSign,
  loading,
  signatureCanvasRef,
}: SignatureToolbarProps) {
  const handleClear = () => {
    if (signatureMode === "draw") {
      signatureCanvasRef.current?.clear();
      onSignatureDrawEnd(null);
    }

    onClearDraft();
  };

  return (
    <section className="bg-white border rounded-2xl p-6">
      <h2 className="text-xl font-semibold mb-4">Signature</h2>

      <div className="flex gap-3 mb-6">
        <button
          type="button"
          onClick={() => onSignatureModeChange("draw")}
          className={`px-4 py-2 rounded-xl border ${
            signatureMode === "draw" ? "bg-black text-white" : "bg-white"
          }`}
        >
          Draw
        </button>

        <button
          type="button"
          onClick={() => onSignatureModeChange("upload")}
          className={`px-4 py-2 rounded-xl border ${
            signatureMode === "upload" ? "bg-black text-white" : "bg-white"
          }`}
        >
          Upload
        </button>
      </div>

      <div className="border rounded-xl overflow-hidden bg-white p-3">
        <label className="block font-medium mb-2">Signature Color</label>

        <div className="flex items-center gap-4">
          <input
            type="color"
            value={signatureColor}
            onChange={(event) => onSignatureColorChange(event.target.value)}
            className="w-14 h-14 border rounded-lg cursor-pointer"
          />

          <span className="text-gray-500">{signatureColor}</span>
        </div>

        {signatureMode === "draw" && (
          <SignatureCanvas
            ref={signatureCanvasRef}
            penColor={signatureColor}
            minWidth={1}
            maxWidth={2.5}
            velocityFilterWeight={0.7}
            onEnd={() => {
              onSignatureDrawEnd(
                signatureCanvasRef.current
                  ?.getCanvas()
                  .toDataURL("image/png") ?? null,
              );
            }}
            canvasProps={{
              width: 900,
              height: 250,
              className: "bg-white cursor-crosshair border rounded-2xl mt-3",
            }}
          />
        )}

        {signatureMode === "upload" && (
          <div className="mt-4">
            <FileDropzone
              onFilesAdded={(files) => {
                const uploadedFile = files[0];

                if (uploadedFile) {
                  onSignatureUpload(uploadedFile);
                }
              }}
              title="Upload Signature Image"
              subtitle="Drag and drop a PNG or JPG signature here"
              accept={{
                "image/png": [".png"],
                "image/jpeg": [".jpg", ".jpeg"],
              }}
              multiple={false}
            />

            {signaturePreview && (
              <img
                src={signaturePreview}
                alt="Signature Preview"
                className="mt-4 max-h-40 border rounded-xl p-2"
              />
            )}
          </div>
        )}

        <div className="mt-6">
          <label className="block font-medium mb-2">Signature Size</label>

          <input
            type="range"
            min="80"
            max="400"
            value={signatureWidth}
            onChange={(event) =>
              onSignatureWidthChange(Number(event.target.value))
            }
            className="w-full"
          />

          <p className="text-sm text-gray-500 mt-2">{signatureWidth}px</p>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="flex items-center gap-3 rounded-xl border px-4 py-3">
            <input
              type="checkbox"
              checked={includeDate}
              onChange={(event) => onIncludeDateChange(event.target.checked)}
            />

            <span className="font-medium">Add Date</span>
          </label>

          <label className="flex items-center gap-3 rounded-xl border px-4 py-3">
            <input
              type="checkbox"
              checked={applyToAllPages}
              onChange={(event) =>
                onApplyToAllPagesChange(event.target.checked)
              }
              className="h-4 w-4 rounded border-gray-300"
            />

            <span className="font-medium">Apply to all pages</span>
          </label>

          <div>
            <label className="block font-medium mb-2">Initials</label>

            <input
              type="text"
              value={initials}
              onChange={(event) => onInitialsChange(event.target.value)}
              placeholder="AB"
              className="border rounded-xl px-4 py-3 w-full"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-4 mt-4">
        <button
          type="button"
          onClick={handleClear}
          className="border px-6 py-3 rounded-xl hover:bg-gray-100"
        >
          Clear
        </button>

        <button
          type="button"
          onClick={onSign}
          disabled={loading}
          className="bg-black text-white px-6 py-3 rounded-xl disabled:opacity-50"
        >
          {loading ? "Signing..." : "Sign PDF"}
        </button>
      </div>

      <p className="mt-4 text-sm text-gray-500">
        Draw or upload a signature, then click on the PDF preview to place it.
      </p>
    </section>
  );
}
