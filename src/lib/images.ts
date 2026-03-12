import { getImage } from "astro:assets";
import type { PhotoData, MasonryPhotoData, CarouselImageData } from "../types";

// Eager-load all gallery images so Astro can optimize them
const galleryImageModules = import.meta.glob<{ default: ImageMetadata }>(
  "/data/gallery/**/*.{jpg,jpeg,JPG,JPEG}",
  { eager: true },
);

export function getGalleryImageModule(
  filename: string,
): ImageMetadata | undefined {
  // Try to find the image module by matching the filename at the end of the path
  for (const [path, mod] of Object.entries(galleryImageModules)) {
    if (path.endsWith(`/${filename}`)) {
      return mod.default;
    }
  }
  return undefined;
}

export async function processPhotoForMasonry(
  photo: PhotoData,
): Promise<MasonryPhotoData | null> {
  const imageModule = getGalleryImageModule(photo.filename);
  if (!imageModule) {
    console.warn(`Could not find image module for ${photo.filename}`);
    return null;
  }

  const optimized = await getImage({
    src: imageModule,
    height: 550,
  });

  return {
    ...photo,
    src: optimized.src,
    thumbWidth: optimized.attributes.width as number,
    thumbHeight: optimized.attributes.height as number,
  };
}

export async function processPhotoForCarousel(
  filename: string,
): Promise<CarouselImageData | null> {
  const imageModule = getGalleryImageModule(filename);
  if (!imageModule) {
    console.warn(`Could not find image module for ${filename}`);
    return null;
  }

  const optimized = await getImage({
    src: imageModule,
    height: 250,
  });

  return {
    filename,
    src: optimized.src,
    width: optimized.attributes.width as number,
    height: optimized.attributes.height as number,
    aspectRatio: (optimized.attributes.width as number) / (optimized.attributes.height as number),
  };
}
