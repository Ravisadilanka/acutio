import ToolShell from "@/components/tool/ToolShell";
import { toolMetadata } from "@/lib/seo";
import Client from "./Client";

export const metadata = toolMetadata("color-picker");

export default function Page() {
  return (
    <ToolShell slug="color-picker">
      <Client />
    </ToolShell>
  );
}
