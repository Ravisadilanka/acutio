import ToolShell from "@/components/tool/ToolShell";
import { toolMetadata } from "@/lib/seo";
import CompressImageClient from "./CompressImageClient";

export const metadata = toolMetadata("compress-image");

export default function Page() {
  return (
    <ToolShell slug="compress-image">
      <CompressImageClient />
    </ToolShell>
  );
}
