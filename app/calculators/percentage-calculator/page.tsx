import ToolShell from "@/components/tool/ToolShell";
import { toolMetadata } from "@/lib/seo";
import Client from "./Client";

export const metadata = toolMetadata("percentage-calculator");

export default function Page() {
  return (
    <ToolShell slug="percentage-calculator">
      <Client />
    </ToolShell>
  );
}
