import ToolShell from "@/components/tool/ToolShell";
import { toolMetadata } from "@/lib/seo";
import Client from "./Client";

export const metadata = toolMetadata("remove-duplicate-lines");

export default function Page() {
  return (
    <ToolShell slug="remove-duplicate-lines">
      <Client />
    </ToolShell>
  );
}
