import type { Metadata } from "next";
import CategoryCard from "@/components/CategoryCard";

import { Mic, Volume2, AudioLines, Scissors } from "lucide-react";

export const metadata: Metadata = {
  title: "Audio Tools",
  description:
    "Free audio tools including speech to text, text to speech, audio conversion, voice recording and audio editing. Fast, secure and easy to use.",
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
