import React, { useMemo } from "react";
import { graphql, PageProps } from "gatsby";
import { MDXProvider } from "@mdx-js/react";
import { Link } from "gatsby";
import { useDateFormatter } from "react-aria";

import { PostsLayout } from "./PostsLayout";
import { PostImage } from "./PostImage";
import { PostImageGroup } from "./PostImageGroup";

const components = {
  Link,
  PostImage,
  PostImageGroup,
};

export default function PageTemplate({
  data,
  children,
}: PageProps<Queries.PostPageQuery>) {
  const date = useMemo(
    () => data.mdx?.frontmatter?.date && new Date(data.mdx!.frontmatter!.date),
    [data.mdx],
  );
  const df = useDateFormatter({});
  return (
    <PostsLayout
      description={data.mdx!.excerpt}
      title={data.mdx!.frontmatter!.title}
    >
      <div className="mx-auto prose px-2">
        <h1 style={date ? { marginBottom: 0 } : {}}>
          {data.mdx!.frontmatter!.title}
        </h1>
        {date && <p style={{ marginTop: 0 }}>{df.format(date)}</p>}
        <MDXProvider components={components}>{children}</MDXProvider>
      </div>
    </PostsLayout>
  );
}

export const query = graphql`
  query PostPage($id: String!) {
    mdx(id: { eq: $id }) {
      excerpt
      frontmatter {
        title
        date
        slug
        galleryImages {
          base
          fields {
            organization {
              slug
            }
            imageMeta {
              dateTaken
              meta {
                Make
                Model
                ExposureTime
                FNumber
                ISO
                DateTimeOriginal
                CreateDate
                ShutterSpeedValue
                ApertureValue
                FocalLength
                LensModel
                ObjectName
                Caption
                Location
                City
                State
                Keywords
              }
            }
          }
          childImageSharp {
            gatsbyImageData(width: 700, placeholder: BLURRED)
            fluid {
              aspectRatio
            }
          }
        }
      }
    }
  }
`;
