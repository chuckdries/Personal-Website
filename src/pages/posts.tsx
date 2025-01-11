import React, { useMemo } from "react";
import { graphql, Link, PageProps } from "gatsby";
import { PostsLayout } from "../components/Posts/PostsLayout";
import { useDateFormatter } from "react-aria";
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import { PostListingCarousel } from "../components/Posts/PostListingCarousel";

export type GalleryImages = NonNullable<
  Queries.PostsPageQuery["allMdx"]["nodes"][number]["frontmatter"]
>["galleryImages"];

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
        <div key={node.frontmatter!.slug}>
          <div className="w-full prose mx-auto p-4 md:p-6">
            <div className="z-10 bg-white">
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
            </div>
          </div>
          <PostListingCarousel
            galleryImages={node.frontmatter?.galleryImages}
          />
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
              gatsbyImageData(height: 250)
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
