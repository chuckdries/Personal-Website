import React, { ReactNode, useEffect, useLayoutEffect, useRef } from "react";
import { PhotoMonthNode } from "../photos/PhotoMonth";
import useDimensions from "react-cool-dimensions";
import {
  VariableSizeList as List,
  ListChildComponentProps,
  ListOnScrollProps,
} from "react-window";
import useBreakpoint from "use-breakpoint";
// @ts-expect-error babel preval != ts
import themeBreakpoints from "../../breakpoints";
import { useMasonryRows } from "./hooks/useMasonryRows";
import { MasonryRow } from "./MasonryRow";

// import "./MasonryContainer.css";

export interface MasonryGroup {
  slug: string;
  tickLabel: string;
  label: ReactNode;
  nodes: PhotoMonthNode[];
}

interface MasonryContainerProps {
  groups: MasonryGroup[];
  onScroll?: (data: ListOnScrollProps) => void;
  scrollPosition?: number;
  children: React.ReactNode;
}

interface MasonryBaseRow {
  type: "i" | "l" | "c";
  aspect: number; // TODO: simply store height directly
}

/** placeholder for children */
export interface MasonryChildrenRow extends MasonryBaseRow {
  type: "c";
  aspect: 0;
}

export interface MasonryImageRow extends MasonryBaseRow {
  type: "i";
  images: number;
  startIndex: number;
  isWhole: boolean;
  groupIndex: number;
}

export interface MasonryLabelRow extends MasonryBaseRow {
  type: "l";
  label: React.ReactNode;
  slug: string;
}

export type MasonryRowData =
  | MasonryChildrenRow
  | MasonryImageRow
  | MasonryLabelRow;

function MasonryVirtualizedRow() {}

export function MasonryContainer({
  groups,
  children,
  onScroll,
  scrollPosition,
}: MasonryContainerProps) {
  const { observe, width, height } = useDimensions();
  const listRef = useRef<List>(null);
  useEffect(() => {
    if (listRef.current) {
      listRef.current.resetAfterIndex(0);
    }
  }, [width, groups]);
  useLayoutEffect(() => {
    if (scrollPosition && listRef.current) {
      listRef.current.scrollTo(scrollPosition);
    }
  }, [scrollPosition]);
  // listRef.current?.scrollTo(scrollPosition);

  const { breakpoint } = useBreakpoint(themeBreakpoints, "sm");

  const targetAspect = width / (breakpoint === "sm" ? 150 : 250);
  const rows = useMasonryRows(targetAspect, groups);

  const itemSize = (index: number) => {
    if (index === 0) {
      // TODO: improve
      return 310;
    }

    if (index === 1) {
      return 120;
    }
    const row = rows[index];
    if (row.type === "i" && !row.isWhole) {
      return width / targetAspect;
    }

    return width / rows[index].aspect;
  };

  return (
    <div className="h-[100svh] w-full" ref={observe}>
      {width && (
        <List
          className="w-full"
          height={height}
          itemCount={rows.length}
          itemData={rows}
          itemSize={itemSize}
          onScroll={onScroll}
          overscanCount={5}
          ref={listRef}
          width={width}
        >
          {({ style, index }) => {
            const row = rows[index];
            switch (row.type) {
              case "c":
                return (
                  <div className="h-full flex flex-col" style={style}>
                    {children}
                  </div>
                );
              case "l":
                return (
                  <div className="relative" key={row.slug} style={style}>
                    <div className="p-4 lg:pl-8 flex justify-start items-end h-full">
                      {row.label}
                    </div>
                  </div>
                );
              case "i":
                return (
                  <div
                    className="relative flex w-full px-[5px]"
                    key={`${row.groupIndex}-${row.startIndex}`}
                    style={style}
                  >
                    <MasonryRow
                      items={groups[row.groupIndex].nodes.slice(
                        row.startIndex,
                        row.startIndex + row.images,
                      )}
                      nodes={groups[row.groupIndex].nodes.map(
                        (n) => n.fields!.organization!.slug!,
                      )}
                      row={row}
                      targetAspect={targetAspect}
                      width={width - 10}
                      // widthFn={widthFn}
                    />
                  </div>
                );
            }
          }}
        </List>
      )}
    </div>
  );
}
