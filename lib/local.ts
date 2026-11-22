"use client";

/**
 * Tiny helpers for preferences stored ONLY in the visitor's own browser
 * (localStorage). Nothing here is ever sent to a server.
 */
import { useCallback, useEffect, useState } from "react";

const RECENT = "acutio:recent";
const FAVS = "acutio:favorites";

function read(key: string): string[] {
  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch {
    return [];
  }
}

function write(key: string, value: string[]) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new Event("acutio:storage"));
  } catch {
    /* storage may be disabled */
  }
}

export function trackRecent(slug: string) {
  write(RECENT, [slug, ...read(RECENT).filter((s) => s !== slug)].slice(0, 8));
}

function useList(key: string) {
  const [list, setList] = useState<string[]>([]);
  useEffect(() => {
    const sync = () => setList(read(key));
    sync();
    window.addEventListener("acutio:storage", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("acutio:storage", sync);
      window.removeEventListener("storage", sync);
    };
  }, [key]);
  return list;
}

export const useRecent = () => useList(RECENT);

export function useFavorites() {
  const favs = useList(FAVS);
  const toggle = useCallback((slug: string) => {
    const cur = read(FAVS);
    write(FAVS, cur.includes(slug) ? cur.filter((s) => s !== slug) : [slug, ...cur]);
  }, []);
  return { favs, toggle };
}

/** useState that persists to localStorage (for tool settings). */
export function usePersistentState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(`acutio:${key}`);
      if (raw !== null) setValue(JSON.parse(raw));
    } catch {}
    setLoaded(true);
  }, [key]);
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(`acutio:${key}`, JSON.stringify(value));
    } catch {}
  }, [key, value, loaded]);
  return [value, setValue, loaded] as const;
}
