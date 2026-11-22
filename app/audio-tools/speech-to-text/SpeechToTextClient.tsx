"use client";

import { useEffect, useRef, useState } from "react";
import { languages } from "./util/languages";

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
      <div className="card p-6">
        <p className="text-rose-500">
          Speech recognition is not supported in this browser. Please use
          Chrome, Edge or Safari.
        </p>
      </div>
    );
  }

  return (
    <div>
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
      : "bg-brand text-white px-6 py-3 rounded-xl"
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

    </div>
  );
}
