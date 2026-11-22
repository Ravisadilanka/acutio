import type { Metadata } from "next";
import { getTool, getCategory, SITE_URL, SITE_NAME, CONTENT_UPDATED, type CategoryId } from "./tools";
import { getContent, commonFaqs } from "./tool-content";

const abs = (path: string) => `${SITE_URL}${path}`;

export function toolMetadata(slug: string): Metadata {
  const tool = getTool(slug);
  const c = getContent(slug);
  return {
    // "absolute" so the template doesn't append "| Acutio" past ~60 chars
    title: { absolute: `${c.title} | ${SITE_NAME}` },
    description: c.description,
    keywords: c.keywords,
    alternates: { canonical: tool.href },
    openGraph: {
      title: c.title,
      description: c.description,
      url: tool.href,
      siteName: SITE_NAME,
      type: "website",
      images: [{ url: "/og.png", width: 1200, height: 630, alt: c.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: c.title,
      description: c.description,
      images: ["/og.png"],
    },
  };
}

export function categoryMetadata(id: CategoryId): Metadata {
  const cat = getCategory(id);
  const title = `Free Online ${cat.name} – ${cat.short}`;
  return {
    title: { absolute: `${title} | ${SITE_NAME}` },
    description: cat.description,
    alternates: { canonical: cat.href },
    openGraph: { title, description: cat.description, url: cat.href, siteName: SITE_NAME, type: "website", images: ["/og.png"] },
    twitter: { card: "summary_large_image", title, description: cat.description, images: ["/og.png"] },
  };
}

/** JSON-LD graph for a tool page: WebApplication + FAQPage + BreadcrumbList + HowTo. */
export function toolJsonLd(slug: string) {
  const tool = getTool(slug);
  const cat = getCategory(tool.category);
  const c = getContent(slug);
  const faqs = [...c.faqs, ...commonFaqs(tool.name)];
  const url = abs(tool.href);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": `${url}#app`,
        name: c.h1 ?? tool.name,
        url,
        description: c.description,
        applicationCategory: tool.category === "developer" ? "DeveloperApplication" : "UtilitiesApplication",
        operatingSystem: "Any (web browser)",
        browserRequirements: "Requires JavaScript",
        isAccessibleForFree: true,
        dateModified: CONTENT_UPDATED,
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        featureList: c.features,
        publisher: { "@id": `${SITE_URL}/#org` },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: abs("/") },
          { "@type": "ListItem", position: 2, name: cat.name, item: abs(cat.href) },
          { "@type": "ListItem", position: 3, name: tool.name, item: url },
        ],
      },
      {
        "@type": "HowTo",
        name: `How to use ${tool.name}`,
        step: c.steps.map((text, i) => ({ "@type": "HowToStep", position: i + 1, text })),
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };
}

export function siteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#org`,
        name: SITE_NAME,
        url: abs("/"),
        logo: abs("/icon.svg"),
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: SITE_NAME,
        url: abs("/"),
        publisher: { "@id": `${SITE_URL}/#org` },
        // Enables the Google sitelinks search box
        potentialAction: {
          "@type": "SearchAction",
          target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/search/?q={search_term_string}` },
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };
}

export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
