import ToolShell from "@/components/tool/ToolShell";
import { toolMetadata } from "@/lib/seo";
import Client from "./Client";

export const metadata = toolMetadata("organize-pdf");

export default function Page() {
  return (
    <ToolShell slug="organize-pdf" wide>
      <Client />
    </ToolShell>
  );
}
