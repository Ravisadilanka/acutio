import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Acutio | Free Online Tools Platform",

  description:
    "Learn more about Acutio, our mission, and our growing collection of free online tools for PDF editing, image optimization, calculators, converters, productivity, and everyday tasks.",

  keywords: [
    "about acutio",
    "acutio",
    "free online tools",
    "pdf tools",
    "image tools",
    "online calculators",
    "file converters",
    "productivity tools",
    "browser tools",
    "free utilities",
  ],

  authors: [
    {
      name: "Acutio",
    },
  ],

  creator: "Acutio",

  publisher: "Acutio",

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  alternates: {
    canonical:
      "https://acutio.com/about-us",
  },

  openGraph: {
    title:
      "About Acutio | Free Online Tools Platform",

    description:
      "Discover Acutio's mission to provide free, fast, and privacy-friendly online tools for everyone.",

    url: "https://acutio.com/about-us",

    siteName: "Acutio",

    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title:
      "About Acutio | Free Online Tools Platform",

    description:
      "Learn more about Acutio and our mission to build free online tools for everyday tasks.",
  },
};

<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context":
        "https://schema.org",
      "@type":
        "Organization",
      name: "Acutio",
      url: "https://acutio.com",
      description:
        "Acutio provides free online tools for PDF editing, image optimization, calculators, converters and productivity.",
    }),
  }}
/>


export default function AboutUsPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="text-3xl md:text-5xl font-bold mb-8">About Acutio</h1>

      <p className="text-gray-500 mb-10">
        Smart online tools built for productivity.
      </p>

      <div className="space-y-8">
        <section>
          <p>
            Acutio is an online platform dedicated to providing simple,
            powerful, and accessible tools that help people work more
            efficiently.
          </p>

          <p className="mt-4">
            Our goal is to eliminate the need for complicated software by
            offering fast, browser-based solutions that anyone can use from
            anywhere.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Our Mission</h2>

          <p>
            We believe productivity tools should be simple, reliable, and
            accessible to everyone. Acutio is built to help users complete
            everyday tasks quickly without unnecessary complexity.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">What We Build</h2>

          <p>
            Acutio provides a growing collection of online tools designed to
            simplify digital workflows.
          </p>

          <ul className="list-disc pl-6 mt-3 space-y-2">
            <li>Document and file management tools</li>
            <li>Conversion and optimization tools</li>
            <li>Productivity utilities</li>
            <li>Developer and business tools</li>
            <li>Future AI-powered solutions</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Why Acutio?</h2>

          <p>
            Many online tools are cluttered with unnecessary features, slow
            performance, or confusing interfaces. Acutio focuses on delivering a
            clean, fast, and user-friendly experience that helps users get
            things done efficiently.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Our Vision</h2>

          <p>
            We are building Acutio into a comprehensive platform that brings
            together useful digital tools across multiple categories. Our vision
            is to create a single destination where individuals, professionals,
            students, and businesses can find practical tools to improve
            productivity and save time.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Contact</h2>

          <p>
            Have questions, suggestions, or feedback? We'd love to hear from you
            through our Contact Us page.
          </p>
        </section>
      </div>
    </main>
  );
}
