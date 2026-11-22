import ToolShell from "@/components/tool/ToolShell";
import { toolMetadata } from "@/lib/seo";
import RotatePdfClient from "./RotatePdfClient";

export const metadata = toolMetadata("rotate-pdf");

export default function Page() {
  return (
    <ToolShell slug="rotate-pdf">
      <RotatePdfClient />
    </ToolShell>
  );
}
