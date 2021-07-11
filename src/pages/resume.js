import React from 'react';
import { graphql, Link, navigate } from 'gatsby';
import { MDXProvider } from '@mdx-js/react';
import { MDXRenderer } from 'gatsby-plugin-mdx';
import { groupBy, map, path, pipe, sortBy } from 'ramda';

import '../styles/resume.css';
import { Helmet } from 'react-helmet';

const ResumeSection = ({
  node: {
    frontmatter: {
      name,
      position,
      timeframe,
      items,
      links,
    },
  },
}) => {
  return (
    <li className="md:flex align-top py-2 md:border-b border-gray-300">
      <div className="md:text-right flex-grow-0 flex-shrink-0" style={{width: '250px'}}>
        <h3 className="font-bold text-xl">{name}</h3>
        <p>{timeframe}</p>
        {links && <div>
          {links.map((link) => <a className="hover:underline mx-1" href={link.url} key={link.url}>{link.name}</a>)}
        </div>}
      </div>
      <div className="md:pl-4 resume-table-list">
        {position && <p className="italic">{position}</p>}
        <ul>
          {items.map((item) => (
            <li key={item.value}><MDXRenderer>{item.value}</MDXRenderer></li>
          ))}
        </ul>
      </div>
    </li>
  );
};

const Resume = ({ data: { allMdx } }) => {
  const sections = pipe(
    groupBy(path(['node', 'frontmatter', 'type'])),
    map(sortBy(path(['node', 'frontmatter', 'order'])))
  )(allMdx.edges);
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
          <h1 className="text-4xl font-bold">Chuck Dries</h1>
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
      <MDXProvider>
        <section id="work-experience">
          <header>
            <h2 className="mt-4 font-bold text-2xl">Work Experience</h2>
          </header>
          <ul className="resume-table">
            {sections.workexperience.map(({ node }) => <ResumeSection key={node.slug} node={node} />)}
          </ul>
        </section>
        <section id="education">
          <header>
            <h2 className="mt-4 font-bold text-2xl">Education</h2>
          </header>
          <ul className="resume-table">
            {sections.education.map(({ node }) => <ResumeSection key={node.slug} node={node} />)}
          </ul>
        </section>
        <section id="Projects">
          <header>
            <h2 className="mt-4 font-bold text-2xl">Projects</h2>
          </header>
          <ul className="resume-table">
            {sections.project.map(({ node }) => <ResumeSection key={node.slug} node={node} />)}
          </ul>
        </section>
      </MDXProvider>
    </div>
  </>);
};

export const query = graphql`
{
  allMdx {
    edges {
      node {
        frontmatter {
          order
          name
          type
          position
          timeframe
          items {
            value
          }
          links {
            name
            url
          }
        }
        slug
      }
    }
  }
}
`;

export default Resume;