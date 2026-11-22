import ToolShell from "@/components/tool/ToolShell";
import { toolMetadata } from "@/lib/seo";
import Client from "./Client";

export const metadata = toolMetadata("add-page-numbers");

export default function Page() {
  return (
    <ToolShell slug="add-page-numbers">
      <Client />
    </ToolShell>
  );
}
