import React, { useEffect, useState } from "react";
import {
  MasonryContainer,
  type MasonryGroup,
} from "./Masonry2/MasonryContainer";
import { MasonryRow } from "./Masonry2/MasonryRow";

interface PhotosPageClientProps {
  groups: MasonryGroup[];
}

export function PhotosPageClient({ groups }: PhotosPageClientProps) {
  const [initialScroll, setInitialScroll] = useState(0);
  useEffect(() => {
    const prevScroll = sessionStorage.getItem("photos-scroll");
    if (prevScroll) {
      setInitialScroll(Number(prevScroll));
    }
  }, []);

  return (
    <div className="h-full relative w-full">
      <MasonryContainer
        groups={groups}
        onScroll={(data) => {
          sessionStorage.setItem("photos-scroll", `${data.scrollOffset}`);
        }}
        scrollPosition={initialScroll}
      >
        {(row, { index, style }, targetAspect, width) => {
          switch (row.type) {
            case "l":
              return (
                <div className="relative" key={row.slug} style={style}>
                  {row.slug === "Older" ? (
                    <div className="p-4 lg:pl-8 flex flex-col justify-end h-full">
                      <h2 className="text-3xl md:text-4xl m-0 md:m-1 font-bold">
                        Older
                      </h2>
                    </div>
                  ) : (
                    <div className="p-4 lg:pl-8 flex justify-start items-end h-full">
                      <h2 className="text-3xl md:text-4xl m-0 md:m-1">
                        <span className="font-bold">{row.month}</span>{" "}
                        <span className="font-extralight opacity-70">
                          {row.year}
                        </span>
                      </h2>
                    </div>
                  )}
                </div>
              );
            case "i":
              return (
                <div
                  className="relative flex"
                  key={`${row.groupIndex}-${row.startIndex}`}
                  style={style}
                >
                  <MasonryRow
                    items={groups[row.groupIndex].nodes.slice(
                      row.startIndex,
                      row.startIndex + row.images,
                    )}
                    nodes={groups[row.groupIndex].nodes.map((n) => n.slug)}
                    row={row}
                    targetAspect={targetAspect}
                    width={width - 10}
                  />
                </div>
              );
          }
        }}
      </MasonryContainer>
    </div>
  );
}
