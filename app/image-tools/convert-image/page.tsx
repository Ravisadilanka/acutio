import ToolShell from "@/components/tool/ToolShell";
import { toolMetadata } from "@/lib/seo";
import Client from "./Client";

export const metadata = toolMetadata("convert-image");

export default function Page() {
  return (
    <ToolShell slug="convert-image">
      <Client />
    </ToolShell>
  );
}
