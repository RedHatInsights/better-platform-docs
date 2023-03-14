import fsExtra from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
import {
  capitalize,
  getSections,
  SECTIONS_DIR,
  SECTIONS_GLOB,
} from "./common.mjs";

export const generateSections = () => {
  const sections = getSections(SECTIONS_GLOB);
  const schema = sections.map(({ name, path, parent }) => ({
    title: capitalize(name),
    href: `/${path}`,
    parent: parent
      .split("-")
      .map((item) => `${item.charAt(0).toUpperCase()}${item.slice(1)}`)
      .join(" "),
  }));
  fsExtra.ensureDirSync(SECTIONS_DIR);
  fsExtra.writeJsonSync(`${SECTIONS_DIR}/sections.json`, schema, { spaces: 2 });
};
