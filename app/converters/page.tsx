import CategoryPage from "@/components/CategoryPage";
import { categoryMetadata } from "@/lib/seo";

export const metadata = categoryMetadata("converters");

export default function Page() {
  return <CategoryPage id="converters" />;
}
