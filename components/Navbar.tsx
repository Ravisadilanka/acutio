import Link from "next/link";

export default function Navbar() {
  return (
    <header className="border-b">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/">
          <h1 className="font-bold text-2xl">
            Acutio
          </h1>
        </Link>

        <nav className="flex gap-6 text-sm font-medium">
          <Link href="/pdf-tools">PDF Tools</Link>
          <Link href="/image-tools">Image Tools</Link>
          <Link href="/calculators">Calculators</Link>
          <Link href="/converters">Converters</Link>
          <Link href="/ai-tools">AI Tools</Link>
        </nav>
      </div>
    </header>
  );
}