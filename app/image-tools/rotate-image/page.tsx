import ToolShell from "@/components/tool/ToolShell";
import { toolMetadata } from "@/lib/seo";
import Client from "./Client";

export const metadata = toolMetadata("rotate-image");

export default function Page() {
  return (
    <ToolShell slug="rotate-image">
      <Client />
    </ToolShell>
  );
}
