import { Metadata } from "next";
import RotatePdfClient from "./RotatePdfClient";

export const metadata: Metadata = {
  title: "Rotate PDF Online Free",
  description:
    "Rotate PDF pages online. Change page orientation quickly and securely in your browser.",
};

export default function RotatePdfPage() {
  return <RotatePdfClient />;
}
