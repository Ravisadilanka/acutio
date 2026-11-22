import ToolShell from "@/components/tool/ToolShell";
import { toolMetadata } from "@/lib/seo";
import Client from "./Client";

export const metadata = toolMetadata("diff-checker");

export default function Page() {
  return (
    <ToolShell slug="diff-checker" wide>
      <Client />
    </ToolShell>
  );
}
