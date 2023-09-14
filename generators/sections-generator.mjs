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
  const schema = sections.reduce(
    (acc, { linkTitle, name, path, parent, indexPage, ...rest }) => {
      return {
        ...acc,
        [parent]: {
          title: capitalize(parent).replace(/-/gi, " "),
          items: [
            ...(acc[parent]?.items || []),
            {
              title: linkTitle || capitalize(name),
              href: `/${path}`,
              indexPage,
            },
          ],
        },
      };
    },
    {}
  );
  fsExtra.ensureDirSync(SECTIONS_DIR);
  fsExtra.writeJsonSync(`${SECTIONS_DIR}/sections.json`, schema, { spaces: 2 });
};
