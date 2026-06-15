"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] =
    useState(false);

  const closeMenu = () =>
    setOpen(false);

  return (
    <header className="border-b bg-white">
      <div
        className="
          max-w-7xl
          mx-auto
          px-6
          h-16
          flex
          items-center
          justify-between
        "
      >
        <Link href="/">
          <h1 className="font-bold text-2xl">
            Acutio
          </h1>
        </Link>

        {/* Desktop Navigation */}

        <nav
          className="
            hidden
            md:flex
            gap-6
            text-sm
            font-medium
          "
        >
          <Link href="/pdf-tools">
            PDF Tools
          </Link>

          <Link href="/image-tools">
            Image Tools
          </Link>

          <Link href="/calculators">
            Calculators
          </Link>

          <Link href="/converters">
            Converters
          </Link>

          <Link href="/ai-tools">
            AI Tools
          </Link>
        </nav>

        {/* Mobile Button */}

        <button
          onClick={() =>
            setOpen(!open)
          }
          className="md:hidden"
          aria-label="Menu"
        >
          {open ? (
            <X size={24} />
          ) : (
            <Menu size={24} />
          )}
        </button>
      </div>

      {/* Mobile Menu */}

      {open && (
        <div className="md:hidden border-t">
          <nav
            className="
              flex
              flex-col
              px-6
              py-4
              gap-4
              text-sm
              font-medium
            "
          >
            <Link
              href="/pdf-tools"
              onClick={closeMenu}
            >
              PDF Tools
            </Link>

            <Link
              href="/image-tools"
              onClick={closeMenu}
            >
              Image Tools
            </Link>

            <Link
              href="/calculators"
              onClick={closeMenu}
            >
              Calculators
            </Link>

            <Link
              href="/converters"
              onClick={closeMenu}
            >
              Converters
            </Link>

            <Link
              href="/ai-tools"
              onClick={closeMenu}
            >
              AI Tools
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}