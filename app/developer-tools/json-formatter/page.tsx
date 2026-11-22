import ToolShell from "@/components/tool/ToolShell";
import { toolMetadata } from "@/lib/seo";
import Client from "./Client";

export const metadata = toolMetadata("json-formatter");

export default function Page() {
  return (
    <ToolShell slug="json-formatter" wide>
      <Client />
    </ToolShell>
  );
}
