import data from "./config.json" assert { type: "json" };
import follow from "follow-redirects";
import StreamZip from "node-stream-zip";
import fs from "fs";
import fse from "fs-extra";
import glob from "glob";
import { exec, execSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import transformers from "./transformers.mjs";

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const dir = "./tmp";

const INDEX = /\/index\.(html|md|js|ts)x?$/;
const VALID_PAGE = /\/.*\.(html|md|js|ts)x?$/;

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

const safePath = (location) => {
  return path.resolve(__dirname, location.replaceAll("//", "/"));
};

function githubTemplate(owner, repository, branch) {
  return `https://github.com/${owner}/${repository}/archive/refs/heads/${branch}.zip`;
}

function gitlabTemplate(owner, repository, branch) {
  return `https://gitlab.cee.redhat.com/${owner}/${repository}/-/archive/${branch}/${repository}-${branch}.zip`;
}

const sourceMapper = {
  github: githubTemplate,
  gitlab: gitlabTemplate,
};

data.forEach(
  async ({
    owner,
    repository,
    branch,
    path,
    title,
    source = "github",
    customNav,
    linkTitle,
  }) => {
    console.log(`Repository: ${owner}/${repository}`);
    const onGenerate = () => {
      if (title === "public") {
        console.log(
          "Extracting to public folder: ",
          `${safePath(`../tmp/${repository}-${branch}/${path}`)}`
        );
        exec(
          `cp -r ${safePath(
            `../tmp/${repository}-${branch}/${path}`
          )} ${safePath("../public")}`
        );
      } else if (title === "examples") {
        console.log(
          "Extracting to components folder: ",
          `${safePath(`../tmp/${repository}-${branch}/${path}`)}`
        );
        exec(
          `rsync -a -v ${safePath(
            `../tmp/${repository}-${branch}/${path}`
          )} ${safePath("../components")}`
        );
      } else {
        console.log(
          `Extracting`,
          `${safePath(`../tmp/${repository}-${branch}/${path}`)}`,
          `to ${safePath(
            `../pages/${title.replaceAll(" ", "-").toLowerCase()}`
          )}`
        );
        const pagesDir = `./pages/${title.replaceAll(" ", "-").toLowerCase()}`;
        const pagesSources = safePath(`../tmp/${repository}-${branch}/${path}`);
        const pagesDestination = safePath(
          `../pages/${title.replaceAll(" ", "-").toLowerCase()}`
        );

        try {
          execSync(
            `rsync -a -u -v --prune-empty-dirs --exclude '*.xml' --exclude '*.adoc' --exclude '*.png.cache' --exclude '*.png.html' ${pagesSources} ${pagesDestination}`
          );
          const imagesInPages = glob.sync(`${pagesDir}/**/*.png`);
          imagesInPages.forEach((image) => {
            const imageName = image.replace("/pages/", "/public/");
            let imgDirname = imageName.split("/");
            imgDirname.pop();
            imgDirname = imgDirname.join("/");
            fse.ensureDirSync(imgDirname);
            fse.renameSync(image, imageName);
          });
        } catch (error) {
          console.log(error);
        }

        const pagesSectionUrl = pagesSources.split("/").pop();
        let indexPage = undefined;
        const validFiles = glob
          .sync(`${pagesDestination}/${pagesSectionUrl}/*`)
          .filter((name) => name !== "index.json")
          .sort();
        if (
          validFiles.length > 0 &&
          !validFiles.find((file) => file.match(INDEX))
        ) {
          // no index.* in the folder, use the first alphabetically
          indexPage = validFiles.find((file) => file.match(VALID_PAGE));
        }
        const metadata = {
          linkTitle,
          indexPage: indexPage
            ?.split("pages")
            .pop()
            ?.split(/\.(html|md|js|ts)x?$/)
            .shift(),
        };
        fs.writeFileSync(
          `${pagesDestination}/${pagesSectionUrl}/metadata.json`,
          JSON.stringify(metadata, null, 2)
        );
      }
    };
    if (fs.existsSync(safePath(`../tmp/${repository}-${branch}`))) {
      console.log("folder exists!");
      await transformers[repository]?.({
        repository,
        branch,
        path,
        title,
        customNav,
      });
      onGenerate();
    } else {
      const URL = sourceMapper[source](owner, repository, branch);
      console.log("Downloading files", URL);
      const file = fs.createWriteStream(safePath(`../tmp/${repository}.zip`));
      follow.https.get(
        URL,
        {
          // required for gitlab self signed certificate
          rejectUnauthorized: source !== "gitlab",
        },
        function (response) {
          console.log("Status: ", response.statusCode);
          response.pipe(file);
          file.on("finish", () => {
            file.close();
            const zip = new StreamZip.async({
              file: `./tmp/${repository}.zip`,
            });
            zip.extract(null, safePath("../tmp")).then(() => {
              return (
                transformers[repository]?.({
                  repository,
                  branch,
                  path,
                  title,
                  customNav,
                }) || Promise.resolve()
              ).then(() => {
                onGenerate();
                zip.close();
              });
            });
          });
        }
      );
    }
  }
);
