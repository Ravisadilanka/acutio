import ToolShell from "@/components/tool/ToolShell";
import { toolMetadata } from "@/lib/seo";
import JpgToPdfClient from "./JpgToPdfClient";

export const metadata = toolMetadata("jpg-to-pdf");

export default function Page() {
  return (
    <ToolShell slug="jpg-to-pdf">
      <JpgToPdfClient />
    </ToolShell>
  );
}
