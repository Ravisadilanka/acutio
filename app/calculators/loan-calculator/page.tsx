import ToolShell from "@/components/tool/ToolShell";
import { toolMetadata } from "@/lib/seo";
import Client from "./Client";

export const metadata = toolMetadata("loan-calculator");

export default function Page() {
  return (
    <ToolShell slug="loan-calculator">
      <Client />
    </ToolShell>
  );
}
