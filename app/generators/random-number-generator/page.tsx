import ToolShell from "@/components/tool/ToolShell";
import { toolMetadata } from "@/lib/seo";
import Client from "./Client";

export const metadata = toolMetadata("random-number-generator");

export default function Page() {
  return (
    <ToolShell slug="random-number-generator">
      <Client />
    </ToolShell>
  );
}
