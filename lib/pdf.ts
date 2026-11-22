"use client";

/** Lazily load pdf.js (it's large) and point it at the self-hosted worker. */
export async function getPdfjs() {
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
  return pdfjs;
}

export async function openPdf(file: File) {
  const pdfjs = await getPdfjs();
  return pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise;
}

/** Render one page to a canvas at the given scale (1 = 72 dpi). */
export async function renderPage(doc: Awaited<ReturnType<typeof openPdf>>, pageNo: number, scale: number) {
  const page = await doc.getPage(pageNo);
  const viewport = page.getViewport({ scale });
  const canvas = document.createElement("canvas");
  canvas.width = Math.ceil(viewport.width);
  canvas.height = Math.ceil(viewport.height);
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  await page.render({ canvasContext: ctx, viewport }).promise;
  return { canvas, page };
}

export function pdfBlob(bytes: Uint8Array) {
  return new Blob([new Uint8Array(bytes)], { type: "application/pdf" });
}

export const ENCRYPTED_MSG = "This PDF is password-protected. Please remove the password first and try again.";
