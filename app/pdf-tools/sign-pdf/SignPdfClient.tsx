"use client";

import { useRef, useState } from "react";
import { PDFDocument } from "pdf-lib";
import * as pdfjsLib from "pdfjs-dist";
import SignatureCanvas from "react-signature-canvas";
import { toast } from "sonner";

import FileDropzone from "@/components/FileDropzone";
import PdfFileCard from "@/components/PdfFileCard";
import PdfPreview from "@/components/PdfPreview";
import SignatureToolbar from "@/components/SignatureToolbar";
import type { SignaturePlacement } from "@/components/SignatureOverlay";

pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

export default function SignPdfPage() {
  const [file, setFile] = useState<File | null>(null);

  const [pageCount, setPageCount] = useState(0);

  const [pdfPages, setPdfPages] = useState<
    Array<{
      pageNumber: number;
      preview: string;
      width: number;
      height: number;
    }>
  >([]);

  const [loading, setLoading] = useState(false);

  const sigCanvas = useRef<SignatureCanvas>(null);

  const [signatures, setSignatures] = useState<SignaturePlacement[]>([]);

  const [draggingId, setDraggingId] = useState<string | null>(null);

  const [signatureMode, setSignatureMode] = useState<"draw" | "upload">("draw");

  const [signatureColor, setSignatureColor] = useState("#000000");

  const [signatureWidth, setSignatureWidth] = useState(180);

  const [includeDate, setIncludeDate] = useState(false);

  const [applyToAllPages, setApplyToAllPages] = useState(false);

  const [initials, setInitials] = useState("");

  const [signatureFile, setSignatureFile] = useState<File | null>(null);

  const [signaturePreview, setSignaturePreview] = useState<string | null>(null);

  const [signatureDataUrl, setSignatureDataUrl] = useState<string | null>(null);

  const generatePreview = async (pdfFile: File) => {
    const bytes = await pdfFile.arrayBuffer();

    const pdf = await pdfjsLib.getDocument({
      data: bytes,
    }).promise;

    const renderedPages = await Promise.all(
      Array.from({ length: pdf.numPages }, async (_, index) => {
        const pageNumber = index + 1;
        const page = await pdf.getPage(pageNumber);

        const viewport = page.getViewport({
          scale: 1,
        });

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        if (!context) {
          return null;
        }

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({
          canvasContext: context,
          viewport,
        } as any).promise;

        return {
          pageNumber,
          preview: canvas.toDataURL("image/png"),
          width: viewport.width,
          height: viewport.height,
        };
      }),
    );

    setPdfPages(
      renderedPages.filter(Boolean) as Array<{
        pageNumber: number;
        preview: string;
        width: number;
        height: number;
      }>,
    );
  };

  const clearCurrentDraft = () => {
    setSignatureFile(null);
    setSignatureDataUrl(null);

    setSignaturePreview((previousPreview) => {
      if (previousPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(previousPreview);
      }

      return null;
    });
  };

  const handleFiles = async (files: File[]) => {
    const pdfFile = files[0];

    if (!pdfFile) return;

    try {
      const bytes = await pdfFile.arrayBuffer();

      const pdf = await PDFDocument.load(bytes);

      setPageCount(pdf.getPageCount());

      setSignatures([]);

      setDraggingId(null);

      clearCurrentDraft();

      setPdfPages([]);

      setFile(pdfFile);

      await generatePreview(pdfFile);
    } catch (error) {
      console.error(error);

      toast.error("Invalid PDF file");
    }
  };

  const clearSignature = () => {
    clearCurrentDraft();
  };

  const handleSignatureUpload = (uploadedFile: File) => {
    setSignatureFile(uploadedFile);
    setSignaturePreview((previousPreview) => {
      if (previousPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(previousPreview);
      }

      return URL.createObjectURL(uploadedFile);
    });
    setSignatureDataUrl(null);
  };

  const updateSignature = (
    signatureId: string,
    updates: Partial<SignaturePlacement>,
  ) => {
    setSignatures((currentSignatures) =>
      currentSignatures.map((signature) =>
        signature.id === signatureId ? { ...signature, ...updates } : signature,
      ),
    );
  };

  const deleteSignature = (signatureId: string) => {
    setSignatures((currentSignatures) =>
      currentSignatures.filter((signature) => signature.id !== signatureId),
    );
  };

  const addSignature = (pageNumber: number, x: number, y: number) => {
    const source =
      signatureMode === "draw" ? signatureDataUrl : signaturePreview;

    if (!source) {
      toast.error(
        signatureMode === "draw"
          ? "Please draw a signature"
          : "Please upload a signature image",
      );
      return;
    }

    const mimeType =
      signatureMode === "draw"
        ? "image/png"
        : (signatureFile?.type ?? "image/png");

    const pagePreview = pdfPages.find((page) => page.pageNumber === pageNumber);

    if (!pagePreview) {
      toast.error("Preview for the selected page is not available");
      return;
    }

    const previewWidth = pagePreview.width || 1;
    const previewHeight = pagePreview.height || 1;

    const xRatio = x / previewWidth;
    const yRatio = y / previewHeight;
    const widthRatio = signatureWidth / previewWidth;

    const targetPages = applyToAllPages
      ? Array.from({ length: pageCount }, (_, index) => index + 1)
      : [pageNumber];

    setSignatures((currentSignatures) => [
      ...currentSignatures,
      ...targetPages.map((page) => ({
        id: crypto.randomUUID(),
        page,
        source,
        mimeType,
        xRatio,
        yRatio,
        widthRatio,
      })),
    ]);
  };

  const signPdf = async () => {
    if (!file) {
      toast.error("Please upload a PDF");
      return;
    }

    if (signatures.length === 0) {
      toast.error("Please place at least one signature");
      return;
    }

    try {
      setLoading(true);

      const loadingToast = toast.loading("Signing PDF...");

      const pdfBytes = await file.arrayBuffer();

      const pdfDoc = await PDFDocument.load(pdfBytes);

      const pdfPages = pdfDoc.getPages();

      for (const signature of signatures) {
        const selectedPdfPage = pdfPages[signature.page - 1];

        if (!selectedPdfPage) continue;

        const signatureBytes = await fetch(signature.source).then((res) =>
          res.arrayBuffer(),
        );

        const signatureImage =
          signature.mimeType === "image/jpeg"
            ? await pdfDoc.embedJpg(signatureBytes)
            : await pdfDoc.embedPng(signatureBytes);

        const { width } = selectedPdfPage.getSize();
        const { height } = selectedPdfPage.getSize();

        const pdfSignatureWidth = signature.widthRatio * width;

        const pdfSignatureHeight =
          (signatureImage.height / signatureImage.width) * pdfSignatureWidth;

        const pdfCenterX = signature.xRatio * width;

        const pdfCenterY = height - signature.yRatio * height;

        const pdfX = pdfCenterX - pdfSignatureWidth / 2;

        const pdfY = pdfCenterY - pdfSignatureHeight / 2;

        selectedPdfPage.drawImage(signatureImage, {
          x: pdfX,
          y: pdfY,
          width: pdfSignatureWidth,
          height: pdfSignatureHeight,
        });

        if (includeDate) {
          selectedPdfPage.drawText(new Date().toLocaleDateString(), {
            x: pdfX + pdfSignatureWidth + 10,
            y: pdfY,
            size: 10,
          });
        }

        const cleanedInitials = initials.trim();

        if (cleanedInitials) {
          selectedPdfPage.drawText(cleanedInitials, {
            x: pdfX + pdfSignatureWidth + 10,
            y: pdfY - 20,
            size: 12,
          });
        }
      }

      const signedPdfBytes = await pdfDoc.save();

      const blob = new Blob([new Uint8Array(signedPdfBytes)], {
        type: "application/pdf",
      });

      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");

      a.href = url;
      a.download = "signed.pdf";

      a.click();

      URL.revokeObjectURL(url);

      toast.success("PDF signed successfully", {
        id: loadingToast,
      });
    } catch (error) {
      console.error(error);

      toast.error(
        error instanceof Error ? error.message : "Failed to sign PDF",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-5xl mx-auto px-6 py-16">
      <div className="text-center">
        <h1 className="text-5xl font-bold">Sign PDF</h1>

        <p className="mt-4 text-gray-500">
          Draw your signature and add it to a PDF.
        </p>
      </div>

      <div className="mt-10">
        <FileDropzone
          onFilesAdded={handleFiles}
          title="Select PDF File"
          subtitle="Upload a PDF to sign"
          accept={{
            "application/pdf": [".pdf"],
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
              setPdfPages([]);
              setSignatures([]);
              setDraggingId(null);
              clearCurrentDraft();
            }}
          />

          <PdfPreview
            pages={pdfPages}
            signatures={signatures}
            draggingId={draggingId}
            onPlaceSignature={addSignature}
            onDragStart={setDraggingId}
            onDragMove={(signatureId, x, y) => {
              const signature = signatures.find(
                (item) => item.id === signatureId,
              );

              const pagePreview = signature
                ? pdfPages.find((page) => page.pageNumber === signature.page)
                : null;

              const previewWidth = pagePreview?.width || 1;
              const previewHeight = pagePreview?.height || 1;

              updateSignature(signatureId, {
                xRatio: x / previewWidth,
                yRatio: y / previewHeight,
              });
            }}
            onDragEnd={() => setDraggingId(null)}
            onResize={(signatureId, width) => {
              const signature = signatures.find(
                (item) => item.id === signatureId,
              );

              const pagePreview = signature
                ? pdfPages.find((page) => page.pageNumber === signature.page)
                : null;

              const previewWidth = pagePreview?.width || 1;

              updateSignature(signatureId, {
                widthRatio: width / previewWidth,
              });
            }}
            onDelete={deleteSignature}
          />

          <SignatureToolbar
            signatureMode={signatureMode}
            onSignatureModeChange={setSignatureMode}
            signatureColor={signatureColor}
            onSignatureColorChange={setSignatureColor}
            signatureWidth={signatureWidth}
            onSignatureWidthChange={setSignatureWidth}
            includeDate={includeDate}
            onIncludeDateChange={setIncludeDate}
            initials={initials}
            onInitialsChange={setInitials}
            applyToAllPages={applyToAllPages}
            onApplyToAllPagesChange={setApplyToAllPages}
            pageCount={pageCount}
            signaturePreview={signaturePreview}
            onSignatureUpload={handleSignatureUpload}
            onSignatureDrawEnd={setSignatureDataUrl}
            onClearDraft={clearCurrentDraft}
            onSign={signPdf}
            loading={loading}
            signatureCanvasRef={sigCanvas}
          />
        </div>
      )}
    </main>
  );
}
