import React, { useMemo, useState } from "react";
import { graphql, PageProps } from "gatsby";
import { MDXProvider } from "@mdx-js/react";
import { Link } from "gatsby";
import { useDateFormatter } from "react-aria";

import "./PostTemplate.css"
import { PostsLayout } from "./PostsLayout";
import { PostImage } from "./PostImage";
import { PostImageGroup } from "./PostImageGroup";
import "bluesky-comments/bluesky-comments.css";
// @ts-ignore
import { BlueskyComments } from "bluesky-comments";
import classNames from "classnames";
import { TOCEntry, TocEntry } from "./TOCEntry";

const components = {
  Link,
  PostImage,
  PostImageGroup,
  h2({ children, ...props }: any) {
    return (
      <h2 {...props}>
        <div className="w-1/2 mx-auto border-t pt-4 border-slate-400" />
        {children}
      </h2>
    );
  },
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
  const [activeEntry, setActiveEntry] = useState<string | null>(null);
  const tocEntries = (data.mdx?.tableOfContents?.items as TOCEntry[] | undefined);
  return (
    <PostsLayout
      cover={data.mdx?.frontmatter?.cover?.childImageSharp?.original?.src}
      description={data.mdx!.excerpt}
      title={data.mdx!.frontmatter!.title}
    >
      <div className="mx-auto prose px-4">
        <h1 style={date ? { marginBottom: 0 } : {}}>
          {data.mdx!.frontmatter!.title}
        </h1>
        {date && <p style={{ marginTop: 0 }}>{df.format(date)}</p>}
        <MDXProvider components={components}>{children}</MDXProvider>
        <section className="not-prose">
          {/* <h2>Comments</h2> */}
          <BlueskyComments author="chuckdries.com" />
        </section>
      </div>
      {tocEntries && <div
        className={classNames(
          "fixed bottom-0 left-0 right-0 backdrop-blur-lg bg-stone-300/50",
          "flex flex-nowrap overflow-auto p-2 px-4 justify-between",
        )}
      >
        {tocEntries.map(
          ({ title, url }) => (
            <TocEntry
              isActive={activeEntry === url}
              key={url}
              onTargetScrollIntoView={setActiveEntry}
              title={title}
              url={url}
            />
          ),
        )}
      </div>}
    </PostsLayout>
  );
}

export const query = graphql`
  query PostPage($id: String!) {
    mdx(id: { eq: $id }) {
      excerpt
      tableOfContents
      frontmatter {
        title
        date
        cover {
          childImageSharp {
            original {
              src
            }
          }
        }
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
            gatsbyImageData(layout: FULL_WIDTH, placeholder: BLURRED)
            fluid {
              aspectRatio
            }
          }
        }
      }
    }
  }
`;
