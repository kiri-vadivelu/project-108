const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const schema = require("@quasibit/eleventy-plugin-schema");
const emojiReadTime = require("@11tyrocks/eleventy-plugin-emoji-readtime");
const searchFilter = require("./src/_11ty/searchFilter.js");
const { DateTime } = require("luxon");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(eleventyNavigationPlugin);
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(schema);
  eleventyConfig.addPlugin(emojiReadTime, { showEmoji: false });

  eleventyConfig.addLayoutAlias("main", "layouts/main");
  eleventyConfig.addLayoutAlias("page", "layouts/page");
  eleventyConfig.addLayoutAlias("search", "layouts/search");
  eleventyConfig.addLayoutAlias("article", "layouts/article");

  eleventyConfig.addWatchTarget("./src/sass/");
  eleventyConfig.addPassthroughCopy("./src/assets/**/*");

  eleventyConfig.addPassthroughCopy("./src/favicon.ico");
  eleventyConfig.addPassthroughCopy("./src/manifest.json");
  eleventyConfig.addPassthroughCopy("./src/apple-touch.png");
  eleventyConfig.addPassthroughCopy("./src/android-chrome.png");

  eleventyConfig.addPassthroughCopy("_redirects");

  // eleventyConfig.addPassthroughCopy({
  //   "node_modules/svg-icon-sprite/dist/svg-icon-sprite.js":
  //     "assets/svg-icon-sprite.js",
  // });

  eleventyConfig.addFilter("search", searchFilter);

  eleventyConfig.addNunjucksAsyncShortcode(
    "image",
    require("./src/_11ty/imageShortcode").imageShortcode
  );

  eleventyConfig.addFilter("uppercase", function (string) {
    return string.toUpperCase();
  });

  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat(
      "LLL dd, yyyy"
    );
  });

  eleventyConfig.addFilter("htmlDateString", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat("yyyy-LL-dd");
  });

  eleventyConfig.addFilter("iso8601", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toISO();
  });

  eleventyConfig.addCollection("blog", (collectionApi) => {
    return collectionApi.getFilteredByGlob("./src/blog/*.md").reverse();
  });
  eleventyConfig.addCollection(
    "categoryList",
    require("./src/_11ty/getCategoryList")
  );
  eleventyConfig.addCollection(
    "categories",
    require("./src/_11ty/createCategories")
  );

  eleventyConfig.setFrontMatterParsingOptions({
    excerpt: true,
    excerpt_separator: "<!-- excerpt -->",
    excerpt_alias: "excerpt",
  });

  eleventyConfig.setBrowserSyncConfig({
    files: "./_site/css/**/*.css",
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
    markdownTemplateEngine: "njk",
  };
};
