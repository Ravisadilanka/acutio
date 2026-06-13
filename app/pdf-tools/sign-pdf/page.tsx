"use client";

import { useRef, useState } from "react";
import { PDFDocument } from "pdf-lib";
import SignatureCanvas from "react-signature-canvas";
import { toast } from "sonner";

import FileDropzone from "@/components/FileDropzone";
import PdfFileCard from "@/components/PdfFileCard";

export default function SignPdfPage() {
  const [file, setFile] =
    useState<File | null>(null);

  const [pageCount, setPageCount] =
    useState(0);

  const [loading, setLoading] =
    useState(false);

  const sigCanvas =
    useRef<SignatureCanvas>(null);

  const handleFiles = async (
    files: File[]
  ) => {
    const pdfFile = files[0];

    if (!pdfFile) return;

    try {
      const bytes =
        await pdfFile.arrayBuffer();

      const pdf =
        await PDFDocument.load(
          bytes
        );

      setPageCount(
        pdf.getPageCount()
      );

      setFile(pdfFile);
    } catch (error) {
      console.error(error);

      toast.error(
        "Invalid PDF file"
      );
    }
  };

  const clearSignature = () => {
    sigCanvas.current?.clear();
  };

  const signPdf = async () => {
    if (!file) {
      toast.error(
        "Please upload a PDF"
      );
      return;
    }

    if (
      !sigCanvas.current ||
      sigCanvas.current.isEmpty()
    ) {
      toast.error(
        "Please draw a signature"
      );
      return;
    }

    try {
      setLoading(true);

      const loadingToast =
        toast.loading(
          "Signing PDF..."
        );

      const pdfBytes =
        await file.arrayBuffer();

      const pdfDoc =
        await PDFDocument.load(
          pdfBytes
        );

      const signatureDataUrl =
  sigCanvas.current
    ?.getCanvas()
    .toDataURL("image/png");

if (!signatureDataUrl) {
  throw new Error(
    "Failed to capture signature"
  );
}

      const signatureBytes =
        await fetch(
          signatureDataUrl
        ).then((res) =>
          res.arrayBuffer()
        );

      const signatureImage =
        await pdfDoc.embedPng(
          signatureBytes
        );

      const firstPage =
        pdfDoc.getPages()[0];

      const { width, height } =
        firstPage.getSize();

      const signatureWidth =
        180;

      const signatureHeight =
        (signatureImage.height /
          signatureImage.width) *
        signatureWidth;

      firstPage.drawImage(
        signatureImage,
        {
          x: width - 220,
          y: 40,
          width:
            signatureWidth,
          height:
            signatureHeight,
        }
      );

      const signedPdfBytes =
        await pdfDoc.save();

      const blob =
        new Blob(
          [
            new Uint8Array(
              signedPdfBytes
            ),
          ],
          {
            type:
              "application/pdf",
          }
        );

      const url =
        URL.createObjectURL(
          blob
        );

      const a =
        document.createElement(
          "a"
        );

      a.href = url;
      a.download =
        "signed.pdf";

      a.click();

      URL.revokeObjectURL(
        url
      );

      toast.success(
        "PDF signed successfully",
        {
          id: loadingToast,
        }
      );
    } catch (error) {
      console.error(error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to sign PDF"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-5xl mx-auto px-6 py-16">
      <div className="text-center">
        <h1 className="text-5xl font-bold">
          Sign PDF
        </h1>

        <p className="mt-4 text-gray-500">
          Draw your signature and
          add it to a PDF.
        </p>
      </div>

      <div className="mt-10">
        <FileDropzone
          onFilesAdded={
            handleFiles
          }
          title="Select PDF File"
          subtitle="Upload a PDF to sign"
          accept={{
            "application/pdf":
              [".pdf"],
          }}
        />
      </div>

      {file && (
        <div className="mt-8 space-y-6">
          <PdfFileCard
            file={file}
            pages={pageCount}
            onRemove={() => {
              setFile(null);
              setPageCount(0);
            }}
          />

          <div className="bg-white border rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-4">
              Draw Signature
            </h2>

            <div className="border rounded-xl overflow-auto bg-white">
              <SignatureCanvas
                ref={sigCanvas}
                penColor="black"
                minWidth={1}
                maxWidth={2.5}
                velocityFilterWeight={0.7}
                canvasProps={{
                  width: 1000,
                  height: 250,
                  className:
                    "bg-white cursor-crosshair",
                }}
              />
            </div>

            <div className="flex gap-4 mt-4">
              <button
                onClick={
                  clearSignature
                }
                className="
                  border
                  px-6
                  py-3
                  rounded-xl
                  hover:bg-gray-100
                "
              >
                Clear
              </button>

              <button
                onClick={signPdf}
                disabled={loading}
                className="
                  bg-black
                  text-white
                  px-6
                  py-3
                  rounded-xl
                  disabled:opacity-50
                "
              >
                {loading
                  ? "Signing..."
                  : "Sign PDF"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}