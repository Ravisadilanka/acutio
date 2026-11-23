import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import Logo from "./Logo";
import { categories, toolsIn } from "@/lib/tools";

export default function Footer() {
  return (
    <footer className="mt-24 border-t bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_3fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-gray-600">
              65+ free online tools for PDFs, images, calculations, text and more. No sign-up. No uploads. No limits.
            </p>
            <p className="mt-5 inline-flex items-center gap-2 rounded-full border bg-surface px-3 py-1.5 text-xs font-medium text-gray-700">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              Your files never leave your device
            </p>
          </div>

          {/* Full internal link mesh — helps users and search engines discover every tool. */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5">
            {categories.map((c) => (
              <div key={c.id}>
                <Link prefetch={false} href={c.href} className="text-sm font-semibold text-gray-900 hover:text-brand-ink">
                  {c.name}
                </Link>
                <ul className="mt-3 space-y-2">
                  {toolsIn(c.id).slice(0, 6).map((t) => (
                    <li key={t.slug}>
                      <Link prefetch={false} href={t.href} className="text-sm text-gray-600 hover:text-brand-ink">
                        {t.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t pt-6 text-sm text-gray-500 md:flex-row">
          <p>© {new Date().getFullYear()} Acutio. Free tools for everyone.</p>
          <div className="flex flex-wrap justify-center gap-5">
            <Link prefetch={false} href="/about-us/" className="hover:text-gray-900">About</Link>
            <Link prefetch={false} href="/contact-us/" className="hover:text-gray-900">Contact</Link>
            <Link prefetch={false} href="/privacy-policy/" className="hover:text-gray-900">Privacy</Link>
            <Link prefetch={false} href="/terms-and-conditions/" className="hover:text-gray-900">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
