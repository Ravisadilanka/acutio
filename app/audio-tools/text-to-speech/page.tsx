import ToolShell from "@/components/tool/ToolShell";
import { toolMetadata } from "@/lib/seo";
import Client from "./Client";

export const metadata = toolMetadata("text-to-speech");

export default function Page() {
  return (
    <ToolShell slug="text-to-speech">
      <Client />
    </ToolShell>
  );
}
