import ToolShell from "@/components/tool/ToolShell";
import { toolMetadata } from "@/lib/seo";
import Client from "./Client";

export const metadata = toolMetadata("discount-calculator");

export default function Page() {
  return (
    <ToolShell slug="discount-calculator">
      <Client />
    </ToolShell>
  );
}
