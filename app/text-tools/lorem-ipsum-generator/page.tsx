import ToolShell from "@/components/tool/ToolShell";
import { toolMetadata } from "@/lib/seo";
import Client from "./Client";

export const metadata = toolMetadata("lorem-ipsum-generator");

export default function Page() {
  return (
    <ToolShell slug="lorem-ipsum-generator">
      <Client />
    </ToolShell>
  );
}
