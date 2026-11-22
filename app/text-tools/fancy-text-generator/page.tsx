import ToolShell from "@/components/tool/ToolShell";
import { toolMetadata } from "@/lib/seo";
import Client from "./Client";

export const metadata = toolMetadata("fancy-text-generator");

export default function Page() {
  return (
    <ToolShell slug="fancy-text-generator">
      <Client />
    </ToolShell>
  );
}
