import ToolShell from "@/components/tool/ToolShell";
import { toolMetadata } from "@/lib/seo";
import Client from "./Client";

export const metadata = toolMetadata("date-calculator");

export default function Page() {
  return (
    <ToolShell slug="date-calculator">
      <Client />
    </ToolShell>
  );
}
