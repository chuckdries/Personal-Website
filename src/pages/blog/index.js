import * as React from "react";
import { graphql, Link } from "gatsby";
import Layout from "../../components/Layout";

const BlogPage = ({ data }) => {
  return (
    <Layout pageTitle="My Blog Posts">
      <ul>
        {data.allMdx.nodes.map((node) => (
          <li key={node.id}>
            <Link to={`/blog/${node.slug}`}>
              <span>{node.slug.toLowerCase()}</span>
              <h2>{node.frontmatter.title}</h2>
            </Link>
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
          date
        }
      }
    }
  }
`;

export default BlogPage;
