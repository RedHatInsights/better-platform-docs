import fse from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const capitalize = (str = "") =>
  `${str[0].toUpperCase()}${str.slice(1)}`;

export const getSections = (SECTIONS_GLOB) =>
  fse
    .readdirSync(SECTIONS_GLOB, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map(({ name }) => name);

export const ALL_PAGES_GLOB = path.resolve(
  __dirname,
  "../pages/*/**/*.{md,mdx,js,jsx,ts,tsx}"
);

export const SECTIONS_GLOB = path.resolve(__dirname, "../pages");

export const NAVIGATIONS_FOLDER = path.resolve(
  __dirname,
  "../components/Navigation/schemas"
);

export const SECTIONS_DIR = path.resolve(
  __dirname,
  "../components/Navigation/sections"
);
