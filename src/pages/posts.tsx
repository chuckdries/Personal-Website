import React from "react";
import { graphql, Link, PageProps } from "gatsby";
import { PostsLayout } from "../components/Posts/PostsLayout";
import { useDateFormatter } from "react-aria";

function Posts({ data }: PageProps<Queries.PostsPageQuery>) {
  const df = useDateFormatter({
    timeZone: 'utc'
  });
  return (
    <PostsLayout>
      {data.allMdx.nodes.map((node) => (
        <div className="p-4 md:p-6" key={node.frontmatter!.slug}>
          <Link className="underline text-blue-600 visited:text-purple-600 font-bold text-xl" to={`/posts${node.frontmatter!.slug}`}>
            {node.frontmatter!.title}
          </Link>
          {node.frontmatter?.date && (
            <p className="text-sm opacity-60">
              {df.format(new Date(node.frontmatter.date))}
            </p>
          )}
          <p>{node.excerpt}</p>
        </div>
      ))}
    </PostsLayout>
  );
}

export default Posts;

export const query = graphql`
  query PostsPage {
    allMdx {
      nodes {
        id
        frontmatter {
          title
          slug
          date
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
