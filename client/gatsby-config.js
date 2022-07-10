require('dotenv').config()

module.exports = {
  siteMetadata: {
    title: "Chuck Dries",
    siteUrl: "https://chuckdries.com",
  },
  plugins: [
    "gatsby-plugin-react-helmet",
    "gatsby-plugin-image",
    "gatsby-plugin-mdx",
    {
      resolve: `gatsby-plugin-sharp`,
      options: {
        defaults: {
          quality: 75
        }
      }
    },
    "gatsby-transformer-sharp",
    "gatsby-plugin-postcss",
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "gallery",
        path: "./data/gallery/",
      },
      __key: "gallery",
    },
    {
      resolve: `gatsby-source-strapi`,
      options: {
        apiURL: process.env.STRAPI_API_URL,
        accessToken: process.env.STRAPI_TOKEN,
        collectionTypes: ['article', 'category', 'author', 'user'],
        singleTypes: ['about', 'global', 'portfolio-gallery'],
      },
    },
    {
      resolve: "gatsby-plugin-eslint",
      options: {
        stages: ["develop"],
        extensions: ["js", "jsx"],
        exclude: ["node_modules", ".cache", "public"],
        // Any eslint-webpack-plugin options below
      },
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
