import ToolShell from "@/components/tool/ToolShell";
import { toolMetadata } from "@/lib/seo";
import Client from "./Client";

export const metadata = toolMetadata("password-generator");

export default function Page() {
  return (
    <ToolShell slug="password-generator">
      <Client />
    </ToolShell>
  );
}
