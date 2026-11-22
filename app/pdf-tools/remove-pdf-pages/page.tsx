import ToolShell from "@/components/tool/ToolShell";
import PdfPageEditor from "@/components/tools/PdfPageEditor";
import { toolMetadata } from "@/lib/seo";

export const metadata = toolMetadata("remove-pdf-pages");

export default function Page() {
  return (
    <ToolShell slug="remove-pdf-pages" wide>
      <PdfPageEditor mode="remove" />
    </ToolShell>
  );
}
