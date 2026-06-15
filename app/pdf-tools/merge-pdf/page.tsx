import { Metadata } from "next";
import MergePdfClient from "./MergePdfClient";

export const metadata: Metadata = {
  title: "Merge PDF Online Free",
  description:
    "Merge PDF files online for free. Combine multiple PDF documents into a single PDF directly in your browser.",
};

export default function MergePdfPage() {
  return <MergePdfClient />;
}
