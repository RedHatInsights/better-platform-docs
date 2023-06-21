import data from "./config.json" assert { type: "json" };
import follow from "follow-redirects";
import StreamZip from "node-stream-zip";
import fs from "fs";
import { exec } from "child_process";

data.forEach(({ owner, repository, branch, path, title }) => {
  const onGenerate = () => {
    if (title === "public") {
      exec(`cp -r /tmp/${repository}-${branch}/${path} ./public`);
    } else if (title === "examples") {
      exec(`rsync -a -v /tmp/${repository}-${branch}/${path} ./components`);
    } else {
      exec(
        `rsync -a -v /tmp/${repository}-${branch}/${path} ./pages/${title
          .replaceAll(" ", "-")
          .toLowerCase()}`
      );
    }
  };
  if (fs.existsSync(`/tmp/${repository}-${branch}`)) {
    console.log("folder exists!");
    onGenerate();
  } else {
    const file = fs.createWriteStream(`/tmp/${repository}.zip`);
    follow.https.get(
      `https://github.com/${owner}/${repository}/archive/refs/heads/${branch}.zip`,
      function (response) {
        response.pipe(file);
        file.on("finish", () => {
          file.close();
          const zip = new StreamZip.async({ file: `/tmp/${repository}.zip` });
          zip.extract(null, "/tmp");
          onGenerate();
        });
      }
    );
  }
});
