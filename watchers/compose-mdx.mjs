import chokidar from "chokidar";
import fsExtra from "fs-extra";

const watcher = chokidar.watch("/pages/**/*.{mdx,md}", {
  persistent: true,
});

const copyFile = (path) => {
  console.log(path);
  fsExtra.copySync(
    path,
    `/opt/app-root/src${path[0] === "/" ? "" : "/"}${path.replace(
      /md$/,
      "mdx"
    )}`
  );
};

watcher
  .on("add", copyFile)
  .on("change", copyFile)
  .on("unlink", (path) => {
    fsExtra.unlinkSync(
      `/opt/app-root/src${path[0] === "/" ? "" : "/"}${path.replace(
        /md$/,
        "mdx"
      )}`
    );
  });
