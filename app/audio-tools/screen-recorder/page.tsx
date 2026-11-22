import ToolShell from "@/components/tool/ToolShell";
import { toolMetadata } from "@/lib/seo";
import Client from "./Client";

export const metadata = toolMetadata("screen-recorder");

export default function Page() {
  return (
    <ToolShell slug="screen-recorder">
      <Client />
    </ToolShell>
  );
}
