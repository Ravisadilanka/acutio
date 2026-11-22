import ToolShell from "@/components/tool/ToolShell";
import { toolMetadata } from "@/lib/seo";
import Client from "./Client";

export const metadata = toolMetadata("calorie-calculator");

export default function Page() {
  return (
    <ToolShell slug="calorie-calculator">
      <Client />
    </ToolShell>
  );
}
