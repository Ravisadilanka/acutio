import ToolShell from "@/components/tool/ToolShell";
import { toolMetadata } from "@/lib/seo";
import Client from "./Client";

export const metadata = toolMetadata("online-notepad");

export default function Page() {
  return (
    <ToolShell slug="online-notepad">
      <Client />
    </ToolShell>
  );
}
