import React, { useMemo, useEffect, useRef, useState } from "react";
import { Link } from "gatsby";
import { KeywordCardRow } from "./KeywordCardRow";

type PhotoNode = {
  id: string;
  childImageSharp?: {
    gatsbyImageData?: any;
    fluid?: {
      aspectRatio?: number;
    } | null;
  } | null;
};

interface KeywordCardProps {
  keyword: string;
  images: PhotoNode[];
  playing: boolean;
}

const NUM_ROWS = 3;
const FIXED_HEIGHT = 90;

export function KeywordCard({ keyword, images, playing }: KeywordCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);

  // Distribute images evenly across rows
  const rows = useMemo(() => {
    if (!images || images.length === 0) {
      return [];
    }

    const imagesPerRow = Math.ceil(images.length / NUM_ROWS);
    const rows: PhotoNode[][] = [];

    for (let i = 0; i < NUM_ROWS; i++) {
      const start = i * imagesPerRow;
      const end = start + imagesPerRow;
      rows.push(images.slice(start, end));
    }

    // Filter out empty rows
    return rows.filter((row) => row.length > 0);
  }, [images]);

  useEffect(() => {
    const handleScroll = () => {
      if (!cardRef.current) return;

      const rect = cardRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      // Calculate how much of the card is visible
      const cardTop = rect.top;
      const cardBottom = rect.bottom;
      const cardHeight = rect.height;

      // Calculate parallax offset based on scroll position
      // When card is in viewport, move rows based on scroll
      // if (cardBottom > 0 && cardTop < viewportHeight) {
      //   const scrollProgress =
      //     (viewportHeight - cardTop) / (viewportHeight + cardHeight);
      //   const maxOffset = cardHeight * 0.5; // 50% of card height (since rows are 150% of screen)
      //   const offset = scrollProgress * maxOffset;
      //   setScrollY(offset);
      // }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial calculation

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  if (rows.length === 0) {
    return null;
  }

  //   const screenHeight = typeof window !== "undefined" ? window.innerHeight : 900;
  //   const rowsHeight = screenHeight * 2; // 150% of screen height

  return (
    <div ref={cardRef} className="shrink-0 flex flex-col relative">
      <Link
        to={`/photos/${keyword}`}
        className="shrink-0 flex flex-col relative group"
        aria-label={`View ${keyword} photos`}
      >
        <div
          className="relative group-hover:scale-105 transition-all duration-300 "
          style={{ width: "300px", height: "300px" }}
        >
          <div
            style={{ width: "300px", height: "300px" }}
            className="relative shrink-0 rounded-full h-[300px] aspect-square relative mt-3 p-1 border border-gray-500 shadow overflow-hidden"
          >
            <div className="rounded-full overflow-hidden w-full h-full prog-blur-radial">
              <div className="flex flex-col gap-4 relative">
                {rows.map((rowImages, index) => (
                  <KeywordCardRow
                    key={index}
                    images={rowImages}
                    playing={playing}
                    fixedHeight={FIXED_HEIGHT}
                  />
                ))}
              </div>
            </div>
          </div>
          {/* Curved text along top edge */}
          <svg
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
            style={{ overflow: "visible" }}
            viewBox="0 0 300 300"
          >
            <defs>
              <path
                id={`text-path-${keyword}`}
                d="M 60,30 A 150,150 0 0,1 240,30"
                fill="none"
              />
            </defs>
            <text
              className="font-serif font-bold fill-black capitalize"
              style={{ fontSize: "24px" }}
            >
              <textPath
                href={`#text-path-${keyword}`}
                startOffset="50%"
                textAnchor="middle"
              >
                {keyword}
              </textPath>
            </text>
          </svg>
        </div>
      </Link>
    </div>
  );
}
