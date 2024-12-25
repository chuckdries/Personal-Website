import React, { useMemo } from "react";
import { graphql, PageProps } from "gatsby";
import { MDXProvider } from "@mdx-js/react";
import { Link } from "gatsby";
import { PostsLayout } from "./PostsLayout";
import { useDateFormatter } from "react-aria";
import { PostImage } from "./PostImage";

const components = {
  Link,
  PostImage,
  p(props: any) {
    return <p className="mx-auto prose lg:prose-xl" {...props} />;
  }
};

export default function PageTemplate({
  data,
  children,
}: PageProps<Queries.PostPageQuery>) {
  const date = useMemo(
    () => data.mdx?.frontmatter?.date && new Date(data.mdx!.frontmatter!.date),
    [data.mdx],
  );
  const df = useDateFormatter({
    timeZone: "utc",
  });
  return (
    <PostsLayout title={data.mdx!.frontmatter!.title}>
      <div className="font-serif px-4 md:px-6 mx-auto pb-7">
        <div className="mx-auto prose lg:prose-xl ">
          <h1 style={date ? { marginBottom: 0 } : {}}>
            {data.mdx!.frontmatter!.title}
          </h1>
          {date && <p style={{ marginTop: 0 }}>{df.format(date)}</p>}
        </div>
        <MDXProvider components={components}>{children}</MDXProvider>
      </div>
    </PostsLayout>
  );
}

export const query = graphql`
  query PostPage($id: String!) {
    mdx(id: { eq: $id }) {
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
          }
        }
      }
    }
  }
`;
