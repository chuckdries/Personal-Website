import React from 'react';
import { graphql, Link, navigate } from 'gatsby';
import { MDXProvider } from '@mdx-js/react';
import { MDXRenderer } from 'gatsby-plugin-mdx';
import { groupBy, path, prop } from 'ramda';

import '../styles/resume.css';
import { Helmet } from 'react-helmet';

const ResumeSection = ({
  node,
}) => {
  return (
    <li className="md:flex align-top py-2 md:border-b border-gray-300">
      <div className="md:text-right flex-grow-0 flex-shrink-0" style={{width: '200px'}}>
        <h3 className="font-bold text-xl">{node.frontmatter.name}</h3>
        <span>{node.frontmatter.timeframe}</span>
      </div>
      <div className="md:pl-4 resume-table-list">
        <p className="italic">{node.frontmatter.position}</p>
        <ul>
          {node.frontmatter.items.map((item) => (
            <li key={item.value}><MDXRenderer>{item.value}</MDXRenderer></li>
          ))}
        </ul>
      </div>
    </li>
  );
};

const Resume = ({ data: { allMdx } }) => {
  const sections = groupBy(path(['node', 'frontmatter', 'type']), allMdx.edges);

  return (<>
    <Helmet>
      <title>Interactive Resume | Chuck Dries</title>
    </Helmet>
    <nav className="mt-1 ml-1 text-lg mb-4">
      <button
        className="hover:underline text-vibrant-light hover:text-muted-light arrow-left-before  mr-1"
        onClick={() => navigate(-1)}
        type="button"
      >back</button>
      <Link
        className="hover:underline text-vibrant-light hover:text-muted-light mx-1"
        to="/"
      >home</Link>
      <Link
        className="hover:underline text-vibrant-light hover:text-muted-light mx-1"
        to="/photogallery/"
      >gallery</Link>
    </nav>
    <div className="resume font-serif container mx-auto px-2">
      <div className="md:flex items-center">
        <div className="flex-auto">
          <h1 className="text-3xl font-bold">Chuck Dries</h1>
          <h2>Software Engineer • Web Developer • Teacher • Eagle Scout</h2>
        </div>
        <div className="md:text-right">
          <p className="mb-2">1860 S. Las Palmas Cir<br />Mesa, AZ 85202</p>
          <ul>
            <li><a href="mailto:chuck@chuckdries.com">chuck@chuckdries.com</a></li>
            <li><a href="tel:6026180414">602.618.0414</a></li>
            <li><a href="https://github.com/chuckdries">github.com/chuckdries</a></li>
          </ul>
        </div>
      </div>
      <section>
        <header>
          <h2 className="mt-4 font-bold">Work Experience</h2>
        </header>
        <ul className="resume-table">
          <MDXProvider>
            {sections.workexperience.map(({ node }) => <ResumeSection key={node.slug} node={node} />)}
          </MDXProvider>
        </ul>
      </section>
    </div>
  </>);
};

export const query = graphql`
{
  allMdx {
    edges {
      node {
        frontmatter {
          name
          type
          position
          timeframe
          items {
            value
          }
        }
        slug
      }
    }
  }
}
`;

export default Resume;