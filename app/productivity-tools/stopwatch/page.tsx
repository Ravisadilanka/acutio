import ToolShell from "@/components/tool/ToolShell";
import { toolMetadata } from "@/lib/seo";
import Client from "./Client";

export const metadata = toolMetadata("stopwatch");

export default function Page() {
  return (
    <ToolShell slug="stopwatch">
      <Client />
    </ToolShell>
  );
}
