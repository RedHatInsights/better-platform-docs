import data from "./config.json" assert { type: "json" };
import follow from "follow-redirects";
import StreamZip from "node-stream-zip";
import fs from "fs";
import { exec } from "child_process";

data.forEach(({ owner, repository, branch, path, title }) => {
  console.log(`Repository: ${owner}/${repository}`);
  console.log(`Using branch ${branch}`);
  const onGenerate = () => {
    if (title === "public") {
      console.log(
        "Extracting to public folder: ",
        `./tmp/${repository}-${branch}/${path}`
      );
      exec(`cp -r ./tmp/${repository}-${branch}/${path} ./public`);
    } else if (title === "examples") {
      console.log(
        "Extracting to components folder: ",
        `./tmp/${repository}-${branch}/${path}`
      );
      exec(`rsync -a -v ./tmp/${repository}-${branch}/${path} ./components`);
    } else {
      console.log(
        `Extracting to ./pages/${title.replaceAll(" ", "-").toLowerCase()}`,
        `./tmp/${repository}-${branch}/${path}`
      );
      exec(
        `rsync -a -v ./tmp/${repository}-${branch}/${path} ./pages/${title
          .replaceAll(" ", "-")
          .toLowerCase()}`
      );
    }
  };
  if (fs.existsSync(`./tmp/${repository}-${branch}`)) {
    console.log("folder exists!");
    onGenerate();
  } else {
    console.log(
      "Downloading files",
      `https://github.com/${owner}/${repository}/archive/refs/heads/${branch}.zip`
    );
    const file = fs.createWriteStream(`./tmp/${repository}.zip`);
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
