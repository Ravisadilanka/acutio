import ToolShell from "@/components/tool/ToolShell";
import { toolMetadata } from "@/lib/seo";
import Client from "./Client";

export const metadata = toolMetadata("watermark-pdf");

export default function Page() {
  return (
    <ToolShell slug="watermark-pdf">
      <Client />
    </ToolShell>
  );
}
