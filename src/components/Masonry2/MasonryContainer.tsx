import React, {
  ReactNode,
  useEffect,
  useLayoutEffect,
  useRef,
} from "react";
import { PhotoMonthNode } from "../photos/PhotoMonth";
import useDimensions from "react-cool-dimensions";
import { VariableSizeList as List, ListChildComponentProps, ListOnScrollProps } from "react-window";
import useBreakpoint from "use-breakpoint";
// @ts-expect-error babel preval != ts
import themeBreakpoints from "../../breakpoints";
import { useMasonryRows } from "./hooks/useMasonryRows";

// import "./MasonryContainer.css";

export interface MasonryGroup {
  slug: string;
  tickLabel: string;
  // label: ReactNode;
  month: string | null;
  year: string | null;
  nodes: PhotoMonthNode[];
}

interface MasonryContainerProps {
  groups: MasonryGroup[];
  onScroll?: (data: ListOnScrollProps) => void;
  scrollPosition?: number;
  children: (row: MasonryRowData, props: ListChildComponentProps, targetAspect: number, width: number) => ReactNode;
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
  month: string | null;
  year: string | null;
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
  }, [width]);
  useLayoutEffect(() => {
    if (scrollPosition && listRef.current) {
      listRef.current.scrollTo(scrollPosition);
    }
  }, [scrollPosition]);
  // listRef.current?.scrollTo(scrollPosition);

  const { breakpoint } = useBreakpoint(themeBreakpoints, "sm")

  const targetAspect = width / (breakpoint === 'sm' ? 150 : 250);
  const rows = useMasonryRows(targetAspect, groups);

  const itemSize = (index: number) => {
    if (index === 0) {
      // TODO: improve
      return 410;
    }

    if (index === 1) {
      return 120;
    }
    const row = rows[index];
    if (row.type === "i" && !row.isWhole) {
      return (width / targetAspect);
    }

    return width / rows[index].aspect;
  };

  return (
    <div className="h-[100svh] w-full" ref={observe}>
      {width && (
        <List
          className="masorny-container w-full"
          height={height}
          itemCount={rows.length}
          itemData={rows}
          itemSize={itemSize}
          onScroll={onScroll}
          overscanCount={5}
          ref={listRef}
          width={width}
        >
          {(props) => children(rows[props.index], props, targetAspect, width)}
        </List>
      )}
    </div>
  );
}
