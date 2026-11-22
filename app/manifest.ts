import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Acutio – Free Online Tools",
    short_name: "Acutio",
    description: "65+ free, private tools for PDF, images, text, calculations and more.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#5046e5",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcuts: [
      { name: "Merge PDF", url: "/pdf-tools/merge-pdf/" },
      { name: "Compress Image", url: "/image-tools/compress-image/" },
      { name: "QR Code Generator", url: "/generators/qr-code-generator/" },
      { name: "Word Counter", url: "/text-tools/word-counter/" },
    ],
  };
}
