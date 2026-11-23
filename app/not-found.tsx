import Link from "next/link";
import ToolCard from "@/components/tool/ToolCard";
import { popularTools } from "@/lib/tools";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-20 text-center sm:px-6">
      <p className="text-sm font-semibold text-brand-ink">404</p>
      <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-gray-900">This page doesn&apos;t exist</h1>
      <p className="mt-3 text-gray-600">But one of these popular tools might be what you need.</p>
      <div className="mt-10 grid gap-4 text-left sm:grid-cols-2 lg:grid-cols-3">
        {popularTools().slice(0, 9).map((t) => (
          <ToolCard key={t.slug} tool={t} />
        ))}
      </div>
      <Link href="/" className="btn-primary mt-10">
        Back to home
      </Link>
    </main>
  );
}
