"use client";

import { useEffect, useRef, useState } from "react";
import { languages } from "./util/languages";
import ToolSEO from "@/components/ToolSEO";

declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

export default function SpeechToTextPage() {
  const [text, setText] = useState("");
  const [language, setLanguage] = useState("en-US");
  const [recording, setRecording] = useState(false);
  const [supported, setSupported] = useState(true);

  const recognitionRef = useRef<any>(null);
  const shouldKeepRecordingRef = useRef(false);
  const languageRef = useRef(language);

  useEffect(() => {
    languageRef.current = language;
  }, [language]);

    useEffect(() => {
  const saved =
    localStorage.getItem(
      "stt-language"
    );

  if (saved) {
    setLanguage(saved);
  }
}, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const SpeechRecognitionAPI =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      setSupported(false);
      return;
    }


    const recognition = new SpeechRecognitionAPI();

    // continuous = true so it doesn't stop after a single phrase/pause
    recognition.continuous = true;

    // interimResults = true forces the engine to report speech more
    // eagerly instead of silently batching/discarding it while deciding
    // on a final result. We still only commit isFinal results to text.
    recognition.interimResults = true;

    recognition.onresult = (event: any) => {
      let finalTranscript = "";

      // only read NEW results (resultIndex onward) since results
      // accumulate across the whole session in continuous mode
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }

      if (finalTranscript.trim()) {
        setText((prev) =>
          prev.trim() ? `${prev} ${finalTranscript}` : finalTranscript,
        );
      }
    };

    recognition.onend = () => {
      // Chrome/Edge end the session on their own after silence or a time
      // limit even in continuous mode. If the user hasn't pressed Stop,
      // restart automatically instead of just dying silently.
      if (shouldKeepRecordingRef.current) {
        try {
          recognition.lang = languageRef.current;
          recognition.start();
        } catch {
          setRecording(false);
        }
      } else {
        setRecording(false);
      }
    };

    recognition.onerror = (event: any) => {
      // "no-speech" and "audio-capture" are recoverable - onend fires
      // right after this and restart() above handles it.
      if (event.error === "no-speech" || event.error === "audio-capture") {
        return;
      }

      // Anything else (not-allowed, network, aborted, etc.) - stop for real
      shouldKeepRecordingRef.current = false;
      setRecording(false);
    };

    recognitionRef.current = recognition;

    return () => {
      shouldKeepRecordingRef.current = false;
      try {
        recognition.stop();
      } catch {}
    };
  }, []);

  const startRecording = () => {
    if (!recognitionRef.current) {
      return;
    }

    recognitionRef.current.lang = language;
    shouldKeepRecordingRef.current = true;

    try {
      recognitionRef.current.start();
      setRecording(true);
    } catch {
      // start() throws if already started; ignore
    }
  };

  const stopRecording = () => {
    shouldKeepRecordingRef.current = false;
    recognitionRef.current?.stop();

    setRecording(false);
  };

  const copyText = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {}
  };

  const downloadText = () => {
    const blob = new Blob([text], {
      type: "text/plain",
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;
    a.download = "speech-to-text.txt";

    a.click();

    URL.revokeObjectURL(url);
  };

  const wordCount = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;

  if (!supported) {
    return (
      <main className="max-w-5xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold">Speech to Text</h1>

        <p className="mt-6 text-red-500">
          Speech recognition is not supported in this browser. Please use
          Chrome, Edge or Brave.
        </p>
      </main>
    );
  }

  return (
    <main className="max-w-5xl mx-auto px-6 py-16">
      <h1 className="text-3xl md:text-5xl font-bold mb-8">Speech to Text</h1>

      <p className="mt-4 text-gray-500">
        Convert speech into text using your browser. Supports Sinhala, English,
        Tamil, Hindi and many more languages.
      </p>

      <div className="mt-8">
        <label className="block font-medium mb-2">Language</label>

        <select
          value={language}
          onChange={(e) => {
  const newLang =
    e.target.value;

  setLanguage(newLang);

  localStorage.setItem(
    "stt-language",
    newLang
  );
}}
          className="border rounded-xl px-4 py-3"
        >
          {languages
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
        </select>
      </div>

      <div className="flex flex-wrap gap-4 mt-8">
        <button
  onClick={startRecording}
  disabled={recording}
  className={
    recording
      ? "bg-red-600 text-white px-6 py-3 rounded-xl"
      : "bg-black text-white px-6 py-3 rounded-xl"
  }
>
  {recording ? "Recording..." : "Start Recording"}
</button>

        <button
          onClick={stopRecording}
          disabled={!recording}
          className="border px-6 py-3 rounded-xl"
        >
          Stop Recording
        </button>

        <button onClick={copyText} className="border px-6 py-3 rounded-xl">
          Copy
        </button>

        <button onClick={downloadText} className="border px-6 py-3 rounded-xl">
          Download TXT
        </button>

        <button
          onClick={() => setText("")}
          className="border px-6 py-3 rounded-xl"
        >
          Clear
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mt-8">
        <div className="border rounded-2xl p-6">
          <p className="text-gray-500">Words</p>
          <p className="text-2xl font-bold">{wordCount}</p>
        </div>

        <div className="border rounded-2xl p-6">
          <p className="text-gray-500">Characters</p>
          <p className="text-2xl font-bold">{text.length}</p>
        </div>

        <div className="border rounded-2xl p-6">
          <p className="text-gray-500">Status</p>
          <p className="text-2xl font-bold">
            {recording ? "Recording" : "Idle"}
          </p>
        </div>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Your speech will appear here..."
        className="
          w-full
          mt-8
          min-h-[350px]
          border
          rounded-2xl
          p-4
          outline-none
        "
      />

      <ToolSEO
        title="Speech to Text Online Free"
        description="Convert speech into text online for free. Supports Sinhala, English, Tamil, Hindi, Arabic, French, German and many other languages directly in your browser."
        steps={[
          "Select your language",
          "Click Start Recording",
          "Speak into your microphone",
          "View the live transcription",
          "Stop recording when finished",
          "Copy, edit or download the generated text",
        ]}
        features={[
          "Supports Sinhala speech to text",
          "Supports English, Tamil, Hindi and 70+ languages",
          "Start and stop recording anytime",
          "Continue recording without losing previous text",
          "Live voice transcription",
          "Copy text to clipboard",
          "Download transcription as TXT",
          "Word and character counter",
          "No registration required",
          "Browser-based processing",
        ]}
        faqs={[
          {
            question: "How does speech to text work?",
            answer:
              "The tool uses your browser's speech recognition engine to convert spoken words into editable text in real time.",
          },
          {
            question: "Does this support Sinhala speech recognition?",
            answer:
              "Yes. You can select Sinhala (si-LK) and convert Sinhala speech into text directly in your browser.",
          },
          {
            question: "Can I stop recording and continue later?",
            answer:
              "Yes. You can stop recording at any time and start again later. New speech is appended to the existing text.",
          },
          {
            question: "Are my recordings uploaded to a server?",
            answer:
              "No. Speech recognition is handled by your browser and no audio files are uploaded by Acutio.",
          },
          {
            question: "Which languages are supported?",
            answer:
              "The tool supports English, Sinhala, Tamil, Hindi, Arabic, French, German, Spanish, Chinese and many other languages supported by your browser.",
          },
          {
            question: "Is this speech to text tool free?",
            answer:
              "Yes. The Acutio Speech to Text tool is completely free to use.",
          },
        ]}
      />
    </main>
  );
}
