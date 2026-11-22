import ToolShell from "@/components/tool/ToolShell";
import { toolMetadata } from "@/lib/seo";
import PdfToJpgClient from "./PdfToJpgClient";

export const metadata = toolMetadata("pdf-to-jpg");

export default function Page() {
  return (
    <ToolShell slug="pdf-to-jpg">
      <PdfToJpgClient />
    </ToolShell>
  );
}
