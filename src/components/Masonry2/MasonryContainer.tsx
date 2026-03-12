import React, {
  type ReactNode,
  useEffect,
  useLayoutEffect,
  useRef,
} from "react";
import type { MasonryPhotoData } from "../../types";
import useDimensions from "react-cool-dimensions";
import { VariableSizeList as List } from "react-window";
import type { ListChildComponentProps, ListOnScrollProps } from "react-window";
import useBreakpoint from "use-breakpoint";
import themeBreakpoints from "../../breakpoints";
import { useMasonryRows } from "./hooks/useMasonryRows";

export interface MasonryGroup {
  slug: string;
  tickLabel: string;
  month: string | null;
  year: string | null;
  nodes: MasonryPhotoData[];
}

interface MasonryContainerProps {
  groups: MasonryGroup[];
  onScroll?: (data: ListOnScrollProps) => void;
  scrollPosition?: number;
  children: (row: MasonryRowData, props: ListChildComponentProps, targetAspect: number, width: number) => ReactNode;
}

interface MasonryBaseRow {
  type: "i" | "l";
  aspect: number;
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
  | MasonryImageRow
  | MasonryLabelRow;

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

  const { breakpoint } = useBreakpoint(themeBreakpoints, "sm")

  const idealItemSize = breakpoint === 'sm' ? 150 : 250;
  const targetAspect = width / idealItemSize;
  const rows = useMasonryRows(targetAspect, groups);

  const itemSize = (index: number) => {
    const row = rows[index];
    if (row.type === "l") {
      return 120;
    }
    if (row.type === "i" && !row.isWhole) {
      return idealItemSize;
    }

    return width / rows[index].aspect;
  };

  return (
    <div className="h-full w-full" ref={observe}>
      {width && (
        <List
          className="masorny-container w-full"
          height={height}
          itemCount={rows.length}
          itemData={rows}
          itemSize={itemSize}
          estimatedItemSize={idealItemSize}
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
