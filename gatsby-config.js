module.exports = {
  graphqlTypegen: true,
  pathPrefix: process.env.PATH_PREFIX,
  siteMetadata: {
    title: "Chuck Dries",
    siteUrl: "https://chuckdries.com",
    site_url: "https://chuckdries.com", // ??
  },
  plugins: [
    "gatsby-plugin-image",
    "gatsby-plugin-react-helmet",
    {
      resolve: `gatsby-plugin-sharp`,
      options: {
        defaults: {
          quality: 90,
        },
      },
    },
    "gatsby-transformer-sharp",
    "gatsby-plugin-postcss",
    {
      resolve: "gatsby-plugin-mdx",
      options: {
        gatsbyRemarkPlugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              // maxWidth: 1200,
              showCaptions: true,
            },
          },
          'gatsby-remark-autolink-headers'
        ],
      },
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        // name: "gallery",
        name: "photos",
        path: "./data/gallery/",
      },
      // __key: "gallery",
      __key: "photos",
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "posts",
        path: "./data/posts/",
      },
      __key: "posts",
    },
    "gatsby-plugin-preval",
    "gatsby-plugin-robots-txt",
    {
      resolve: "gatsby-plugin-manifest",
      options: {
        icon: "src/images/glasses-outline.svg",
      },
    },
    {
      resolve: "gatsby-plugin-feed",
      options: {
        feeds: [
          {
            serialize: ({ query: { site, allFile } }) => {
              const today = new Date();
              return allFile.nodes
                .filter((node) => {
                  return (
                    node.frontmatter?.date &&
                    today > new Date(node.frontmatter?.date)
                  );
                })
                .map((node) => {
                  return {
                    title:
                      node.fields.imageMeta.meta?.ObjectName ??
                      node.fields.imageMeta.meta?.Caption ??
                      node.base,
                    description: `<img src="${node.publicURL}" />`,
                    date: node.fields.imageMeta.dateTaken,
                    url:
                      site.siteMetadata.siteUrl +
                      "/" +
                      node.fields.organization.slug,
                    guid:
                      site.siteMetadata.siteUrl +
                      "/" +
                      node.fields.organization.slug,
                    // custom_elements: [{ "content:encoded": node.html }],
                  };
                });
            },
            query: `
              {
                allFile(
                  filter: { sourceInstanceName: { eq: "photos" } }
                  sort: { fields: { imageMeta: { dateTaken: DESC } } }
                ) {
                  nodes {
                    id
                    relativePath
                    base
                    publicURL
                    fields {
                      organization {
                        slug
                      }
                      imageMeta {
                        datePublished
                        dateTaken
                        meta {
                          Rating
                          Keywords
                          Caption
                          ObjectName
                        }
                      }
                    }
                  }
                }
              }
            `,
            output: "/photos.rss.xml",
            title: "Chuck Dries Photos",
          },
          {
            serialize: ({ query: { site, allMdx } }) => {
              return allMdx.nodes.map((node) => {
                return {
                  title: node.frontmatter.title,
                  description: node.excerpt,
                  date: node.frontmatter.date,
                  url:
                    site.siteMetadata.siteUrl +
                    "/posts" +
                    node.frontmatter.slug,
                  guid:
                    site.siteMetadata.siteUrl +
                    "/posts" +
                    node.frontmatter.slug,
                  custom_elements: [{ "content:encoded": node.html }],
                };
              });
            },
            query: `
              {
                allMdx {
                  nodes {
                    frontmatter {
                      slug
                      title
                      date
                    }
                    excerpt
                  }
                }
              }
            `,
            output: "/rss.xml",
            title: "Chuck Dries Posts",
          },
        ],
      },
    },
    {
      resolve: 'gatsby-plugin-static-page-modal',
      options: {
        pageRendererPath: `${__dirname}/src/components/PageRenderer.tsx`,
        routes: ['/photos/:slug/'],
      },
    },
  ],
};
