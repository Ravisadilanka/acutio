import ToolShell from "@/components/tool/ToolShell";
import { toolMetadata } from "@/lib/seo";
import Client from "./Client";

export const metadata = toolMetadata("crop-image");

export default function Page() {
  return (
    <ToolShell slug="crop-image">
      <Client />
    </ToolShell>
  );
}
