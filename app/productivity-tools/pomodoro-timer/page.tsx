import ToolShell from "@/components/tool/ToolShell";
import { toolMetadata } from "@/lib/seo";
import Client from "./Client";

export const metadata = toolMetadata("pomodoro-timer");

export default function Page() {
  return (
    <ToolShell slug="pomodoro-timer">
      <Client />
    </ToolShell>
  );
}
