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
          quality: 90
        }
      }
    },
    "gatsby-transformer-sharp",
    "gatsby-plugin-postcss",

    /** source plugins */
    // {
    //   resolve: "gatsby-source-filesystem",
    //   options: {
    //     name: "images",
    //     path: "./src/images/",
    //   },
    //   __key: "images",
    // },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "gallery",
        path: "./data/gallery/",
      },
      __key: "gallery",
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "pages",
        path: "./src/pages/",
      },
      __key: "pages",
    },
    
    /** post-source plugins */
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
