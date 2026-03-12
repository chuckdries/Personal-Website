import React from "react";
import type { MasonryPhotoData } from "../../types";
import type { MasonryImageRow } from "./MasonryContainer";

interface MasonryRowProps {
  items: MasonryPhotoData[];
  row: MasonryImageRow;
  targetAspect: number;
  width: number;
  nodes: string[];
}

export function MasonryRow({
  items,
  row,
  targetAspect,
  width: rowWidth,
  nodes,
}: MasonryRowProps) {
  return (
    <>
      {items.map((photo, index) => {
        const aspect = photo.aspectRatio;
        const widthNumber = aspect / (row.isWhole ? row.aspect : targetAspect);
        const width = rowWidth * widthNumber + "px";

        const selfIndex = row.startIndex + index;
        return (
          <a
            className="inline-block relative p-1"
            key={photo.id}
            href={`/${photo.slug}`}
            onClick={(e) => {
              // Store sibling nav context in history state
              e.preventDefault();
              window.history.pushState(
                { selfIndex, context: nodes },
                "",
                `/${photo.slug}`,
              );
              window.location.href = `/${photo.slug}`;
            }}
            style={{ width }}
          >
            <img
              alt={photo.meta.ObjectName ?? `photo ${photo.filename}`}
              className="h-full w-full object-cover"
              loading="lazy"
              src={photo.src}
              style={{ backgroundColor: photo.dominantColor }}
            />
            <div className="absolute top-0 left-0 right-0 bottom-0">
              <span className="bg-black/50 text-white">
              </span>
            </div>
          </a>
        );
      })}
    </>
  );
}
