import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Read the Acutio Privacy Policy and learn how we protect your information.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="text-3xl md:text-5xl font-bold mb-8 mb-8">
        Privacy Policy
      </h1>

      <p className="text-gray-500 mb-10">Last Updated: June 2026</p>

      <div className="space-y-8">
        <section>
          <p>
            At Acutio, we value your privacy and are committed to protecting
            your personal information. This Privacy Policy explains how we
            collect, use, and protect information when you use our website and
            online tools.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">
            1. Information We Collect
          </h2>

          <p>
            We may collect information that you voluntarily provide when
            contacting us, along with technical information such as browser
            type, device information, IP address, and website usage data.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">2. File Processing</h2>

          <p>Many Acutio tools allow users to upload files for processing.</p>

          <ul className="list-disc pl-6 mt-3 space-y-2">
            <li>
              Uploaded files are used solely to perform the requested operation.
            </li>
            <li>We do not sell, rent, or share uploaded files.</li>
            <li>We do not use uploaded content for advertising purposes.</li>
            <li>Files may be automatically removed after processing.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">3. Cookies</h2>

          <p>
            Acutio may use cookies and similar technologies to improve website
            performance, remember user preferences, analyze traffic, and enhance
            user experience.
          </p>

          <p className="mt-3">
            You can disable cookies through your browser settings if desired.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">4. Analytics</h2>

          <p>
            We may use analytics services to better understand how visitors
            interact with our website.
          </p>

          <ul className="list-disc pl-6 mt-3 space-y-2">
            <li>Pages visited</li>
            <li>Device type</li>
            <li>Browser type</li>
            <li>Country or region</li>
            <li>Referral sources</li>
          </ul>

          <p className="mt-3">
            This information helps us improve our services and user experience.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">
            5. Third-Party Services
          </h2>

          <p>
            Acutio may use trusted third-party providers for website hosting,
            analytics, security monitoring, performance optimization, and other
            operational purposes.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">6. Data Security</h2>

          <p>
            We implement reasonable security measures designed to protect
            information from unauthorized access, alteration, disclosure, or
            destruction.
          </p>

          <p className="mt-3">
            However, no internet-based service can guarantee absolute security.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">7. Children's Privacy</h2>

          <p>
            Acutio is not directed toward children under the age of 13, and we
            do not knowingly collect personal information from children.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">8. Your Rights</h2>

          <p>
            Depending on your location, you may have rights regarding your
            personal information, including:
          </p>

          <ul className="list-disc pl-6 mt-3 space-y-2">
            <li>Request access to your data</li>
            <li>Request corrections</li>
            <li>Request deletion of personal data</li>
            <li>Object to certain processing activities</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">
            9. Changes to This Policy
          </h2>

          <p>
            We may update this Privacy Policy periodically. Any changes will be
            posted on this page with an updated revision date.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">10. Contact Us</h2>

          <p>
            If you have any questions regarding this Privacy Policy, please
            contact us through our Contact Us page.
          </p>
        </section>
      </div>
    </main>
  );
}
