import ToolShell from "@/components/tool/ToolShell";
import { toolMetadata } from "@/lib/seo";
import TypingSpeedTestClient from "./TypingSpeedTestClient";

export const metadata = toolMetadata("typing-speed-test");

export default function Page() {
  return (
    <ToolShell slug="typing-speed-test">
      <TypingSpeedTestClient />
    </ToolShell>
  );
}
