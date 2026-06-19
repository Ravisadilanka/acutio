import { Metadata } from "next";
import TypingSpeedTestClient from "./TypingSpeedTestClient";

export const metadata: Metadata = {
  title: "Free Typing Speed Test | Check WPM & Accuracy Online",
  description:
    "Test your typing speed online for free. Measure WPM (words per minute), typing accuracy, correct and incorrect characters, and improve your keyboard skills with our real-time typing speed test.",

  keywords: [
    "typing speed test",
    "wpm test",
    "typing test",
    "typing speed checker",
    "typing accuracy test",
    "words per minute test",
    "free typing test",
    "keyboard speed test",
    "online typing test",
    "typing practice",
    "typing skills",
    "typing trainer",
    "typing challenge",
    "typing accuracy checker",
    "wpm calculator",
  ],

  openGraph: {
    title:
      "Free Typing Speed Test | Check WPM & Accuracy Online",
    description:
      "Measure typing speed, WPM, accuracy, correct and incorrect characters with our free online typing test.",
    url:
      "https://acutio.com/calculators/typing-speed-test",
    siteName: "Acutio",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title:
      "Free Typing Speed Test | Check WPM & Accuracy Online",
    description:
      "Test your typing speed online for free. Measure WPM and typing accuracy instantly.",
  },

  alternates: {
    canonical:
      "https://acutio.com/calculators/typing-speed-test",
  },
};

export default function TypingSpeedTestPage() {
    return <TypingSpeedTestClient />
}