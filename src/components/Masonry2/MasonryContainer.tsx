import React, { ReactNode, useMemo } from "react";
import * as R from "ramda";
import { PhotoMonthNode } from "../photos/PhotoMonth";
import { MasonryRow } from "./MasonryRow";
import { lab } from "chroma-js";
import { PhotoLayout } from "../photos/PhotoLayout";

export interface MasonryGroup {
  slug: string;
  tickLabel: string;
  label: ReactNode;
  nodes: PhotoMonthNode[];
}

interface MasonryContainerProps {
  groups: MasonryGroup[];
  widthFn: (widthNumber: number) => string;
  maxWidth: string;
}

const targetAspect = 6;

interface MasonryBaseRow {
  type: "i" | "l";
  
}

export interface MasonryImageRow extends MasonryBaseRow {
  type: "i";
  images: number;
  startIndex: number;
  isWhole: boolean;
  groupIndex: number;
  aspect: number;
}

export interface MasonryLabelRow extends MasonryBaseRow {
  type: "l";
  contents: ReactNode;
  slug: string;
}

export type MasonryRowData = MasonryImageRow | MasonryLabelRow;

export function MasonryContainer({
  groups,
  widthFn,
  maxWidth,
}: MasonryContainerProps) {
  const rows = React.useMemo(() => {
    const _rows: MasonryRowData[] = [];

    for (let i = 0; i < groups.length; i++) {
      const group = groups[i];
      _rows.push({
        type: "l",
        aspect: 12,
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

  return (
    <div className="overflow-hidden" style={{ maxWidth }}>
      {rows.map((row) => {
        switch (row.type) {
          case "l":
            return (
              <div
                className="relative"
                key={row.slug}
                // style={{
                //   aspectRatio: ["lg", "xl", "2xl", "3xl"].includes(
                //     breakpoint as string,
                //   )
                //     ? row.aspect
                //     : undefined,
                // }}
              >
                {row.contents}
              </div>
            );
          case "i":
            return (
              <MasonryRow
                items={groups[row.groupIndex].nodes.slice(
                  row.startIndex,
                  row.startIndex + row.images,
                )}
                key={`${row.groupIndex}-${row.startIndex}`}
                row={row}
                targetAspect={targetAspect}
                widthFn={widthFn}
              />
            );
        }
      })}
    </div>
  );
}
