import ToolShell from "@/components/tool/ToolShell";
import { toolMetadata } from "@/lib/seo";
import Client from "./Client";

export const metadata = toolMetadata("regex-tester");

export default function Page() {
  return (
    <ToolShell slug="regex-tester" wide>
      <Client />
    </ToolShell>
  );
}
