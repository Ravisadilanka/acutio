import { Metadata } from "next";
import SplitPdfClient from "./SplitPdfClient";

export const metadata: Metadata = {
  title: "Split PDF Online Free",
  description:
    "Split PDF files into separate pages or custom page ranges. Fast and secure browser-based PDF splitter.",
};

export default function SplitPdfPage() {
  return <SplitPdfClient />;
}
