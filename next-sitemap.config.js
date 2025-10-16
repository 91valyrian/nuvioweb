/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://nuvio-web.com",
  generateRobotsTxt: true,
  outDir: "./public",
  sitemapSize: 7000,

  additionalPaths: async (config) => {
    return [
      { loc: "/", changefreq: "daily", priority: 1.0 },
      { loc: "/about", changefreq: "weekly", priority: 0.8 },
      { loc: "/service", changefreq: "weekly", priority: 0.8 },
      { loc: "/work", changefreq: "daily", priority: 0.9 },
      { loc: "/contact", changefreq: "weekly", priority: 0.8 },
    ];
  },
};
