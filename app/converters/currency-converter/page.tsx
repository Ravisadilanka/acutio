import ToolShell from "@/components/tool/ToolShell";
import { toolMetadata } from "@/lib/seo";
import Client from "./Client";

export const metadata = toolMetadata("currency-converter");

export default function Page() {
  return (
    <ToolShell slug="currency-converter">
      <Client />
    </ToolShell>
  );
}
