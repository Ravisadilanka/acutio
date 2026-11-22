import ToolShell from "@/components/tool/ToolShell";
import { toolMetadata } from "@/lib/seo";
import Client from "./Client";

export const metadata = toolMetadata("hash-generator");

export default function Page() {
  return (
    <ToolShell slug="hash-generator">
      <Client />
    </ToolShell>
  );
}
