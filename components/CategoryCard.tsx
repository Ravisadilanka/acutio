import Link from "next/link";
import { ReactNode } from "react";

interface Props {
  title: string;
  description: string;
  href: string;
  icon: ReactNode;
  color?: string;
}

export default function CategoryCard({
  title,
  description,
  href,
  icon,
  color = "bg-slate-100",
}: Props) {
  return (
    <Link href={href}>
      <div
        className={`
          ${color}
          rounded-3xl
          p-6
          h-full
          transition-all
          duration-300
          hover:scale-[1.03]
          hover:shadow-lg
          cursor-pointer
        `}
      >
        <div className="mb-4 text-3xl">
          {icon}
        </div>

        <h2 className="text-xl font-bold">
          {title}
        </h2>

        <p className="mt-2 text-sm text-gray-700">
          {description}
        </p>
      </div>
    </Link>
  );
}