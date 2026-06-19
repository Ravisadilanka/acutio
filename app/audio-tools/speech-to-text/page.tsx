import { Metadata } from "next";
import SpeechToTextClient from "./SpeechToTextClient";

export const metadata: Metadata = {
  title:
    "Speech to Text Online Free | Voice to Text Converter",

  description:
    "Convert speech into text online for free. Supports Sinhala, English, Tamil, Hindi, Arabic, French, German and many more languages directly in your browser.",

  keywords: [
    "speech to text",
    "voice to text",
    "speech recognition",
    "speech to text online",
    "voice typing",
    "dictation tool",
    "speech transcription",
    "sinhala speech to text",
    "english speech to text",
    "tamil speech to text",
    "hindi speech to text",
    "free speech to text",
    "voice transcription",
    "online transcription tool",
  ],

  alternates: {
    canonical:
      "https://acutio.com/audio-tools/speech-to-text",
  },

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    title:
      "Speech to Text Online Free | Voice to Text Converter",

    description:
      "Convert speech into text instantly using your browser. Supports Sinhala, English, Tamil, Hindi and many other languages.",

    url:
      "https://acutio.com/audio-tools/speech-to-text",

    siteName: "Acutio",

    type: "website",
  },

  twitter: {
    card: "summary",

    title:
      "Speech to Text Online Free | Voice to Text Converter",

    description:
      "Free speech to text tool with support for Sinhala, English, Tamil, Hindi and many other languages.",
  },
};

export default function SpeechToTextPage() {
    return <SpeechToTextClient />;
}
