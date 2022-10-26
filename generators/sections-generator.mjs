import fsExtra from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
import { capitalize, getSections } from "./common.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SECTIONS_GLOB = path.resolve(__dirname, "../pages");
const SECTIONS_DIR = path.resolve(
  __dirname,
  "../components/Navigation/sections"
);

export const generateSections = () => {
  const sections = getSections(SECTIONS_GLOB);
  const schema = sections.map((name) => ({
    title: capitalize(name),
    href: `/${name}`,
  }));
  fsExtra.ensureDirSync(SECTIONS_DIR);
  fsExtra.writeJsonSync(`${SECTIONS_DIR}/sections.json`, schema, { spaces: 2 });
};
