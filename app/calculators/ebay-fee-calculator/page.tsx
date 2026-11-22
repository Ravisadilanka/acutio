import ToolShell from "@/components/tool/ToolShell";
import { toolMetadata } from "@/lib/seo";
import EbayFeeCalculatorClient from "./EbayFeeCalculatorClient";

export const metadata = toolMetadata("ebay-fee-calculator");

export default function Page() {
  return (
    <ToolShell slug="ebay-fee-calculator">
      <EbayFeeCalculatorClient />
    </ToolShell>
  );
}
