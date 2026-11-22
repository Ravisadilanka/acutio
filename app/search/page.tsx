import type { Metadata } from "next";
import { Suspense } from "react";
import SearchResults from "./SearchResults";

export const metadata: Metadata = {
  title: "Search Tools",
  robots: { index: false, follow: true },
};

export default function SearchPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <Suspense>
        <SearchResults />
      </Suspense>
    </main>
  );
}
