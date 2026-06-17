export interface ImageItem {
  file: File;
  preview: string;
}

export interface CompressedImage {
  originalFile: File;
  compressedFile: File;
  preview: string;
}

export type SupportedImageType =
  | "image/jpeg"
  | "image/png"
  | "image/webp"
  | "image/gif"
  | "image/bmp"
  | "image/tiff"
  | "image/heic"
  | "image/heif"
  | "image/avif";

export type ResizeOption =
  | "original"
  | "3840"
  | "2560"
  | "1920"
  | "1280";