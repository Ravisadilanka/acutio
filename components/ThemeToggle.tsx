"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="rounded-xl p-2.5 text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
      aria-label="Toggle dark mode"
    >
      {/* Both icons rendered; CSS picks one to avoid a hydration mismatch. */}
      <Sun className="hidden h-5 w-5 dark:block" />
      <Moon className="h-5 w-5 dark:hidden" />
    </button>
  );
}
