export default function SoftwareSchema({
  name,
  description,
}: {
  name: string;
  description: string;
}) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context":
            "https://schema.org",
          "@type":
            "SoftwareApplication",
          name,
          applicationCategory:
            "UtilityApplication",
          operatingSystem:
            "Web Browser",
          offers: {
            "@type":
              "Offer",
            price: "0",
          },
          description,
        }),
      }}
    />
  );
}