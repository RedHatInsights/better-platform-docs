import chokidar from "chokidar";
import path from "path";
import { fileURLToPath } from "url";
import { generateSections } from "../generators/sections-generator.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SECTIONS_GLOB = path.resolve(
  __dirname,
  "../pages/**/*.{md,mdx,js,jsx,ts,tsx}"
);

setTimeout(() => {
  generateSections();
  // start watching
  const watcher = chokidar.watch(SECTIONS_GLOB, { ignoreInitial: true });

  const log = console.log.bind(console);

  watcher
    .on("add", (path) => {
      try {
        generateSections();
        log(`File ${path} was added to sections`);
      } catch (error) {
        log(`Unable to add ${path} to sections!`, error);
      }
    })
    .on("unlink", (path) => {
      try {
        generateSections();
        log(`File ${path} has been removed from sections`);
      } catch (error) {
        log(`Unable to remove ${path} from sections!`, error);
      }
    });
});
