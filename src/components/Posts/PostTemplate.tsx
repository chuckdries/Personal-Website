import React, { useMemo, useReducer, useState } from "react";
import { graphql, PageProps } from "gatsby";
import { MDXProvider } from "@mdx-js/react";
import { Link } from "gatsby";
import { useDateFormatter } from "react-aria";
import { useSpring, animated } from "@react-spring/web";

import "./PostTemplate.css";
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
      <h2
        {...props}
        // className="pt-[50px] mt-[-50px]"
      >
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
  const tocEntries = data.mdx?.tableOfContents?.items as TOCEntry[] | undefined;

  const tocSpring = useSpring({
    top: activeEntry ? 0 : -200,
  });

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
      {/* {tocEntries && (
        <animated.div
          className={classNames(
            "fixed left-0 right-0 ",
            "flex p-1 justify-center",
          )}
          style={tocSpring}
        >
          <div
            className={classNames(
              "backdrop-blur-lg bg-stone-200/50 rounded-full",
              "flex flex-nowrap overflow-auto justify-between gap-2",
            )}
          >
            {tocEntries.map(({ title, url }) => (
              <TocEntry
                isActive={activeEntry === url}
                key={url}
                onTargetScrollIntoView={setActiveEntry}
                title={title}
                url={url}
              />
            ))}
          </div>
        </animated.div>
      )} */}
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
            gatsbyImageData(width: 1400, placeholder: DOMINANT_COLOR)
            fluid {
              aspectRatio
            }
          }
        }
      }
    }
  }
`;
