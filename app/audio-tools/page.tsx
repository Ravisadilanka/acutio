import type { Metadata } from "next";
import CategoryCard from "@/components/CategoryCard";

import { Mic, Volume2, AudioLines, Scissors } from "lucide-react";

export const metadata: Metadata = {
  title: "Audio Tools | Free Online Audio Utilities",

  description:
    "Free audio tools including speech to text, text to speech, audio conversion, voice recording, audio editing and more. Fast, secure and easy to use.",

  keywords: [
    "audio tools",
    "speech to text",
    "text to speech",
    "audio converter",
    "voice recorder",
    "audio editor",
    "mp3 converter",
    "wav converter",
    "free audio tools",
    "online audio tools",
  ],

  alternates: {
    canonical:
      "https://acutio.com/audio-tools",
  },

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    title:
      "Audio Tools | Free Online Audio Utilities",

    description:
      "Convert, record, edit and process audio files online with free audio tools from Acutio.",

    url:
      "https://acutio.com/audio-tools",

    siteName: "Acutio",

    type: "website",
  },

  twitter: {
    card: "summary",

    title:
      "Audio Tools | Free Online Audio Utilities",

    description:
      "Free audio tools including speech to text, text to speech, audio conversion and more.",
  },
};

export default function AudioToolsPage() {
  return (
    <main className="max-w-6xl mx-auto px-6 py-20">
      <h1 className="text-3xl md:text-5xl font-bold mb-8">Audio Tools</h1>

      <p className="mt-4 text-gray-600">
        Free audio, voice and speech processing tools for productivity, content
        creation and accessibility.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
        <CategoryCard
          title="Speech to Text"
          description="Convert voice recordings and live speech into editable text."
          href="/audio-tools/speech-to-text"
          icon={<Mic size={32} />}
          color="bg-cyan-100"
        />

        <CategoryCard
          title="Text to Speech"
          description="Convert written text into natural sounding speech."
          href="/audio-tools/text-to-speech"
          icon={<Volume2 size={32} />}
          color="bg-blue-100"
        />

        <CategoryCard
          title="Audio Converter"
          description="Convert audio files between popular formats."
          href="/audio-tools/audio-converter"
          icon={<AudioLines size={32} />}
          color="bg-purple-100"
        />

        <CategoryCard
          title="Audio Cutter"
          description="Trim and cut audio files directly in your browser."
          href="/audio-tools/audio-cutter"
          icon={<Scissors size={32} />}
          color="bg-orange-100"
        />
      </div>
    </main>
  );
}
