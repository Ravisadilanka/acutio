import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";

import "./globals.css";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ThemeProvider from "@/components/ThemeProvider";
import { JsonLd, siteJsonLd } from "@/lib/seo";
import { SITE_URL } from "@/lib/tools";
import { ADSENSE_CLIENT } from "@/lib/ads";

const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-inter" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Acutio – 65+ Free Online Tools for PDF, Images, Calculators & More",
    template: "%s | Acutio",
  },
  description:
    "Free online tools that run in your browser: merge & compress PDF, compress & resize images, QR code and password generators, calculators, converters and more. No sign-up, no uploads.",
  applicationName: "Acutio",
  authors: [{ name: "Acutio" }],
  creator: "Acutio",
  robots: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  openGraph: {
    title: "Acutio – 65+ Free Online Tools",
    description: "PDF, image, text, developer and everyday tools. Free, private and no sign-up.",
    url: "/",
    siteName: "Acutio",
    type: "website",
    locale: "en_US",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Acutio – free online tools" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Acutio – 65+ Free Online Tools",
    description: "PDF, image, text, developer and everyday tools. Free, private and no sign-up.",
    images: ["/og.png"],
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0d14" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="min-h-screen font-sans">
        <JsonLd data={siteJsonLd()} />
        <ThemeProvider>
          <a href="#content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-lg focus:bg-brand focus:px-4 focus:py-2 focus:text-white">
            Skip to content
          </a>
          <Navbar />
          <div id="content">{children}</div>
          <Toaster richColors position="top-right" />
          <Footer />
        </ThemeProvider>

        {/* Google AdSense — only loaded once a publisher ID is set in lib/ads.ts */}
        {ADSENSE_CLIENT && (
          <Script
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
            strategy="afterInteractive"
            crossOrigin="anonymous"
          />
        )}

        {/* Google Analytics (aggregate page-view statistics only). The ~180 KB gtag library is
            only fetched on the visitor's first interaction or after 4 s, so it never competes
            with page load (it was the largest main-thread blocker in Lighthouse). */}
        <Script id="google-analytics" strategy="afterInteractive">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','G-V8K1Y4XVBR',{anonymize_ip:true});
(function(){var done=false,ev=['pointerdown','keydown','scroll','touchstart'];function load(){if(done)return;done=true;ev.forEach(function(e){removeEventListener(e,load,{passive:true})});var s=document.createElement('script');s.async=true;s.src='https://www.googletagmanager.com/gtag/js?id=G-V8K1Y4XVBR';document.head.appendChild(s);}
ev.forEach(function(e){addEventListener(e,load,{passive:true,once:true})});setTimeout(load,4000);})();`}
        </Script>
      </body>
    </html>
  );
}
