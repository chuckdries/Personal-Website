import React, { useEffect, useState } from "react";
import { PageProps, graphql } from "gatsby";
import { MasonryContainer } from "../components/Masonry2/MasonryContainer";
import { PhotoLayout } from "../components/photos/PhotoLayout";
import { usePhotoGroups } from "../components/photos/usePhotoGroups";
import { PhotoMasonryRenderer } from "../components/photos/PhotoMasonryRenderer";

const Photos = ({ data }: PageProps<Queries.AllPhotoGroupedQuery>) => {
  const [groups] = usePhotoGroups(data.allFile);

  const [initialScroll, setInitialScroll] = useState(0);
  useEffect(() => {
    // TODO: keep in router state
    const prevScroll = sessionStorage.getItem("photos-scroll");
    if (prevScroll) {
      setInitialScroll(Number(prevScroll));
    }
  }, []);

  return (
    <PhotoLayout omitNav>
      {/* <div className="flex-auto relative w-[calc(100vw-120px)]"> */}
      <div className="flex-auto relative w-screen">
        {/* TODO take childrenHeight prop? */}
        <MasonryContainer
          groups={groups}
          onScroll={(data) => {
            sessionStorage.setItem("photos-scroll", `${data.scrollOffset}`);
          }}
          scrollPosition={initialScroll}
          allImages={data.allPhotos?.nodes}
        >
          {(row, props, targetAspect, width, allImages) => (
            <PhotoMasonryRenderer
              row={row}
              props={props}
              targetAspect={targetAspect}
              width={width}
              groups={groups}
              allImages={allImages}
            />
          )}
        </MasonryContainer>
      </div>
      {/* hypothetical API uses like a collection of <Masonry(Content|Label|Image)Row aspect={aspect}>...</> passed to children */}
      {/* <div
        className="h-screen w-[120px]"
        style={{ position: "fixed", top: 0, right: 0 }}
      >
        <TimelineSlider stops={stops} />
      </div> */}
    </PhotoLayout>
  );
};

export default Photos;

export const query = graphql`
  query AllPhotoGrouped {
    allFile(
      filter: { sourceInstanceName: { eq: "photos" } }
      sort: { fields: { imageMeta: { dateTaken: DESC } } }
    ) {
      group(field: { fields: { organization: { yearFolder: SELECT } } }) {
        fieldValue
        group(field: { fields: { organization: { month: SELECT } } }) {
          fieldValue
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
    }
    allPhotos: allFile(
      filter: { sourceInstanceName: { eq: "photos" } }
      sort: { fields: { imageMeta: { dateTaken: DESC } } }
    ) {
      nodes {
        id
        fields {
          imageMeta {
            meta {
              Keywords
            }
          }
        }
        childImageSharp {
          gatsbyImageData(
            layout: CONSTRAINED
            height: 550
            placeholder: DOMINANT_COLOR
          )
          fluid {
            aspectRatio
          }
        }
      }
    }
  }
`;
