import ToolShell from "@/components/tool/ToolShell";
import { toolMetadata } from "@/lib/seo";
import Client from "./Client";

export const metadata = toolMetadata("color-converter");

export default function Page() {
  return (
    <ToolShell slug="color-converter">
      <Client />
    </ToolShell>
  );
}
