export interface PhotoMeta {
  Make?: string | null;
  Model?: string | null;
  ExposureTime?: number | null;
  FNumber?: number | null;
  ISO?: number | null;
  DateTimeOriginal?: string | null;
  OffsetTimeOriginal?: string | null;
  FocalLength?: number | null;
  LensModel?: string | null;
  ObjectName?: string | null;
  Caption?: string | null;
  Rating?: number | null;
  Keywords?: string[] | null;
}

export interface PhotoOrganization {
  year: number;
  month: number;
  yearFolder: string;
  monthSlug: string;
}

export interface PhotoData {
  id: string;
  filename: string;
  relativePath: string;
  width: number;
  height: number;
  aspectRatio: number;
  dominantColor: string;
  dateTaken: string;
  datePublished: string;
  slug: string;
  organization: PhotoOrganization;
  meta: PhotoMeta;
}

/** Photo data with a pre-computed thumbnail src for use in masonry grids */
export interface MasonryPhotoData extends PhotoData {
  src: string;
  thumbWidth: number;
  thumbHeight: number;
}

/** Simplified image data for carousels and post listings */
export interface CarouselImageData {
  filename: string;
  src: string;
  width: number;
  height: number;
  aspectRatio: number;
}
