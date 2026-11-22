import ToolShell from "@/components/tool/ToolShell";
import { toolMetadata } from "@/lib/seo";
import Client from "./Client";

export const metadata = toolMetadata("pdf-to-text");

export default function Page() {
  return (
    <ToolShell slug="pdf-to-text">
      <Client />
    </ToolShell>
  );
}
