import ToolShell from "@/components/tool/ToolShell";
import { toolMetadata } from "@/lib/seo";
import Client from "./Client";

export const metadata = toolMetadata("age-calculator");

export default function Page() {
  return (
    <ToolShell slug="age-calculator">
      <Client />
    </ToolShell>
  );
}
