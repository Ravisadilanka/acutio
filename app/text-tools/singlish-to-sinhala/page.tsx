import ToolShell from "@/components/tool/ToolShell";
import { toolMetadata } from "@/lib/seo";
import Client from "./Client";

export const metadata = toolMetadata("singlish-to-sinhala");

export default function Page() {
  return (
    <ToolShell slug="singlish-to-sinhala">
      <Client />
    </ToolShell>
  );
}
