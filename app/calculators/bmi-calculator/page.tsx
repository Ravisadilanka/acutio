import ToolShell from "@/components/tool/ToolShell";
import { toolMetadata } from "@/lib/seo";
import Client from "./Client";

export const metadata = toolMetadata("bmi-calculator");

export default function Page() {
  return (
    <ToolShell slug="bmi-calculator">
      <Client />
    </ToolShell>
  );
}
