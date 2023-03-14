import fsExtra from "fs-extra";
import glob from "glob";
import path from "path";
import { fileURLToPath } from "url";
import {
  ALL_PAGES_GLOB,
  capitalize,
  getSections,
  NAVIGATIONS_FOLDER,
  SECTIONS_GLOB,
} from "./common.mjs";

const sanitizePage = (page = "") => {
  let title = page
    .split("/")
    .pop()
    .replace(/\.(mdx?|jsx?|tsx?)/, "");

  if (title.toLocaleLowerCase() === "index") {
    // use section name instead of index
    const fragments = page.split("/");
    title = fragments[fragments.length - 2];
  }
  return {
    href: page
      .split("/pages")
      .pop()
      .replace(/\.(mdx?|jsx?|tsx?)/, "")
      .replace(/\/index$/, ""),
    title: capitalize(title),
  };
};

const getPages = () => glob.sync(ALL_PAGES_GLOB).map(sanitizePage);
const getPageSection = (page) =>
  page.split("/pages").slice(1).pop().split("/").slice(1).shift();

const storeSection = (section, nav) => {
  const subFolders = section.split("/");
  subFolders.pop();
  fsExtra.ensureDirSync(`${NAVIGATIONS_FOLDER}/${subFolders.join("/")}`);
  fsExtra.writeJSONSync(`${NAVIGATIONS_FOLDER}/${section}.json`, nav, {
    // pretty JSON
    spaces: 2,
  });
};

function getMetaData() {
  return {
    sections: getSections(SECTIONS_GLOB),
    pages: getPages(),
  };
}

export function generateAll() {
  const { sections, pages } = getMetaData();
  const schemas = sections.reduce(
    (acc, curr) => ({
      ...acc,
      [curr.name]: pages.filter(({ href }) =>
        href.match(RegExp(`^/${curr.path}`))
      ),
    }),
    {}
  );

  // make sure the dir exists
  fsExtra.ensureDirSync(NAVIGATIONS_FOLDER);

  // write schemas for all pages sections
  Object.entries(schemas).forEach(([section, nav]) =>
    storeSection(section, nav)
  );
}

const getSectionNavigation = (section) => {
  const sectionFile = `${NAVIGATIONS_FOLDER}/${section}.json`;
  fsExtra.ensureFileSync(sectionFile);
  // file might not be in json format, read as normal file;
  const data = fsExtra.readFileSync(sectionFile, { encoding: "utf-8" });
  let jsonData;
  try {
    jsonData = JSON.parse(data);
  } catch (error) {
    // file was not JSON and is empty
    jsonData = [];
  }
  return jsonData;
};

function addItemToNav(path) {
  const sectionName = getPageSection(path);
  const page = sanitizePage(path);
  let section = getSectionNavigation(sectionName);
  const index = section.findIndex(({ href }) => href === page.href);
  if (index === -1) {
    // new item
    section.push(page);
  } else {
    section[index] = page;
  }
  section = section.sort((a, b) => (a.href > b.href ? 1 : -1));
  storeSection(sectionName, section);
}

function removeItemFromNav(path) {
  const sectionName = getPageSection(path);
  const page = sanitizePage(path);
  let section = getSectionNavigation(sectionName);
  section = section.filter(
    (item) => JSON.stringify(item) !== JSON.stringify(page)
  );
  storeSection(sectionName, section);
}

export function mutateItem(path, type) {
  if (type === "add") {
    addItemToNav(path);
  }

  if (type === "remove") {
    removeItemFromNav(path);
  }
}
