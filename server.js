const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const fs = require("fs");
const path = require("path");
const siteCrawler = require("./server-search/site-crawler");
const siteScraper = require("./server-search/site-scraper");

let searchIndex = JSON.parse(
  fs.readFileSync(
    path.resolve(__dirname, "./server-assets/search-index.json"),
    { encoding: "utf-8" }
  )
);

const app = next({ dev: false });
const handle = app.getRequestHandler();

let searchCache = {};

function searchForTerm(term, bucket) {
  const lowerTerm = trimContent(term);
  return Object.entries(bucket).reduce((acc, [key, meta]) => {
    if (
      key.toLowerCase().includes(lowerTerm) ||
      meta?.synonyms?.toLowerCase().includes(lowerTerm)
    ) {
      return [
        ...acc,
        {
          url: meta.linkResult,
          term,
          value: key,
        },
      ];
    }
    return acc;
  }, []);
}

function trimContent(content = "") {
  return content.trim().toLocaleLowerCase().replace(/\s/gm, "");
}

function handleSearch(term) {
  const tagKeys = Object.keys(searchIndex);
  const buckets = tagKeys.map((key) => searchIndex[key]);
  const searchJobs = buckets.map((bucket) => searchForTerm(term, bucket));
  const [h1, h2, h3, h4, h5, h6, strong, em, p, table, li] = searchJobs;
  const result = {
    h1,
    h2,
    h3,
    h4,
    h5,
    h6,
    strong,
    em,
    p,
    table,
    li,
  };

  return result;
}

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    /**
     * If we need to parse additional URL requests we can do it here
     * const { pathname, query } = parsedUrl;
     */

    /**
     * We can serve static assets like service workes here
     *  if (pathname === '/a') {
     *  app.render(req, res, '/a', query)
     * } else if() {...}
     */

    const { pathname, query } = parsedUrl;
    if (pathname === "/search" || pathname === "/platform-docs/search") {
      if (!query?.term) {
        return res.end(JSON.stringify({ noResult: true }));
      }
      try {
        return res.end(JSON.stringify({ data: handleSearch(query?.term) }));
      } catch (error) {
        return res.end(JSON.stringify({ searchError: true }));
      }
    }

    handle(req, res, parsedUrl);
  }).listen(3000, async (err) => {
    if (err) {
      throw err;
    }

    // run scraping after server is running

    console.log("> Ready on http://localhost:3000");
    try {
      await siteCrawler();
      await siteScraper();
      searchIndex = JSON.parse(
        fs.readFileSync(
          path.resolve(__dirname, "./server-assets/search-index.json"),
          { encoding: "utf-8" }
        )
      );
      searchCache = {};
      console.log("> New search index generated");
    } catch (error) {
      console.error("> failed to generate search index", error);
    }
  });
});
