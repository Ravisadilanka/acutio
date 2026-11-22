import ToolShell from "@/components/tool/ToolShell";
import { toolMetadata } from "@/lib/seo";
import Client from "./Client";

export const metadata = toolMetadata("online-calculator");

export default function Page() {
  return (
    <ToolShell slug="online-calculator">
      <Client />
    </ToolShell>
  );
}
