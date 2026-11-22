import ToolShell from "@/components/tool/ToolShell";
import { toolMetadata } from "@/lib/seo";
import Client from "./Client";

export const metadata = toolMetadata("unit-converter");

export default function Page() {
  return (
    <ToolShell slug="unit-converter">
      <Client />
    </ToolShell>
  );
}
