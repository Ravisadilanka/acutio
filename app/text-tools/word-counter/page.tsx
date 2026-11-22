import ToolShell from "@/components/tool/ToolShell";
import { toolMetadata } from "@/lib/seo";
import Client from "./Client";

export const metadata = toolMetadata("word-counter");

export default function Page() {
  return (
    <ToolShell slug="word-counter">
      <Client />
    </ToolShell>
  );
}
