module.exports = {
  siteMetadata: {
    title: `eduWRENCH Pedagogic Modules`,
    description: `Parallel and Distributed Computing Courseware`,
    author: `WRENCH Team`
  },
  proxy: {
    prefix: "/api",
    url: "http://localhost:3000"
  },
  plugins: [
    `gatsby-plugin-nodejs`,
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-sass`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`
      }
    },
    `gatsby-transformer-sharp`,
    `gatsby-transformer-yaml`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `./src/data/`
      }
    },
    `gatsby-transformer-remark`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `gatsby-starter-default`,
        short_name: `starter`,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `src/images/wrench_logo.png` // This path is relative to the root of the site.
      }
    },
    `gatsby-plugin-image`,
    {
      resolve: 'gatsby-plugin-react-svg',
      options: {
        rule: {
          include: /svgs/
        }
      }
    }
  ]
}
