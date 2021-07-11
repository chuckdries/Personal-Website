import React from 'react';
import { graphql } from 'gatsby';
import { MDXProvider } from '@mdx-js/react';
import { MDXRenderer } from 'gatsby-plugin-mdx';
import { groupBy, path, prop } from 'ramda';

import '../styles/resume.css';

const ResumeSection = ({
  node,
}) => {
  console.log('node', node.frontmatter);
  return (
    <tr className="align-top border-b border-gray-400 py-2">
      <td className="text-right" style={{minWidth: '200px'}}>
        <h3 className="font-bold text-xl">{node.frontmatter.name}</h3>
        <span>{node.frontmatter.timeframe}</span>
      </td>
      <td className="pl-4">
        <p className="italic">{node.frontmatter.position}</p>
        <ul>
          {node.frontmatter.items.map((item) => (
            <li key={item.value}><MDXRenderer>{item.value}</MDXRenderer></li>
          ))}
        </ul>
      </td>
    </tr>
  );
};

const Resume = ({ data: { allMdx } }) => {
  const sections = groupBy(path(['node', 'frontmatter', 'type']), allMdx.edges);

  return (
    <MDXProvider>
      <div className="resume font-serif container mx-auto">
        <h1 className="text-3xl font-bold">Chuck Dries</h1>
        <table>
          {sections.workexperience.map(({ node }) => <ResumeSection key={node.slug} node={node} />)}
        </table>
      </div>
    </MDXProvider>
  );
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