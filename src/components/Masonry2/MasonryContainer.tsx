import React, { useMemo } from "react";
import * as R from "ramda";
import { PhotoMonthNode } from "../photos/PhotoMonth";
import { MasonryRow } from "./MasonryRow";
import { lab } from "chroma-js";
import { PhotoLayout } from "../photos/PhotoLayout";

export interface MasonryGroup {
  slug: string;
  label: string;
  nodes: PhotoMonthNode[];
}

interface MasonryContainerProps {
  groups: MasonryGroup[];
}

const targetAspect = 6;

export interface MasonryImageRow {
  type: "i";
  aspect: number;
  images: number;
  startIndex: number;
  isWhole: boolean;
  groupIndex: number;
}

export interface MasonryLabelRow {
  type: "l";
  label: string;
  slug: string;
}

export type MasonryRowData = MasonryImageRow | MasonryLabelRow;

export function MasonryContainer({ groups }: MasonryContainerProps) {
  const rows = React.useMemo(() => {
    const _rows: MasonryRowData[] = [];

    for (let i = 0; i < groups.length; i++) {
      const group = groups[i];
      _rows.push({
        type: "l",
        label: group.label,
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
    // return R.indexBy(R.prop("startIndex"), _rows);
  }, [groups]);
  console.log("🚀 ~ rows ~ rows:", rows);

  return (
    <PhotoLayout>
      {rows.map((row) => {
        switch (row.type) {
          case "l":
            return <h2 className="mt-4" key={row.slug}>{row.label}</h2>;
          case "i":
            return <MasonryRow
              items={groups[row.groupIndex].nodes.slice(row.startIndex, row.startIndex + row.images)}
              key={`${row.groupIndex}-${row.startIndex}`}
              row={row}
              targetAspect={targetAspect}
            />;
        }
      })}
    </PhotoLayout>
  );
}
