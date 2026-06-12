export default function ContactUsPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="text-5xl font-bold mb-8">
        Contact Us
      </h1>

      <div className="space-y-6 text-lg">
        <p>
          If you have questions, suggestions, or encounter
          any issues while using Acutio, we'd love to hear
          from you.
        </p>

        <div className="border rounded-2xl p-6">
          <h2 className="font-semibold text-xl mb-2">
            Support Email
          </h2>

          <p>support@acutio.com</p>
        </div>

        <div className="border rounded-2xl p-6">
          <h2 className="font-semibold text-xl mb-2">
            Response Time
          </h2>

          <p>
            We aim to respond to all inquiries within 24-48
            hours.
          </p>
        </div>
      </div>
    </main>
  );
}