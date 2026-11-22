import ToolShell from "@/components/tool/ToolShell";
import { toolMetadata } from "@/lib/seo";
import Client from "./Client";

export const metadata = toolMetadata("spin-the-wheel");

export default function Page() {
  return (
    <ToolShell slug="spin-the-wheel" wide>
      <Client />
    </ToolShell>
  );
}
