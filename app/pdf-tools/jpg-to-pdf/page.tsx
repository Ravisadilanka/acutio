import { Metadata } from "next";
import JpgToPdfClient from "./JpgToPdfClient";

export const metadata: Metadata = {
  title: "JPG to PDF Online Free",
  description:
    "Convert JPG, PNG, and WEBP images into PDF documents online for free.",
};

export default function JpgToPdfPage() {
  return <JpgToPdfClient />;
}