import React, { useMemo } from "react";
import { graphql, Link, PageProps } from "gatsby";
import { PostsLayout } from "../components/Posts/PostsLayout";
import { useDateFormatter } from "react-aria";
import { GatsbyImage, getImage } from "gatsby-plugin-image";

function Posts({ data }: PageProps<Queries.PostsPageQuery>) {
  const df = useDateFormatter({
    timeZone: "utc",
  });
  const filteredPosts = useMemo(() => {
    const today = new Date();
    return data.allMdx.nodes.filter(
      (node) =>
        node.frontmatter?.date && today > new Date(node.frontmatter?.date),
    );
  }, [data.allMdx.nodes]);
  return (
    <PostsLayout>
      {filteredPosts.map((node) => (
        <div
          className="w-full prose  mx-auto p-4 md:p-6"
          key={node.frontmatter!.slug}
        >
          {node.frontmatter?.date && (
            <span className="block text-sm opacity-60">
              {df.format(new Date(node.frontmatter.date))}
            </span>
          )}
          <Link
            className="underline text-blue-600 visited:text-purple-600 font-bold text-xl"
            to={`/posts${node.frontmatter!.slug}`}
          >
            {node.frontmatter!.title}
          </Link>
          <p className="my-0 not-prose">{node.excerpt}</p>
          {/* {node.frontmatter?.galleryImages?.length && (
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
          )} */}
        </div>
      ))}
    </PostsLayout>
  );
}

export default Posts;

export const query = graphql`
  query PostsPage {
    allMdx(sort: { frontmatter: { date: DESC } }) {
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
