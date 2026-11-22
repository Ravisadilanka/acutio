import ToolShell from "@/components/tool/ToolShell";
import { toolMetadata } from "@/lib/seo";
import SpeechToTextClient from "./SpeechToTextClient";

export const metadata = toolMetadata("speech-to-text");

export default function Page() {
  return (
    <ToolShell slug="speech-to-text">
      <SpeechToTextClient />
    </ToolShell>
  );
}
