import React from "react";
import { graphql, Link, PageProps } from "gatsby";
import { PostsLayout } from "../components/Posts/PostsLayout";
import { useDateFormatter } from "react-aria";
import { GatsbyImage, getImage } from "gatsby-plugin-image";

function Posts({ data }: PageProps<Queries.PostsPageQuery>) {
  const df = useDateFormatter({
    timeZone: "utc",
  });
  return (
    <PostsLayout>
      {data.allMdx.nodes.map((node) => (
        <div className="w-full max-w-[1200px] mx-auto p-4 md:p-6" key={node.frontmatter!.slug}>
            <Link
              className="underline text-blue-600 visited:text-purple-600 font-bold text-xl"
              to={`/posts${node.frontmatter!.slug}`}
            >
              {node.frontmatter!.title}
            </Link>
            {node.frontmatter?.date && (
              <p className="text-sm opacity-60">
                {df.format(new Date(node.frontmatter.date))}
              </p>
            )}
            <p>{node.excerpt}</p>
          {node.frontmatter?.galleryImages?.length && (
            <div className="overflow-x-scroll w-full rounded-md mt-2">
              <div className="min-w-[max-content] flex gap-2">
              {node.frontmatter.galleryImages.map((image) => (
                <GatsbyImage
                  alt=""
                  // @ts-expect-error idk man
                  image={getImage(image)!}
                  key={image?.base}
                />
              ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </PostsLayout>
  );
}

export default Posts;

export const query = graphql`
  query PostsPage {
    allMdx(sort: {frontmatter: {date: DESC}}) {
      nodes {
        id
        frontmatter {
          title
          slug
          date
          galleryImages {
            base
            childImageSharp {
              gatsbyImageData(height: 300)
            }
          }
        }
        excerpt
        internal {
          contentFilePath
          contentDigest
        }
      }
    }
  }
`;
