interface ToolSEOProps {
  title: string;
  description: string;
  steps: string[];
  features: string[];
  faqs: {
    question: string;
    answer: string;
  }[];
}

export default function ToolSEO({
  title,
  description,
  steps,
  features,
  faqs,
}: ToolSEOProps) {
  return (
    <section className="mt-20 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold">
        {title}
      </h2>

      <p className="mt-4 text-gray-600">
        {description}
      </p>

      <h3 className="text-2xl font-semibold mt-10">
        How It Works
      </h3>

      <ol className="list-decimal pl-6 mt-4 space-y-2">
        {steps.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>

      <h3 className="text-2xl font-semibold mt-10">
        Features
      </h3>

      <ul className="list-disc pl-6 mt-4 space-y-2">
        {features.map((feature) => (
          <li key={feature}>{feature}</li>
        ))}
      </ul>

      <h3 className="text-2xl font-semibold mt-10">
        Frequently Asked Questions
      </h3>

      <div className="mt-6 space-y-6">
        {faqs.map((faq) => (
          <div key={faq.question}>
            <h4 className="font-semibold">
              {faq.question}
            </h4>

            <p className="text-gray-600 mt-2">
              {faq.answer}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}