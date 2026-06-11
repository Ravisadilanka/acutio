"use client";

import { useState } from "react";

const tools = [
  "Merge PDF",
  "Split PDF",
  "Compress PDF",
  "PDF to JPG",
  "JPG to PDF",
  "Rotate PDF",
  "Protect PDF",
  "Unlock PDF",
  "Delete Pages",
  "Reorder Pages",
];

export default function Hero() {
  const [search, setSearch] = useState("");

  const filteredTools = tools.filter((tool) =>
    tool.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="py-24">
      <div className="max-w-5xl mx-auto px-6 text-center">

        <h1 className="text-6xl font-bold">
          All Your Essential
          <br />
          Online Tools TEST
        </h1>

        <p className="mt-6 text-xl text-gray-600">
          Edit PDFs, convert images, calculate values,
          generate files and simplify your workflow.
        </p>

        <div className="mt-10 max-w-xl mx-auto">
          <input
            type="text"
            value={search}
            // onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tools..."
            className="w-full border rounded-2xl px-5 py-4 shadow-sm"
          />

          {search && (
            <div className="mt-2 border rounded-xl bg-white text-left shadow-lg">
              {filteredTools.length > 0 ? (
                filteredTools.map((tool) => (
                  <div
                    key={tool}
                    className="px-4 py-3 hover:bg-gray-100 cursor-pointer"
                  >
                    {tool}
                  </div>
                ))
              ) : (
                <div className="px-4 py-3 text-gray-500">
                  No tools found
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </section>
  );
}