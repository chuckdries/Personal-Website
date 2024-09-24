import { Link, PageProps, graphql, navigate } from "gatsby";
import React, { useLayoutEffect, useMemo } from "react";
import * as R from "ramda";
import ChevronLeft from "@spectrum-icons/workflow/ChevronLeft";

import { MasonryContainer, MasonryGroup } from "../Masonry2/MasonryContainer";
import { PhotoLayout } from "./PhotoLayout";
import { MasonryRow } from "../Masonry2/MasonryRow";
import Nav from "../Nav";

export type PhotoMonthNode = Queries.PhotoMonthQuery["images"]["nodes"][number];

function PhotoMonth({
  pageContext,
  data,
}: PageProps<Queries.PhotoMonthQuery, { monthSlug: string }>) {
  const groups: MasonryGroup[] = useMemo(
    () => [
      {
        slug: pageContext.monthSlug,
        label: pageContext.monthSlug,
        month: pageContext.monthString,
        year: pageContext.year,
        nodes: R.clone(data.images.nodes),
      },
    ],
    [
      data.images.nodes,
      pageContext.monthSlug,
      pageContext.year,
      pageContext.monthString,
    ],
  );
  return (
    <PhotoLayout omitNav>
      <MasonryContainer groups={groups}>
        {(row, { index, style }, targetAspect, width) => {
          switch (row.type) {
            case "c":
              return (
                <div className="h-[200px] flex flex-col">
                  <Nav className="mb-4" scheme="dark" />
                </div>
              );
            case "l":
              return (
                <div className="relative" key={row.slug} style={style}>
                  <div className="p-4 lg:pl-8 flex flex-col justify-end h-full">
                    <h2 className="text-3xl md:text-4xl m-0 md:m-1 font-bold flex items-stretch">
                      <Link
                        className="hover:bg-gray-800 p-1 rounded mr-2 flex items-center text-white"
                        to="/photos"
                      >
                        <ChevronLeft
                          UNSAFE_style={{ width: "24px", margin: 0 }}
                        />
                      </Link>
                      <Link
                        className="text-white hover:underline"
                        to={row.slug}
                      >
                        {row.slug === "Older" ? (
                          row.slug
                        ) : (
                          <>
                            <span className="font-bold">{row.month}</span>
                            <span className="font-extralight opacity-70">
                              {" "}
                              {row.year}
                            </span>
                          </>
                        )}
                      </Link>
                    </h2>
                  </div>
                </div>
              );
            case "i":
              return (
                <div
                  className="relative flex"
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
      </MasonryContainer>
      <></>
      {/* <h1>{pageContext.monthSlug}</h1> */}
      {/* <div>
        <MasonryContainer groups={groups} />
      </div> */}
    </PhotoLayout>
  );
}

export default PhotoMonth;

export const query = graphql`
  query PhotoMonth($monthSlug: String) {
    images: allFile(
      filter: {
        sourceInstanceName: { eq: "photos" }
        fields: { organization: { monthSlug: { eq: $monthSlug } } }
      }
      sort: { fields: { imageMeta: { dateTaken: DESC } } }
    ) {
      nodes {
        id
        relativePath
        fields {
          organization {
            monthSlug
            month
            year
            slug
          }
          imageMeta {
            dateTaken
            meta {
              Rating
            }
          }
        }
        childImageSharp {
          fluid {
            aspectRatio
          }
          gatsbyImageData(
            layout: CONSTRAINED
            width: 500
            placeholder: DOMINANT_COLOR
          )
        }
      }
    }
  }
`;
