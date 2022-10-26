import fsExtra from "fs-extra";
import glob from "glob";
import path from "path";
import { fileURLToPath } from "url";

fsExtra.readdirSync;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SECTIONS_GLOB = path.resolve(__dirname, "../pages");
const ALL_PAGES_GLOB = path.resolve(
  __dirname,
  "../pages/*/**/*.{md,mdx,js,jsx}"
);
const NAVIGATIONS_FOLDER = path.resolve(
  __dirname,
  "../components/Navigation/schemas"
);

const capitalize = (str = "") => str[0].toUpperCase() + str.slice(1);
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

const getSections = () =>
  fsExtra
    .readdirSync(SECTIONS_GLOB, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map(({ name }) => name);

const getPages = () => glob.sync(ALL_PAGES_GLOB).map(sanitizePage);

function getMetaData() {
  return {
    sections: getSections(),
    pages: getPages(),
  };
}

export function generateAll() {
  const { sections, pages } = getMetaData();
  const schemas = sections.reduce(
    (acc, curr) => ({
      ...acc,
      [curr]: pages.filter(({ href }) => href.includes(`/${curr}`)),
    }),
    {}
  );

  // make sure the dir exists
  fsExtra.ensureDirSync(NAVIGATIONS_FOLDER);

  // write schemas for all pages sections
  Object.entries(schemas).forEach(([section, nav]) => {
    fsExtra.writeJSONSync(`${NAVIGATIONS_FOLDER}/${section}.json`, nav, {
      // pretty JSON
      spaces: 2,
    });
  });
}
