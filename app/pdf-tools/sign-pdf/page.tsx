import { Metadata } from "next";
import SignPdfClient from "./SignPdfClient";

export const metadata: Metadata = {
  title: "Sign PDF Online Free",
  description:
    "Draw or upload your signature and sign PDF documents online securely.",
};

export default function SignPdfPage() {
  return <SignPdfClient />;
}
