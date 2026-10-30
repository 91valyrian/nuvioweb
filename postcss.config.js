module.exports = {
  plugins: {
    "@tailwindcss/postcss": {},
    "postcss-pxtorem": {
      rootValue: 16,
      propList: ["*"],
      // The legacy site scales rem with viewport width. Keep editorial text readable.
      selectorBlackList: [
        /\.inquiries-admin/,
        /\.contact-inquiry/,
        /\.work-detail-content/,
        /\.site-wide-layout/,
        /\.column-article/,
        /\.column-card/,
        /\.columns-index/,
        /\.service-detail/,
        /\.service-links/,
        /\.services-overview/,
      ],
    },
  },
};
