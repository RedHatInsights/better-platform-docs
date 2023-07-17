#!/usr/bin/env node

const pandoc = require("pandoc-filter");
const fs = require("fs");
const { Image } = pandoc;

const outputLogger = new console.Console(fs.createWriteStream("./output.log"));

async function action(elt) {
  if (process.env.DEBUG === "true") {
    outputLogger.log(elt);
  }

  if (elt.t === "Image") {
    const imagePrefix = process.env.IMAGE_PREFIX;
    const [headers, meta, [src, alt]] = elt.c;
    const serverSrc = `${imagePrefix}/${src}`.replace(/^\.\/public/, "");
    return Image(headers, meta, [serverSrc, alt]);
  }
}

const run = async () => await pandoc.stdio(action);
run();
