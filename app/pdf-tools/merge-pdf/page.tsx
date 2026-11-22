import ToolShell from "@/components/tool/ToolShell";
import { toolMetadata } from "@/lib/seo";
import MergePdfClient from "./MergePdfClient";

export const metadata = toolMetadata("merge-pdf");

export default function Page() {
  return (
    <ToolShell slug="merge-pdf">
      <MergePdfClient />
    </ToolShell>
  );
}
