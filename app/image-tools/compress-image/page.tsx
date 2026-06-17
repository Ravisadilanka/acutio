import { Metadata } from 'next';
import CompressImageClient from './CompressImageClient';

export const metadata: Metadata = {
  title: "Compress Image Online Free",
  description:
    "Compress JPG, PNG and WEBP images online for free. Reduce image file size directly in your browser.",
};

export default function CompressImagePage() {
    return <CompressImageClient />;
}