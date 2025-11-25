import { useMemo } from "react";
import * as R from "ramda";
import { MasonryGroup } from "../Masonry2/MasonryContainer";
import { TimelineStop } from "../Masonry2/TimelineSlider";

type PhotoNode = {
  fields: {
    organization: {
      monthSlug: string | null;
      month: string | null;
      year: number | null;
      yearFolder: string | null;
    };
  };
};

export function usePhotoGroups(
  data: Queries.AllPhotoGroupedQuery["allFile"],
): [MasonryGroup[], TimelineStop[]] {
  return useMemo((): [MasonryGroup[], TimelineStop[]] => {
    const _groups: MasonryGroup[] = [];
    const stops: TimelineStop[] = [];
    const sortedYears = R.sort((a, b) => {
      if (a.fieldValue === "Older") {
        return 1;
      }
      if (b.fieldValue === "Older") {
        return -1;
      }
      return Number(b.fieldValue!) - Number(a.fieldValue!);
    }, data.group);

    for (const year of sortedYears) {
      stops.push({
        slug: year.fieldValue!,
        tickLabel: year.fieldValue!,
        emphasis: year.fieldValue === "Older" ? 1 : 2,
      });
      if (year.fieldValue === "Older") {
        _groups.push({
          slug: "Older",
          tickLabel: "Older",
          month: null,
          year: null,
          nodes: R.flatten(year.group.map((m) => m.nodes)),
        });
      } else {
        const sortedMonths = R.sort(
          (a, b) => Number(b.fieldValue!) - Number(a.fieldValue!),
          year.group,
        );
        for (const month of sortedMonths) {
          const monthName = month.nodes[0].fields!.organization!.monthSlug?.split("/")[1]!;
          _groups.push({
            slug: month.nodes[0].fields!.organization!.monthSlug!,
            tickLabel: `${monthName} ${month.nodes[0].fields!.organization!.year!}`,
            year: String(month.nodes[0].fields!.organization!.year!),
            month: monthName,
            nodes: R.clone(month.nodes),
          });
        }
      }
    }
    return [_groups, stops];
  }, [data.group]);
}

export function usePhotoGroupsFromNodes(
  nodes: PhotoNode[],
): [MasonryGroup[], TimelineStop[]] {
  return useMemo((): [MasonryGroup[], TimelineStop[]] => {
    const _groups: MasonryGroup[] = [];
    const stops: TimelineStop[] = [];

    // Group by yearFolder
    const byYear = R.groupBy(
      (node) => node.fields?.organization?.yearFolder || "Older",
      nodes,
    );

    const sortedYears = R.sort((a, b) => {
      if (a === "Older") {
        return 1;
      }
      if (b === "Older") {
        return -1;
      }
      return Number(b) - Number(a);
    }, Object.keys(byYear));

    for (const yearKey of sortedYears) {
      const yearNodes = byYear[yearKey];
      if (!yearNodes || yearNodes.length === 0) continue;

      stops.push({
        slug: yearKey,
        tickLabel: yearKey,
        emphasis: yearKey === "Older" ? 1 : 2,
      });

      if (yearKey === "Older") {
        _groups.push({
          slug: "Older",
          tickLabel: "Older",
          month: null,
          year: null,
          nodes: yearNodes as any,
        });
      } else {
        // Group by month within year (month is a number 1-12)
        const byMonth = R.groupBy(
          (node) => String(node.fields?.organization?.month || ""),
          yearNodes,
        );

        const sortedMonths = R.sort(
          (a, b) => {
            const aNum = Number(a);
            const bNum = Number(b);
            if (isNaN(aNum) || isNaN(bNum)) return 0;
            return bNum - aNum;
          },
          Object.keys(byMonth),
        );

        for (const monthKey of sortedMonths) {
          const monthNodes = byMonth[monthKey];
          if (!monthNodes || monthNodes.length === 0) continue;

          const firstNode = monthNodes[0];
          const monthSlug = firstNode.fields?.organization?.monthSlug;
          const monthName = monthSlug?.split("/")[1] || "";
          const year = String(firstNode.fields?.organization?.year || "");

          _groups.push({
            slug: monthSlug || "",
            tickLabel: `${monthName} ${year}`,
            year,
            month: monthName,
            nodes: monthNodes as any,
          });
        }
      }
    }

    return [_groups, stops];
  }, [nodes]);
}

