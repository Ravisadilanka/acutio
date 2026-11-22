import ToolShell from "@/components/tool/ToolShell";
import { toolMetadata } from "@/lib/seo";
import Client from "./Client";

export const metadata = toolMetadata("qr-code-generator");

export default function Page() {
  return (
    <ToolShell slug="qr-code-generator">
      <Client />
    </ToolShell>
  );
}
