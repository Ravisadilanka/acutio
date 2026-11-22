import ToolShell from "@/components/tool/ToolShell";
import ImageConverter from "@/components/tools/ImageConverter";
import { toolMetadata } from "@/lib/seo";

export const metadata = toolMetadata("png-to-jpg");

export default function Page() {
  return (
    <ToolShell slug="png-to-jpg">
      <ImageConverter defaultFormat="image/jpeg" accept={{ "image/png": [".png"] }} label="Select PNG images" />
    </ToolShell>
  );
}
