import ToolShell from "@/components/tool/ToolShell";
import { toolMetadata } from "@/lib/seo";
import Client from "./Client";

export const metadata = toolMetadata("audio-to-text");

export default function Page() {
  return (
    <ToolShell slug="audio-to-text">
      <Client />
    </ToolShell>
  );
}
