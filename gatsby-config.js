module.exports = {
  graphqlTypegen: true,
  pathPrefix: process.env.PATH_PREFIX,
  siteMetadata: {
    title: "Chuck Dries",
    siteUrl: "https://chuckdries.com",
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
              maxWidth: 1200,
            },
          },
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
  ],
};
