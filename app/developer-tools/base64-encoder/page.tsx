import ToolShell from "@/components/tool/ToolShell";
import { toolMetadata } from "@/lib/seo";
import Client from "./Client";

export const metadata = toolMetadata("base64-encoder");

export default function Page() {
  return (
    <ToolShell slug="base64-encoder">
      <Client />
    </ToolShell>
  );
}
