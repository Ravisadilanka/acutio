import ToolShell from "@/components/tool/ToolShell";
import { toolMetadata } from "@/lib/seo";
import Client from "./Client";

export const metadata = toolMetadata("uuid-generator");

export default function Page() {
  return (
    <ToolShell slug="uuid-generator">
      <Client />
    </ToolShell>
  );
}
