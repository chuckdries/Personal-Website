import { PageProps, graphql } from "gatsby";
import { GatsbyImage } from "gatsby-plugin-image";
import React, { useMemo } from "react";
import * as R from "ramda";

function PhotoYear({
  pageContext,
  data,
}: PageProps<Queries.PhotoYearQuery, { year: string }>) {
  const months = useMemo(() => {
    return R.pipe(
      R.map(
        // @ts-expect-error shrug
        R.evolve({
          fieldValue: parseInt,
        }),
      ),
      R.sortBy(R.prop("fieldValue")),
    )(data.allFile.group!) as typeof data['allFile']['group'];
  }, [data.allFile.group]);
  
  return (
    <>
      <h1>{pageContext.year}</h1>
      <div>
        {months.map((group) => (
          <div key={group.fieldValue}>
            {group.fieldValue}
            {group.nodes.map((node) => (
              <GatsbyImage
                key={node.id}
                image={node.childImageSharp!.gatsbyImageData}
                alt={node.relativePath}
              />
            ))}
          </div>
        ))}
      </div>
    </>
  );
}

export default PhotoYear;

export const query = graphql`
  query PhotoYear($year: String) {
    allFile(
      filter: {
        sourceInstanceName: { eq: "photos" }
        fields: {
          organization: { yearFolder: { eq: $year } }
          imageMeta: { meta: { Rating: { ne: null } } }
        }
      }
      sort: { fields: { imageMeta: { meta: { Rating: DESC } } } }
    ) {
      group(field: { fields: { organization: { month: SELECT } } }, limit: 5) {
        fieldValue
        nodes {
          id
          relativePath
          fields {
            organization {
              monthSlug
              month
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
              height: 550
              placeholder: DOMINANT_COLOR
            )
          }
        }
      }
    }
  }
`;
