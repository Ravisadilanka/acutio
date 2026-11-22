import { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/privacy-policy/" },
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

          <p>
            Acutio tools run entirely inside your web browser. Files, text and
            recordings you use with our tools are processed on your own device
            and are never uploaded to or stored on Acutio servers.
          </p>

          <ul className="list-disc pl-6 mt-3 space-y-2">
            <li>We never receive, see, store, sell or share the files or text you process.</li>
            <li>Results exist only in your browser until you download them or close the tab.</li>
            <li>
              Some tools (such as the online notepad, favourites and recently
              used tools) save preferences in your browser&apos;s local storage on
              your own device. You can clear this at any time in your browser
              settings.
            </li>
            <li>
              The Speech to Text tool uses your browser&apos;s built-in speech
              recognition. Some browsers (for example Google Chrome) send audio
              to their own provider to recognise speech; this is handled by
              your browser, not by Acutio.
            </li>
            <li>
              The Audio to Text tool downloads an open-source speech recognition
              model (OpenAI Whisper) from Hugging Face the first time you use
              it, and your browser saves it for later. Hugging Face can see that
              your browser requested the model, but your audio is transcribed on
              your device and is never uploaded.
            </li>
            <li>
              The Currency Converter downloads a public table of exchange rates
              from ExchangeRate-API (open.er-api.com). Like any website request,
              that service can see your IP address, but the amounts you convert
              are calculated on your device and never sent.
            </li>
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
            We use Google Analytics (with IP anonymisation) to count visits and
            understand which tools are popular. Analytics never receives the
            contents of your files or text — only general usage data such as:
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
          <h2 className="text-2xl font-semibold mb-3">Advertising</h2>

          <p>
            Acutio is free because it is supported by advertising. We use Google
            AdSense to show ads. Ads never have access to the files or text you
            use with our tools — those stay on your device.
          </p>

          <ul className="list-disc pl-6 mt-3 space-y-2">
            <li>
              Third-party vendors, including Google, use cookies to serve ads
              based on your prior visits to this website or other websites.
            </li>
            <li>
              Google&apos;s use of advertising cookies enables it and its
              partners to serve ads to you based on your visits to this site
              and/or other sites on the Internet.
            </li>
            <li>
              You may opt out of personalised advertising by visiting{" "}
              <a className="text-brand underline" href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">Google Ads Settings</a>
              . You can also opt out of some third-party vendors&apos; use of
              cookies for personalised advertising at{" "}
              <a className="text-brand underline" href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer">www.aboutads.info</a>
              .
            </li>
            <li>
              Learn more about{" "}
              <a className="text-brand underline" href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer">how Google uses information from sites that use its services</a>
              .
            </li>
            <li>
              Visitors in the European Economic Area, the UK and Switzerland are
              asked for consent before personalised ads or advertising cookies
              are used.
            </li>
          </ul>
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
