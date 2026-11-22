import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getCategory, type Tool } from "@/lib/tools";

export default function ToolCard({ tool }: { tool: Tool }) {
  const cat = getCategory(tool.category);
  const Icon = tool.icon;
  return (
    <Link
      href={tool.href}
      className="group card relative flex h-full gap-4 p-5 transition duration-200 hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-xl hover:shadow-brand/5"
    >
      <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${cat.tint}`}>
        <Icon className="h-5 w-5" />
      </span>
      <span className="min-w-0">
        <span className="flex items-center gap-2 font-semibold text-gray-900">
          {tool.name}
          {tool.isNew && <span className="rounded-full bg-brand-soft px-1.5 py-0.5 text-[10px] font-bold uppercase text-brand">New</span>}
        </span>
        <span className="mt-1 block text-sm leading-snug text-gray-500">{tool.description}</span>
      </span>
      <ArrowUpRight className="absolute right-4 top-4 h-4 w-4 text-gray-300 opacity-0 transition group-hover:opacity-100" />
    </Link>
  );
}
