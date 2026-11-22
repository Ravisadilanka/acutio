import ToolShell from "@/components/tool/ToolShell";
import { toolMetadata } from "@/lib/seo";
import Client from "./Client";

export const metadata = toolMetadata("timestamp-converter");

export default function Page() {
  return (
    <ToolShell slug="timestamp-converter">
      <Client />
    </ToolShell>
  );
}
