import type { Metadata } from "next";

import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ThemeProvider from "@/components/ThemeProvider";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  metadataBase: new URL("https://acutio.com"),

  title: {
    default: "Acutio | Free Online Tools",
    template: "%s | Acutio",
  },

  description:
    "Free online tools for PDF editing, file conversion, productivity, calculators, generators and more. Fast, secure and easy to use directly in your browser.",

  keywords: [
    "free online tools",
    "PDF tools",
    "merge PDF",
    "split PDF",
    "rotate PDF",
    "JPG to PDF",
    "PDF to JPG",
    "sign PDF",
    "file converter",
    "online utilities",
  ],

  authors: [
    {
      name: "Acutio",
    },
  ],

  creator: "Acutio",

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    title: "Acutio | Free Online Tools",
    description:
      "Free online tools for PDF editing, file conversion, productivity and more.",
    url: "https://acutio.com",
    siteName: "Acutio",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Acutio | Free Online Tools",
    description:
      "Free online tools for PDF editing, file conversion, productivity and more.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-900">
        <ThemeProvider>
          <Navbar />
          {children}
          <Toaster
            richColors
            position="top-right"
          />
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}