import ToolShell from "@/components/tool/ToolShell";
import ImageConverter from "@/components/tools/ImageConverter";
import { toolMetadata } from "@/lib/seo";

export const metadata = toolMetadata("webp-to-jpg");

export default function Page() {
  return (
    <ToolShell slug="webp-to-jpg">
      <ImageConverter defaultFormat="image/jpeg" accept={{ "image/webp": [".webp"] }} label="Select WEBP images" />
    </ToolShell>
  );
}
