#!/usr/bin/env node

const pandoc = require("pandoc-filter-promisified");
const fs = require("fs");
const { CodeBlock } = pandoc;

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
}

pandoc.stdio(action);
