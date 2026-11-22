import ToolShell from "@/components/tool/ToolShell";
import JpgToPdfClient from "../jpg-to-pdf/JpgToPdfClient";
import { toolMetadata } from "@/lib/seo";

export const metadata = toolMetadata("png-to-pdf");

export default function Page() {
  return (
    <ToolShell slug="png-to-pdf">
      <JpgToPdfClient />
    </ToolShell>
  );
}
