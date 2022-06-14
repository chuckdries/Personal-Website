import * as React from "react";
import { graphql, Link } from "gatsby";
import Layout from "../../components/Layout";

const BlogPage = ({ data }) => {
  return (
    <Layout pageTitle="My Blog Posts">
      <ul className="container mx-auto">
        {data.allMdx.nodes.map((node) => (
          <li key={node.id}>
            <article>
              <Link to={`/blog/${node.slug}`}>
                <span>/blog/{node.slug.toLowerCase()}</span>
                <h2>{node.frontmatter.title}</h2>
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
