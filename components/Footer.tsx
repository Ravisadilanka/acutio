import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t mt-20">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-lg font-bold">
              Acutio
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              Smart online tools for everyday productivity.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
            <Link
              href="/about-us"
              className="hover:text-black"
            >
              About Us
            </Link>

            <Link
              href="/contact-us"
              className="hover:text-black"
            >
              Contact Us
            </Link>

            <Link
              href="/privacy-policy"
              className="hover:text-black"
            >
              Privacy Policy
            </Link>

            <Link
              href="/terms-and-conditions"
              className="hover:text-black"
            >
              Terms & Conditions
            </Link>
          </div>
        </div>

        <div className="border-t mt-8 pt-6 text-center text-sm text-gray-500">
          © 2026 Acutio. All rights reserved.
        </div>
      </div>
    </footer>
  );
}