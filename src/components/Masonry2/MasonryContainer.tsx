import React, { useMemo } from "react";
import * as R from "ramda";
import { PhotoMonthNode } from "../photos/PhotoMonth";
import { MasonryRow } from "./MasonryRow";

interface MasonryContainerProps {
  items: readonly PhotoMonthNode[];
}

const targetAspect = 6;

export interface Row {
  aspect: number;
  images: number;
  startIndex: number;
  isWhole: boolean;
}

export function MasonryContainer({ items }: MasonryContainerProps) {
  const aspectRatios = useMemo(
    () => items.map((node) => node.childImageSharp!.fluid!.aspectRatio),
    [items],
  );

  const rows = React.useMemo(() => {
    const _rows: Row[] = [
      { aspect: 0, startIndex: 0, images: 0, isWhole: false },
    ];

    for (const currentAspect of aspectRatios) {
      const currentRow = _rows[_rows.length - 1];
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
        aspect: currentAspect,
        images: 1,
        startIndex: currentRow.startIndex + currentRow.images,
        isWhole: false,
      });
    }

    return R.indexBy(R.prop("startIndex"), _rows);
  }, [aspectRatios, targetAspect]);
  console.log("🚀 ~ rows ~ rows:", rows);

  return (
    <div className="">
      {Object.values(rows).map((row) => (
        <MasonryRow
          items={items.slice(row.startIndex, row.startIndex + row.images)}
          key={row.startIndex}
          row={row}
          targetAspect={targetAspect}
        />
      ))}
    </div>
  );
}
