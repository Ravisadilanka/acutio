import ToolShell from "@/components/tool/ToolShell";
import { toolMetadata } from "@/lib/seo";
import Client from "./Client";

export const metadata = toolMetadata("image-to-base64");

export default function Page() {
  return (
    <ToolShell slug="image-to-base64">
      <Client />
    </ToolShell>
  );
}
