import ToolShell from "@/components/tool/ToolShell";
import ImageConverter from "@/components/tools/ImageConverter";
import { toolMetadata } from "@/lib/seo";

export const metadata = toolMetadata("heic-to-jpg");

export default function Page() {
  return (
    <ToolShell slug="heic-to-jpg">
      <ImageConverter defaultFormat="image/jpeg" accept={{ "image/heic": [".heic"], "image/heif": [".heif"] }} label="Select HEIC photos" />
    </ToolShell>
  );
}
