import CategoryPage from "@/components/CategoryPage";
import { categoryMetadata } from "@/lib/seo";

export const metadata = categoryMetadata("developer");

export default function Page() {
  return <CategoryPage id="developer" />;
}
