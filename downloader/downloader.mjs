import data from "./config.json" assert { type: "json" };
import follow from "follow-redirects";
import StreamZip from "node-stream-zip";
import fs from "fs";
import { exec } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const dir = "./tmp";

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

const safePath = (location) => {
  return path.resolve(__dirname, location.replaceAll("//", "/"));
};

data.forEach(({ owner, repository, branch, path, title }) => {
  console.log(`Repository: ${owner}/${repository}`);
  const onGenerate = () => {
    if (title === "public") {
      console.log(
        "Extracting to public folder: ",
        `${safePath(`../tmp/${repository}-${branch}/${path}`)}`
      );
      exec(
        `cp -r ${safePath(`../tmp/${repository}-${branch}/${path}`)} ${safePath(
          "../public"
        )}`
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
        `to ${safePath(`../pages/${title.replaceAll(" ", "-").toLowerCase()}`)}`
      );
      exec(
        `rsync -a -v ${safePath(
          `../tmp/${repository}-${branch}/${path}`
        )} ${safePath(`../pages/${title.replaceAll(" ", "-").toLowerCase()}`)}`
      );
    }
  };
  if (fs.existsSync(safePath(`../tmp/${repository}-${branch}`))) {
    console.log("folder exists!");
    onGenerate();
  } else {
    console.log(
      "Downloading files",
      `https://github.com/${owner}/${repository}/archive/refs/heads/${branch}.zip`
    );
    const file = fs.createWriteStream(safePath(`../tmp/${repository}.zip`));
    follow.https.get(
      `https://github.com/${owner}/${repository}/archive/refs/heads/${branch}.zip`,
      function (response) {
        console.log("Status: ", response.statusCode);
        response.pipe(file);
        file.on("finish", () => {
          file.close();
          const zip = new StreamZip.async({ file: `./tmp/${repository}.zip` });
          zip.extract(null, "./tmp");
          onGenerate();
        });
      }
    );
  }
});
