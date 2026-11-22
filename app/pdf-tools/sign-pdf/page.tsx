import ToolShell from "@/components/tool/ToolShell";
import { toolMetadata } from "@/lib/seo";
import SignPdfClient from "./SignPdfClient";

export const metadata = toolMetadata("sign-pdf");

export default function Page() {
  return (
    <ToolShell slug="sign-pdf">
      <SignPdfClient />
    </ToolShell>
  );
}
