import Link from "next/link";

interface Props {
  title: string;
  description: string;
  href: string;
}

export default function CategoryCard({ title, description, href }: Props) {
  return (
    <Link href={href}>
      <div className="border rounded-3xl p-5 md:p-8 hover:shadow-xl transition-all bg-white h-40">
        <h3 className="text-2xl font-semibold">{title}</h3>

        <p className="mt-3 text-gray-600">{description}</p>
      </div>
    </Link>
  );
}
