import ToolShell from "@/components/tool/ToolShell";
import { toolMetadata } from "@/lib/seo";
import Client from "./Client";

export const metadata = toolMetadata("time-zone-converter");

export default function Page() {
  return (
    <ToolShell slug="time-zone-converter">
      <Client />
    </ToolShell>
  );
}
