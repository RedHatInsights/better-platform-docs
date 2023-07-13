import { exec } from "child_process";
import { readFileSync, writeFileSync, renameSync } from "fs";
import glob from "glob";

const getSource = (repository, branch, path) =>
  `/tmp/${repository}-${branch}/${path}`;

const mmdBlockMap = [
  {
    regexp: /^title: .+$/m,
    replace: (match) => {
      return `# ${match.split("title: ").pop()}`;
    },
  },
  {
    regexp: /^author: .+$/m,
    replace: (match) => {
      return `<small>${match.split("author: ").pop()}</small>\n`;
    },
  },
  {
    regexp: /^date: .+$/m,
    replace: (match) => {
      return `<small>${match.split("date: ").pop()}</small>\n`;
    },
  },
];

const mmdTitleBlockTransformation = (file) => {
  let data = readFileSync(file, { encoding: "utf-8" });
  const mmdTitleIndexEnd = data.match(/^\n/m);
  let mmdTitleSubstring = data.substring(0, mmdTitleIndexEnd.index);
  mmdBlockMap.forEach(({ regexp, replace }) => {
    mmdTitleSubstring = mmdTitleSubstring.replace(regexp, replace);
  });
  data = data.replace(
    data.substring(0, mmdTitleIndexEnd.index),
    mmdTitleSubstring
  );
  // console.log({ file });
  writeFileSync(file, data);
  renameSync(file, file.replace("/pages/", "/"));
};

const adocExec = (file) => {
  exec(
    `echo pwd && asciidoc -b docbook ${file} && pandoc -s --base-header-level 2 ${file.replace(
      /\.adoc$/,
      ".xml"
    )} -o ${file.replace(
      /\.adoc$/,
      ".md"
    )} -f docbook -t markdown_github+mmd_title_block --filter=./downloader/adoc-writer.js --verbose`,
    (error) => {
      if (error) {
        console.log(error);
      }
      mmdTitleBlockTransformation(file.replace(/\.adoc$/, ".md"));
    }
  );
};

const transformerMapper = {
  "consoledot.pages.redhat.com": ({ repository, branch, path }) => {
    const sourcePath = getSource(repository, branch, path);
    const adocFiles = glob.sync(`${sourcePath}/**/pages/*.adoc`);

    adocFiles.forEach((file) => {
      adocExec(file);
    });
  },
};

export default transformerMapper;
