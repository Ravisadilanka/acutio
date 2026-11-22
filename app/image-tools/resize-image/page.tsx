import ToolShell from "@/components/tool/ToolShell";
import { toolMetadata } from "@/lib/seo";
import Client from "./Client";

export const metadata = toolMetadata("resize-image");

export default function Page() {
  return (
    <ToolShell slug="resize-image">
      <Client />
    </ToolShell>
  );
}
