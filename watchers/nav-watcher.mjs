import chokidar from "chokidar";
import path from "path";
import { fileURLToPath } from "url";
import { generateAll, mutateItem } from "../generators/nav-generator.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PAGES_GLOB = path.resolve(
  __dirname,
  "../pages/*/**/*.{md,mdx,js,jsx,ts,tsx}"
);

// run in timeout after initial copy file wathcer has done its business
setTimeout(() => {
  // make sure navigation files exist
  generateAll();
  // start watching
  const watcher = chokidar.watch(PAGES_GLOB, { ignoreInitial: true });

  const log = console.log.bind(console);

  watcher
    .on("add", (path) => {
      try {
        mutateItem(path, "add");
        log(`File ${path} was added to nav`);
      } catch (error) {
        log(`Unable to add ${path} to nav!`, error);
      }
    })
    .on("unlink", (path) => {
      try {
        mutateItem(path, "remove");
        log(`File ${path} has been removed from nav`);
      } catch (error) {
        log(`Unable to remove ${path} from nav!`, error);
      }
    });
});
