import * as React from "react";
import { graphql, Link } from "gatsby";
import Layout from "../../components/Layout";

const BlogPage = ({ data }) => {
  return (
    <Layout className="font-serif" pageTitle="Chuck's Blog">
      <h1 className="max-w-[600px] mx-auto text-4xl font-black mb-4">Chuck&apos;s Blog</h1>
      <ul className="max-w-[600px] mx-auto">
        {data.allMdx.nodes.map((node) => (
          <li key={node.id}>
            <article>
              <Link to={`/blog/${node.slug}`}>
                <span>/blog/{node.slug.toLowerCase()}</span>
                <h2 className="font-bold text-3xl">{node.frontmatter.title}</h2>
              </Link>
              <span>{node.frontmatter.date}</span>
            </article>
          </li>
        ))}
      </ul>
    </Layout>
  );
};

export const query = graphql`
  query {
    allMdx(sort: { fields: frontmatter___date, order: DESC }) {
      nodes {
        slug
        id
        excerpt
        frontmatter {
          title
          date(formatString: "MMMM D, YYYY")
        }
      }
    }
  }
`;

export default BlogPage;
