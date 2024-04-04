import React, { ReactNode, useMemo, useRef } from "react";
import * as R from "ramda";
import { PhotoMonthNode } from "../photos/PhotoMonth";
import { MasonryRow } from "./MasonryRow";
import { lab } from "chroma-js";
import { PhotoLayout } from "../photos/PhotoLayout";
import useDimensions from "react-cool-dimensions";
import { VariableSizeList as List } from "react-window";

import "./MasonryContainer.css";

export interface MasonryGroup {
  slug: string;
  tickLabel: string;
  label: ReactNode;
  nodes: PhotoMonthNode[];
}

interface MasonryContainerProps {
  groups: MasonryGroup[];
  children: ReactNode;
}

const targetAspect = 6;

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
  contents: ReactNode;
  slug: string;
}

export type MasonryRowData = MasonryChildrenRow | MasonryImageRow | MasonryLabelRow;

function MasonryVirtualizedRow() {}

export function MasonryContainer({
  groups,
  children,
}: MasonryContainerProps) {
  const rows = React.useMemo(() => {
    const _rows: MasonryRowData[] = [{
      type: "c",
      aspect: 0,
    }];

    for (let i = 0; i < groups.length; i++) {
      const group = groups[i];
      _rows.push({
        type: "l",
        aspect: i == 0 ? 12 : 7,
        contents: group.label,
        slug: group.slug,
      });
      _rows.push({
        type: "i",
        aspect: 0,
        startIndex: 0,
        images: 0,
        isWhole: false,
        groupIndex: i,
      });

      for (const node of group.nodes) {
        const currentAspect = node.childImageSharp!.fluid!.aspectRatio;

        const currentRow = _rows[_rows.length - 1] as MasonryImageRow;
        const currentDiff = Math.abs(targetAspect - currentRow.aspect);
        const diffIfImageIsAddedToCurrentRow = Math.abs(
          targetAspect - (currentRow.aspect + currentAspect),
        );

        // does adding current image to our row get us closer to our target aspect ratio?
        if (currentDiff > diffIfImageIsAddedToCurrentRow) {
          currentRow.aspect += currentAspect;
          currentRow.images += 1;
          // _rows.push(currentRow);
          continue;
        }

        // if (singleRow) {
        //   break;
        // }

        // start a new row
        currentRow.isWhole = true;
        _rows.push({
          type: "i",
          aspect: currentAspect,
          images: 1,
          startIndex: currentRow.startIndex + currentRow.images,
          isWhole: false,
          groupIndex: i,
        });
      }
    }

    return _rows;
  }, [groups]);

  const containerRef = useRef<HTMLDivElement>(null);
  const { observe, width, height } = useDimensions();

const itemSize = (index: number) => {
  if (index === 0 && children) {
    // TODO: improve
    return 200;
  }
  const row = rows[index];
  if (row.type === 'i' && !row.isWhole) {
    return width / targetAspect;
  }

  return width / rows[index].aspect
}

  return (
    <div ref={observe} className="h-full w-full">
      {width && (
        <List
          itemCount={rows.length}
          height={height}
          itemData={rows}
          width={width}
          itemSize={itemSize}
          className='masorny-container'
          onScroll={(data) => {
            console.log(data);
          }}
        >
          {({ index, style, data }) => {
            if (index === 0 && children) {
              return <div className="relative" key={0} style={style}>{children}</div>
            }
            const row = data[index];
            switch (row.type) {
              case "l":
                return (
                  <div className="relative" key={row.slug} style={style}>
                    {row.contents}
                  </div>
                );
              case "i":
                return (
                  <div
                    className="relative"
                    key={`${row.groupIndex}-${row.startIndex}`}
                    style={style}
                  >
                    <MasonryRow
                      items={groups[row.groupIndex].nodes.slice(
                        row.startIndex,
                        row.startIndex + row.images,
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
