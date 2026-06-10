import Hero from "@/components/Hero";
import CategoryCard from "@/components/CategoryCard";

export default function Home() {
  return (
    <main>

      <Hero />

      <section className="max-w-6xl mx-auto px-6 pb-20">

        <h2 className="text-3xl font-bold mb-10">
          Categories
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

          <CategoryCard
            title="PDF Tools"
            description="Merge, split, compress and edit PDFs."
            href="/pdf-tools"
          />

          <CategoryCard
            title="Image Tools"
            description="Convert, resize and optimize images."
            href="/image-tools"
          />

          <CategoryCard
            title="Calculators"
            description="Financial, health and utility calculators."
            href="/calculators"
          />

          <CategoryCard
            title="Converters"
            description="Units, files and measurement converters."
            href="/converters"
          />

          <CategoryCard
            title="AI Tools"
            description="AI powered productivity tools."
            href="/ai-tools"
          />

        </div>
      </section>

    </main>
  );
}