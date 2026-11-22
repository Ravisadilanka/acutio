import ToolShell from "@/components/tool/ToolShell";
import { toolMetadata } from "@/lib/seo";
import Client from "./Client";

export const metadata = toolMetadata("countdown-timer");

export default function Page() {
  return (
    <ToolShell slug="countdown-timer">
      <Client />
    </ToolShell>
  );
}
