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
      resolve: "gatsby-source-filesystem",
      options: {
        // name: "gallery",
        name: "photos",
        path: "./data/gallery/",
      },
      // __key: "gallery",
      __key: "photos",
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
              return allFile.nodes.map((node) => {
                return {
                  title:
                    node.fields.imageMeta.meta?.ObjectName ??
                    node.fields.imageMeta.meta?.Caption ??
                    node.base,
                  description: `<img src="${node.publicURL}" />`,
                  date: node.fields.imageMeta.datePublished,
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
            output: "/rss.xml",
            title: "Chuck Dries Photos",
          },
        ],
      },
    },
  ],
};
