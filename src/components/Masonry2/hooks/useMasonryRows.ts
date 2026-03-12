import { useMemo } from "react";
import type { MasonryGroup, MasonryImageRow, MasonryRowData } from "../MasonryContainer";

export function useMasonryRows(targetAspect: number, groups: MasonryGroup[]): MasonryRowData[] {
  return useMemo(() => {
    const _rows: MasonryRowData[] = [];

    for (let i = 0; i < groups.length; i++) {
      const group = groups[i];
      _rows.push({
        type: "l",
        aspect: targetAspect * 1.7,
        month: group.month,
        year: group.year,
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
        const currentAspect = node.aspectRatio;

        const currentRow = _rows[_rows.length - 1] as MasonryImageRow;
        const currentDiff = Math.abs(targetAspect - currentRow.aspect);
        const diffIfImageIsAddedToCurrentRow = Math.abs(
          targetAspect - (currentRow.aspect + currentAspect),
        );

        if (currentDiff > diffIfImageIsAddedToCurrentRow) {
          currentRow.aspect += currentAspect;
          currentRow.images += 1;
          continue;
        }

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
  }, [groups, targetAspect]);
}
