"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import ToolSEO from "@/components/ToolSEO";
import { useRef } from "react";

import StatsCard from "./components/StatsCard";
import TimerSelector from "./components/TimerSelector";

import { paragraphs } from "./paragraphs";

import { calculateWPM } from "./utils/calculateWPM";
import { calculateAccuracy } from "./utils/calculateAccuracy";

export default function TypingSpeedTestPage() {
  const [duration, setDuration] =
    useState(60);

  const [timeLeft, setTimeLeft] =
    useState(60);

  const [started, setStarted] =
    useState(false);

  const [finished, setFinished] =
    useState(false);

  const [input, setInput] =
    useState("");

    const typingAreaRef =
  useRef<HTMLDivElement>(null);

  const [text, setText] =
    useState(
      paragraphs[
        Math.floor(
          Math.random() *
            paragraphs.length
        )
      ]
    );

  useEffect(() => {
    setTimeLeft(duration);
  }, [duration]);

  useEffect(() => {
    if (
      !started ||
      finished
    ) {
      return;
    }

    const timer =
      setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setFinished(
              true
            );

            clearInterval(
              timer
            );

            return 0;
          }

          return prev - 1;
        });
      }, 1000);

    return () =>
      clearInterval(timer);
  }, [started, finished]);

  const handleKeyDown = (
  e: React.KeyboardEvent
) => {
  if (finished) {
    return;
  }

  if (!started) {
    setStarted(true);
  }

  if (e.key === "Backspace") {
    setInput((prev) =>
      prev.slice(0, -1)
    );

    return;
  }

  if (e.key.length === 1) {
    if (
      input.length <
      text.length
    ) {
      setInput(
        (prev) =>
          prev + e.key
      );
    }
  }

  e.preventDefault();
};

  const correctChars =
    useMemo(() => {
      let count = 0;

      for (
        let i = 0;
        i < input.length;
        i++
      ) {
        if (
          input[i] ===
          text[i]
        ) {
          count++;
        }
      }

      return count;
    }, [input, text]);

    const incorrectChars =
  input.length -
  correctChars;

  const accuracy =
    calculateAccuracy(
      correctChars,
      input.length
    );

  const elapsed =
    duration - timeLeft;

  const wpm =
    calculateWPM(
      correctChars,
      elapsed
    );

  const restart = () => {
    setInput("");
    setStarted(false);
    setFinished(false);

    setTimeLeft(duration);

    setTimeout(() => {
  typingAreaRef.current?.focus();
}, 100);

    setText(
      paragraphs[
        Math.floor(
          Math.random() *
            paragraphs.length
        )
      ]
    );
  };

  useEffect(() => {
  typingAreaRef.current?.focus();
}, []);

  return (
    <main className="max-w-6xl mx-auto px-6 py-16">
      <h1 className="text-3xl md:text-5xl font-bold mb-8">
        Typing Speed Test
      </h1>

      <p className="mt-4 text-gray-500">
        Measure your typing
        speed, WPM and
        accuracy.
      </p>

      <div className="mt-8">
        <TimerSelector
          value={duration}
          onChange={(
            value
          ) => {
            setDuration(
              value
            );

            restart();
          }}
        />
      </div>

      <div
  ref={typingAreaRef}
  tabIndex={0}
  onKeyDown={handleKeyDown}
  className="
    mt-8
    border
    rounded-2xl
    p-8
    min-h-[220px]
    bg-gray-50
    outline-none
    cursor-text
    text-2xl
    leading-10
    font-mono
    select-none
  "
>
  {text
    .split("")
    .map(
      (
        char,
        index
      ) => {
        let className =
          "text-gray-400";

        if (
          index <
          input.length
        ) {
          className =
            input[index] ===
            char
              ? "text-green-600"
              : "text-red-500";
        }

        const isCurrent =
          index ===
          input.length;

        return (
          <span
            key={index}
            className={`${className} ${
              isCurrent
                ? "border-l-2 border-black animate-pulse"
                : ""
            }`}
          >
            {char}
          </span>
        );
      }
    )}
</div>

<p className="mt-3 text-sm text-gray-500">
  Click the typing area and start typing
</p>

      <div className="grid md:grid-cols-6 gap-6 mt-8">
        <StatsCard
          label="WPM"
          value={wpm}
        />

        <StatsCard
          label="Accuracy"
          value={`${accuracy}%`}
        />

        <StatsCard
          label="Time Left"
          value={`${timeLeft}s`}
        />

        <StatsCard
          label="Characters"
          value={
            input.length
          }
        />

        <StatsCard
  label="Correct"
  value={correctChars}
/>

<StatsCard
  label="Incorrect"
  value={incorrectChars}
/>
      </div>

      <button
        onClick={restart}
        className="
          mt-8
          bg-black
          text-white
          px-6
          py-3
          rounded-xl
        "
      >
        Restart Test
      </button>

      <ToolSEO
        title="Typing Speed Test"
        description="Check your typing speed, WPM and accuracy online for free."
        steps={[
          "Choose a timer",
          "Start typing",
          "Complete the test",
          "Review your score",
        ]}
        features={[
          "Live WPM",
          "Accuracy tracking",
          "Multiple timers",
          "Typing practice",
        ]}
        faqs={[
          {
            question:
              "What is WPM?",
            answer:
              "WPM stands for words per minute and measures typing speed.",
          },
          {
            question:
              "Is this test free?",
            answer:
              "Yes, it is completely free.",
          },
        ]}
      />
    </main>
  );
}