import React, { useEffect, useMemo, useState } from "react";
import * as R from "ramda";
import { PageProps, graphql } from "gatsby";
import { MasonryContainer } from "../Masonry2/MasonryContainer";
import { PhotoLayout } from "./PhotoLayout";
import { usePhotoGroupsFromNodes } from "./usePhotoGroups";
import { PhotoMasonryRenderer } from "./PhotoMasonryRenderer";

function PhotoKeyword({
  data,
  pageContext,
}: PageProps<Queries.PhotoKeywordQuery, { keyword: string }>) {
  // Filter photos by keyword
  const filteredNodes = useMemo(() => {
    return R.filter((node) => {
      const keywords = node.fields?.imageMeta?.meta?.Keywords;
      if (!keywords || !Array.isArray(keywords)) {
        return false;
      }
      return R.includes(pageContext.keyword, keywords);
    }, data.allFile.nodes);
  }, [data.allFile.nodes, pageContext.keyword]);

  const [groups] = usePhotoGroupsFromNodes(filteredNodes);

  const [initialScroll, setInitialScroll] = useState(0);
  useEffect(() => {
    const prevScroll = sessionStorage.getItem(`photos-${pageContext.keyword}-scroll`);
    if (prevScroll) {
      setInitialScroll(Number(prevScroll));
    }
  }, [pageContext.keyword]);

  return (
    <PhotoLayout omitNav>
      <div className="flex-auto relative w-screen">
        <MasonryContainer
          groups={groups}
          onScroll={(data) => {
            sessionStorage.setItem(
              `photos-${pageContext.keyword}-scroll`,
              `${data.scrollOffset}`,
            );
          }}
          scrollPosition={initialScroll}
          keyword={pageContext.keyword}
        >
          {(row, props, targetAspect, width, _allImages, keyword) => (
            <PhotoMasonryRenderer
              row={row}
              props={props}
              targetAspect={targetAspect}
              width={width}
              groups={groups}
              keyword={keyword}
            />
          )}
        </MasonryContainer>
      </div>
    </PhotoLayout>
  );
}

export default PhotoKeyword;

export const query = graphql`
  query PhotoKeyword {
    allFile(
      filter: { sourceInstanceName: { eq: "photos" } }
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
            yearFolder
            slug
          }
          imageMeta {
            dateTaken
            meta {
              Rating
              Keywords
            }
          }
        }
        childImageSharp {
          fluid {
            aspectRatio
          }
          gatsbyImageData(
            layout: CONSTRAINED
            height: 550
            placeholder: DOMINANT_COLOR
          )
        }
      }
    }
  }
`;

