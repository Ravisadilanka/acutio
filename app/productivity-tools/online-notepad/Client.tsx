"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Download } from "lucide-react";
import { CopyButton, downloadText } from "@/components/ui/kit";
import { usePersistentState } from "@/lib/local";

interface Note { id: string; text: string; updated: number }

const title = (n: Note) => n.text.trim().split("\n")[0].slice(0, 40) || "Untitled note";

export default function Client() {
  const [notes, setNotes, loaded] = usePersistentState<Note[]>("notepad", []);
  const [activeId, setActiveId] = useState<string>("");
  const [saved, setSaved] = useState(true);

  useEffect(() => {
    if (!loaded) return; // wait until saved notes are read, or we'd overwrite them
    if (!notes.length) {
      const n = { id: crypto.randomUUID?.() ?? String(Date.now()), text: "", updated: Date.now() };
      setNotes([n]);
      setActiveId(n.id);
    } else if (!notes.find((n) => n.id === activeId)) setActiveId(notes[0].id);
  }, [notes, activeId, setNotes, loaded]);

  const active = notes.find((n) => n.id === activeId);
  const update = (text: string) => {
    setSaved(false);
    setNotes(notes.map((n) => (n.id === activeId ? { ...n, text, updated: Date.now() } : n)));
    setTimeout(() => setSaved(true), 400);
  };
  const add = () => {
    const n = { id: crypto.randomUUID?.() ?? String(Date.now()), text: "", updated: Date.now() };
    setNotes([n, ...notes]);
    setActiveId(n.id);
  };
  const remove = (id: string) => {
    if (!confirm("Delete this note? This cannot be undone.")) return;
    setNotes(notes.filter((n) => n.id !== id));
  };

  const words = active?.text.trim() ? active.text.trim().split(/\s+/).length : 0;

  return (
    <div className="grid gap-4 md:grid-cols-[240px_1fr]">
      <aside className="card flex max-h-[560px] flex-col overflow-hidden">
        <button className="btn-primary m-3" onClick={add}><Plus className="h-4 w-4" /> New note</button>
        <ul className="flex-1 overflow-y-auto px-2 pb-2">
          {[...notes].sort((a, b) => b.updated - a.updated).map((n) => (
            <li key={n.id}>
              <button onClick={() => setActiveId(n.id)} className={`group flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-sm ${n.id === activeId ? "bg-brand-soft text-brand-ink" : "text-gray-700 hover:bg-gray-50"}`}>
                <span className="min-w-0">
                  <span className="block truncate font-medium">{title(n)}</span>
                  <span className="block text-xs opacity-70">{new Date(n.updated).toLocaleString(undefined, { dateStyle: "short", timeStyle: "short" })}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </aside>
      <div>
        <textarea
          className="textarea min-h-[480px] font-sans text-base leading-relaxed"
          value={active?.text ?? ""}
          onChange={(e) => update(e.target.value)}
          placeholder="Start typing… your notes save automatically in this browser."
          aria-label="Note"
          autoFocus
        />
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <CopyButton text={active?.text ?? ""} />
          <button className="btn-secondary px-3 py-2" onClick={() => active && downloadText(active.text, `${title(active).replace(/[^\w-]+/g, "_")}.txt`)} disabled={!active?.text}><Download className="h-4 w-4" /> .txt</button>
          {active && notes.length > 0 && <button className="btn-ghost px-3 py-2 text-rose-500" onClick={() => remove(active.id)}><Trash2 className="h-4 w-4" /> Delete</button>}
          <span className="ml-auto text-sm text-gray-500">{words} words · {saved ? "Saved on this device ✓" : "Saving…"}</span>
        </div>
      </div>
    </div>
  );
}
