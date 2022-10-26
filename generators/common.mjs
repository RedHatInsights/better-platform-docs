import fse from "fs-extra";

export const capitalize = (str = "") => str[0].toUpperCase() + str.slice(1);

export const getSections = (SECTIONS_GLOB) =>
  fse
    .readdirSync(SECTIONS_GLOB, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map(({ name }) => name);
