import ToolShell from "@/components/tool/ToolShell";
import { toolMetadata } from "@/lib/seo";
import SplitPdfClient from "./SplitPdfClient";

export const metadata = toolMetadata("split-pdf");

export default function Page() {
  return (
    <ToolShell slug="split-pdf">
      <SplitPdfClient />
    </ToolShell>
  );
}
