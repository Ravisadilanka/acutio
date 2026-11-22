import ToolShell from "@/components/tool/ToolShell";
import ImageConverter from "@/components/tools/ImageConverter";
import { toolMetadata } from "@/lib/seo";

export const metadata = toolMetadata("jpg-to-png");

export default function Page() {
  return (
    <ToolShell slug="jpg-to-png">
      <ImageConverter defaultFormat="image/png" accept={{ "image/jpeg": [".jpg", ".jpeg"] }} label="Select JPG images" />
    </ToolShell>
  );
}
