import { Metadata } from "next";
import SpeechToTextClient from "./SpeechToTextClient";

export const metadata: Metadata = {
  title: "Speech to Text Online Free",
  description:
    "Convert speech into text online for free. Supports Sinhala, English, Tamil, Hindi and more.",
};

export default function SpeechToTextPage() {
    return <SpeechToTextClient />;
}
