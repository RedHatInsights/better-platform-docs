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
  console.log("list of sections: ", sections);
  const schema = sections.reduce(
    (acc, { name, path, parent }) => ({
      ...acc,
      [parent]: {
        title: capitalize(parent).replace(/-/gi, " "),
        items: [
          ...(acc[parent]?.items || []),
          {
            title: capitalize(name),
            href: `/${path}`,
          },
        ],
      },
    }),
    {}
  );
  fsExtra.ensureDirSync(SECTIONS_DIR);
  fsExtra.writeJsonSync(`${SECTIONS_DIR}/sections.json`, schema, { spaces: 2 });
};
