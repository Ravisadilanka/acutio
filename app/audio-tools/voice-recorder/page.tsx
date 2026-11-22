import ToolShell from "@/components/tool/ToolShell";
import { toolMetadata } from "@/lib/seo";
import Client from "./Client";

export const metadata = toolMetadata("voice-recorder");

export default function Page() {
  return (
    <ToolShell slug="voice-recorder">
      <Client />
    </ToolShell>
  );
}
