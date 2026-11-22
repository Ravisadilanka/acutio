import ToolShell from "@/components/tool/ToolShell";
import { toolMetadata } from "@/lib/seo";
import Client from "./Client";

export const metadata = toolMetadata("compound-interest-calculator");

export default function Page() {
  return (
    <ToolShell slug="compound-interest-calculator">
      <Client />
    </ToolShell>
  );
}
