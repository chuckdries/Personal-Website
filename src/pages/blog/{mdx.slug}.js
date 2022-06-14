import { graphql, Link } from "gatsby";
import { getImage, GatsbyImage } from "gatsby-plugin-image";
import { MDXRenderer } from "gatsby-plugin-mdx";
import * as React from "react";
import Layout from "../../components/Layout";

const BlogPost = ({ data }) => {
  const image = getImage(data.mdx.frontmatter.hero_image);
  const caption = [
    data.mdx.frontmatter.hero_image.fields.imageMeta.meta.ObjectName,
    data.mdx.frontmatter.hero_image.fields.imageMeta.meta.Caption,
  ].join("-");
  return (
    <Layout pageTitle={data.mdx.frontmatter.title}>
      <div className="container mx-auto p-2 bg-gray-200">
        <div className="flex flex-col lg:w-1/2">
          <GatsbyImage className="" image={image} alt={caption} />
          <span className="flex-auto">
            <Link to={`/photogallery/${data.mdx.frontmatter.hero_image.base}`}>
              {data.mdx.frontmatter.hero_image.base}
            </Link>
          </span>
        </div>
        <span className="">{caption}</span>
      </div>
      <p className="container mx-auto">{data.mdx.frontmatter.date}</p>
      <MDXRenderer>{data.mdx.body}</MDXRenderer>
    </Layout>
  );
};

export const query = graphql`
  query ($id: String) {
    mdx(id: { eq: $id }) {
      frontmatter {
        title
        date(formatString: "MMMM D, YYYY")
        hero_image {
          childImageSharp {
            gatsbyImageData(layout: CONSTRAINED)
          }
          base
          fields {
            imageMeta {
              dateTaken
              meta {
                ObjectName
                Caption
                Location
                City
                State
              }
            }
          }
        }
      }
      body
    }
  }
`;

export default BlogPost;
