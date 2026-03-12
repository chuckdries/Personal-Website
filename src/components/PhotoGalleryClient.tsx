import * as React from "react";
import * as R from "ramda";

import MasonryGallery from "./MasonryGallery";
import KeywordsPicker from "./KeywordsPicker";
import { compareDates, getGalleryPageUrl } from "../utils";
import { Item, Select } from "./Select";
import { ToggleButton } from "./ToggleButton";
import type { MasonryPhotoData } from "../types";

const SORT_KEYS: Record<string, string[]> = {
  rating: ["meta", "Rating"],
  date: ["dateTaken"],
  datePublished: ["datePublished"],
};

function smartCompareDates(
  key: string,
  left: MasonryPhotoData,
  right: MasonryPhotoData,
) {
  let diff = compareDates(SORT_KEYS[key], left, right);
  if (diff !== 0) {
    return diff;
  }
  return compareDates(SORT_KEYS.date, left, right);
}

interface PhotoGalleryClientProps {
  allImages: MasonryPhotoData[];
}

export function PhotoGalleryClient({ allImages }: PhotoGalleryClientProps) {
  const [filterKeyword, setFilterKeyword] = React.useState<string | null>(null);
  const [sortKey, setSortKey] = React.useState("rating");
  const [showDebug, setShowDebug] = React.useState(false);

  // Read initial state from URL
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const filter = params.get("filter");
    const sort = params.get("sort") ?? "rating";
    const debug = Boolean(params.get("debug")?.length);
    if (filter) setFilterKeyword(filter);
    setSortKey(sort);
    setShowDebug(debug);
  }, []);

  const hash = typeof window !== "undefined" ? window.location.hash.replace("#", "") : "";

  const onKeywordPick = React.useCallback((newKeyword: string | null) => {
    if (newKeyword) {
      try {
        window.plausible("Filter Keyword", {
          props: { keyword: newKeyword },
        });
      } catch (e) {
        // do nothing
      }
    }
  }, []);

  const handleSetSortKey = React.useCallback(
    (newSortKey: string) => {
      try {
        window.plausible("Sort Gallery", {
          props: { key: newSortKey },
        });
      } catch (e) {
        // do nothing
      }
      setSortKey(newSortKey);
      window.history.replaceState(
        null,
        "",
        getGalleryPageUrl(
          { sortKey: newSortKey, keyword: filterKeyword, showDebug },
          hash,
        ),
      );
    },
    [filterKeyword, hash, showDebug],
  );

  const images: MasonryPhotoData[] = React.useMemo(() => {
    const sort =
      sortKey === "date" || sortKey === "datePublished"
        ? R.sort((node1: MasonryPhotoData, node2: MasonryPhotoData) =>
            smartCompareDates(sortKey, node1, node2),
          )
        : R.sort(
            R.descend(R.path<MasonryPhotoData>(SORT_KEYS[sortKey] ?? SORT_KEYS.rating) as any),
          );

    const filter = filterKeyword
      ? R.filter((image: MasonryPhotoData) =>
          R.includes(filterKeyword, image.meta.Keywords ?? []),
        )
      : R.identity;

    try {
      return R.pipe(sort as any, filter as any)(allImages) as MasonryPhotoData[];
    } catch (e) {
      console.log("caught images!", e);
      return [];
    }
  }, [allImages, sortKey, filterKeyword]);

  const [dbgTags, setDbgTags] = React.useState(false);
  const [dbgSortKey, setDbgSortKey] = React.useState(false);
  const [dbgRating, setDbgRating] = React.useState(false);
  const [dbgName, setDbgName] = React.useState(false);
  const dataFn = React.useCallback(
    (image: MasonryPhotoData): string[] | null => {
      if (!showDebug) {
        return null;
      }
      let data: string[] = [];
      if (dbgName) {
        data.push(image.filename);
      }
      if (dbgRating) {
        data.push(String(image.meta.Rating ?? "x"));
      }
      if (dbgSortKey) {
        switch (sortKey) {
          case "rating": {
            data.push(String(image.meta.Rating ?? "x"));
            break;
          }
          case "date":
          case "datePublished": {
            const date = sortKey === "date" ? image.dateTaken : image.datePublished;
            if (date) {
              data.push(new Date(date).toLocaleString());
            } else {
              data.push("x");
            }
            break;
          }
        }
      }
      if (dbgTags) {
        data.push(image.meta.Keywords?.join(",") ?? "x");
      }
      return data;
    },
    [showDebug, sortKey, dbgName, dbgRating, dbgSortKey, dbgTags],
  );

  return (
    <>
      <div className="top-0 z-10">
        {sortKey !== "datePublished" && (
          <div className="gradient pb-6 mb-4">
            <div className="px-4 md:px-8 flex items-baseline">
              <h3 className="mx-2 font-bold" id="recently">
                Recently published
              </h3>
              {sortKey !== "datePublished" && (
                <a
                  className="underline cursor-pointer text-gray-500"
                  href="?sort=datePublished#all"
                >
                  show more
                </a>
              )}
            </div>
          </div>
        )}
        <div className="px-4 md:px-8">
          <h3 className="mx-2 font-bold" id="all">
            All images
          </h3>
        </div>
        <div className="flex flex-col lg:flex-row lg:items-end justify-between px-4 md:px-8 sm:mx-auto">
          <KeywordsPicker
            getHref={(val, selected) =>
              selected
                ? getGalleryPageUrl({ keyword: null, sortKey, showDebug }, hash)
                : getGalleryPageUrl({ keyword: val, sortKey, showDebug }, hash)
            }
            keywords={[
              "winter",
              "night",
              "coast",
              "landscape",
              "flowers",
              "product",
              "fireworks",
              "sunset",
            ]}
            onPick={onKeywordPick}
            value={filterKeyword}
          />
          <div className="my-2 mx-2 flex flex-row items-end">
            {showDebug && (
              <div className="mr-1">
                <ToggleButton isSelected={dbgName} onChange={setDbgName}>
                  name
                </ToggleButton>
                <ToggleButton isSelected={dbgRating} onChange={setDbgRating}>
                  rating
                </ToggleButton>
                <ToggleButton isSelected={dbgSortKey} onChange={setDbgSortKey}>
                  sort key
                </ToggleButton>
                <ToggleButton isSelected={dbgTags} onChange={setDbgTags}>
                  tags
                </ToggleButton>
              </div>
            )}
            <Select
              label="Sort by..."
              // @ts-expect-error React.key, but string is more convenient for the state
              onSelectionChange={handleSetSortKey}
              selectedKey={sortKey}
            >
              <Item key="rating">Curated</Item>
              <Item key="datePublished">Date published</Item>
              <Item key="date">Date taken</Item>
            </Select>
          </div>
        </div>
      </div>
      <MasonryGallery
        aspectsByBreakpoint={{
          xs: 1.5,
          sm: 2,
          md: 2.5,
          lg: 3,
          xl: 3.8,
          "2xl": 4.9,
          "3xl": 6.1,
        }}
        dataFn={dataFn}
        images={images}
      />
    </>
  );
}
