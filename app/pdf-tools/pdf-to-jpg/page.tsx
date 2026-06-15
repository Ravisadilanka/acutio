import { Metadata } from "next";
import PdfToJpgClient from "./PdfToJpgClient";

export const metadata: Metadata = {
  title: "PDF to JPG Online Free",
  description:
    "Convert PDF pages into high-quality JPG images directly in your browser.",
};

export default function PdfToJpgPage(){
  return <PdfToJpgClient />;
}