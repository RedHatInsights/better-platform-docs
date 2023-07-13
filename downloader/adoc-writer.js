#!/usr/bin/env node

const pandoc = require("pandoc-filter-promisified");
const fs = require("fs");
const { CodeBlock, Image } = pandoc;

const outputLogger = new console.Console(fs.createWriteStream("./output.log"));

async function action(elt) {
  if (process.env.DEBUG === "true") {
    outputLogger.log(elt);
  }
  if (elt.t === `CodeBlock`) {
    // console.warn(JSON.stringify(elt, null, 4));
    const [headers, content] = elt.c;
    const lang =
      elt?.a?.language ||
      headers
        .flat()
        .find((item) => typeof item === "string" && item.length > 0);
    const newContent = "```" + lang || "" + "\n" + content + "\n" + "```";
    return CodeBlock(headers, newContent);
  }

  if (elt.t === "Image") {
    const imagePrefix = process.env.IMAGE_PREFIX;
    const [headers, meta, [src, alt]] = elt.c;
    const serverSrc = `${imagePrefix}/${src}`.replace(/^\.\/public/, "");
    return Image(headers, meta, [serverSrc, alt]);
  }
}

pandoc.stdio(action);
