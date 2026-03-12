import type { PhotoData } from "../types";

interface ProcessedGalleryImage {
  src: string;
  width: number;
  height: number;
  aspectRatio: number;
  filename: string;
  slug: string;
  meta: PhotoData["meta"];
}

let currentPostGalleryImages: ProcessedGalleryImage[] = [];

export function setPostGalleryImages(images: ProcessedGalleryImage[]) {
  currentPostGalleryImages = images;
}

export function getPostGalleryImage(
  index: number,
): ProcessedGalleryImage | undefined {
  return currentPostGalleryImages[index];
}

export type { ProcessedGalleryImage };
