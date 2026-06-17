import imageCompression from "browser-image-compression";

export async function compressImage(
  file: File,
  quality: number
): Promise<File> {
  return imageCompression(file, {
    maxSizeMB: 20,
    initialQuality:
      quality / 100,
    useWebWorker: true,
  });
}