import React, { useMemo } from "react";
import { graphql, Link, PageProps } from "gatsby";
import { PostsLayout } from "../components/Posts/PostsLayout";
import { useDateFormatter } from "react-aria";
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import { PostListingCarousel } from "../components/PostListing/PostListingCarousel";
import { PostListing } from "../components/PostListing/PostListing";

export type GalleryImages = NonNullable<
  Queries.PostsPageQuery["allMdx"]["nodes"][number]["frontmatter"]
>["galleryImages"];

export type PostsNode = Queries.PostsPageQuery["allMdx"]["nodes"][number];

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
        <PostListing df={df} key={node.frontmatter!.slug} node={node} />
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
              gatsbyImageData(height: 250, placeholder: DOMINANT_COLOR)
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
