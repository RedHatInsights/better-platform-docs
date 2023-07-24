import { exec } from "child_process";
import { readFileSync, writeFileSync, renameSync, fstat } from "fs";
import { ensureDirSync } from "fs-extra";
import xmlJS from "xml-js";
import glob from "glob";

const getSource = (repository, branch, path) =>
  `./tmp/${repository}-${branch}/${path}`;

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
  writeFileSync(file, data);
  let distDirectory = file.replace("/pages/", "/").split("/");
  distDirectory.pop();
  distDirectory = distDirectory.join("/");
  ensureDirSync(distDirectory);
  renameSync(file, file.replace("/pages/", "/"));
};

const adocExec = (file) => {
  return new Promise((res, rej) => {
    exec(
      `asciidoctor -b docbook -r asciidoctor-diagram ${file} && pandoc -s --base-header-level 2 ${file.replace(
        /\.adoc$/,
        ".xml"
      )} -o ${file.replace(
        /\.adoc$/,
        ".md"
      )} -f docbook -t markdown_github+mmd_title_block --filter=./downloader/adoc-writer.js --verbose`,
      (error) => {
        if (error) {
          console.log(error);
          return rej(error);
        }
        // globSync('tmp/consoledot.pages.redhat.com-main/modules/')
        mmdTitleBlockTransformation(file.replace(/\.adoc$/, ".md"));
        res();
      }
    );
  });
};

const extractNavLink = (element) => {
  if (element.type === "element" && element.name !== "link") {
    return element.elements?.map(extractNavLink).flat() || [];
  }
  return element;
};
const extractNavFromXML = (navJSON) => {
  const root = navJSON.elements.find(
    (element) => element.type !== "instruction"
  );
  const links = extractNavLink(root)
    .flat()
    .filter((element) => element.name === "link");
  const sectionNav = links.map(({ attributes, elements }) => {
    const hrefFragment = attributes["xl:href"]?.replace(/\.xml$/, "");
    return {
      href: hrefFragment ?? "#",
      title: elements.find(({ type }) => type === "text")?.text ?? hrefFragment,
    };
  });
  return sectionNav;
};

const transformNav = (file) => {
  return new Promise((res, rej) => {
    exec(`asciidoctor -b docbook -r asciidoctor-diagram ${file}`, (error) => {
      if (error) {
        console.log(err);
        return rej(err);
      }

      const navXml = readFileSync(file.replace(/\.adoc$/, ".xml"), {
        encoding: "utf-8",
      });
      const navJson = xmlJS.xml2js(navXml);
      res(extractNavFromXML(navJson));
    });
  });
};

const transformerMapper = {
  "consoledot.pages.redhat.com": async ({
    repository,
    branch,
    path,
    title,
    customNav,
  }) => {
    const sourcePath = getSource(repository, branch, path);
    const adocFiles = glob.sync(`${sourcePath}/**/pages/**/*.adoc`);
    process.env.IMAGE_PREFIX = `./public/${title
      .replaceAll(" ", "-")
      .toLowerCase()}/${path.split("/").pop()}`;

    ensureDirSync(process.env.IMAGE_PREFIX);
    const promises = [];

    adocFiles.forEach((file) => {
      promises.push(adocExec(file));
    });

    if (customNav) {
      const navSource = `${sourcePath}/${customNav}`;
      promises.push(transformNav(navSource));
    }
    // wait for transformation to finish
    const promisesResult = await Promise.all(promises);
    if (customNav) {
      const navigationData = promisesResult.pop();
      writeFileSync(
        `${sourcePath}/navigation.json`,
        JSON.stringify(navigationData, null, 2)
      );
    }
    const images = [
      glob.sync(`${sourcePath}/**/pages/**/*.png`),
      glob.sync(`${sourcePath}/**/images/*.png`),
    ].flat();
    images.forEach((image) => {
      renameSync(image, image.replace("/pages/", "/").replace("/images/", "/"));
    });
  },
};

export default transformerMapper;
