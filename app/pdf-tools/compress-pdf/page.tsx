import ToolShell from "@/components/tool/ToolShell";
import { toolMetadata } from "@/lib/seo";
import Client from "./Client";

export const metadata = toolMetadata("compress-pdf");

export default function Page() {
  return (
    <ToolShell slug="compress-pdf">
      <Client />
    </ToolShell>
  );
}
