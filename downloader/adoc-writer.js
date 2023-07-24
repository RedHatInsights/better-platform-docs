#!/usr/bin/env node

const pandoc = require("pandoc-filter");
const fs = require("fs");
const { Image, Link, Str } = pandoc;

const outputLogger = new console.Console(fs.createWriteStream("./output.log"));

async function action(elt) {
  if (process.env.DEBUG === "true") {
    outputLogger.log(elt);
  }

  if (elt.t === "Image") {
    const imagePrefix = process.env.IMAGE_PREFIX;
    const [headers, meta, [src, alt]] = elt.c;
    const serverSrc = `/platform-docs${imagePrefix}/${src}`.replace(
      /\.\/public/,
      ""
    );
    return Image(headers, meta, [serverSrc, alt]);
  }

  if (elt.t === "Link") {
    const [meta, label, href] = elt.c;
    const linkHref = href.find(Boolean);
    // The empty string is critical to force MD to use the [...](...) URL syntax which is required for MDX
    const newLabel =
      label.length === 1 && label[0].c === linkHref
        ? [Str(""), Str(href.find(Boolean))]
        : label;
    const newLink = Link(meta, newLabel, href);
    outputLogger.log({ label, newLabel, href });

    return newLink;
  }

  if (elt.t === "Table") {
    // get rid of alignment
    elt.c[2] = [];
    return elt;
  }
}

const run = async () => await pandoc.stdio(action);
run();
