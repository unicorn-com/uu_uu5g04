/**
 * Copyright (C) 2019 Unicorn a.s.
 *
 * This program is free software; you can use it under the terms of the UAF Open License v01 or
 * any later version. The text of the license is available in the file LICENSE or at www.unicorn.com.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even
 * the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See LICENSE for more details.
 *
 * You may contact Unicorn a.s. at address: V Kapslovne 2767/2, Praha 3, Czech Republic or
 * at the email: info@unicorn.com.
 */

const fs = require("fs");
const https = require("https");
const archiver = require("archiver");

async function run() {
  if (process.argv.slice(-1)[0] !== "false") {
    console.log("Running build...");
    // require("child_process").spawnSync("npm run clean", { shell: true, cwd: process.cwd(), stdio: "inherit" });
    require("child_process").spawnSync("npm run build", { shell: true, cwd: process.cwd(), stdio: "inherit" });
  }

  console.log("Generating offline version of uu5g04...");
  let { version } = JSON.parse(fs.readFileSync("package.json", "utf-8"));
  let outputFile = `target/uu5g04-${version}-offline.zip`;
  let output = fs.createWriteStream(outputFile);

  await zip(async zipArchive => {
    zipArchive.pipe(output);
    zipArchive.directory("target/dist/", "");
    let workers = [];

    // 1. download & zip clearsans.min.css, clearsans.css, fonty
    let fontStylesBaseUri = "https://cdn.plus4u.net/libs/clearsans/1.0.0/fonts/";
    let fontStylesFiles = [
      "clear-sans.css",
      "clear-sans.min.css",
      "ClearSans-Regular.ttf",
      "ClearSans-Bold.ttf",
      "ClearSans-Italic.ttf",
      "ClearSans-BoldItalic.ttf",
      "ClearSans-Medium.ttf",
      "ClearSans-MediumItalic.ttf",
      "ClearSans-Light.ttf"
    ];
    let fontStylesInZipPrefix = "assets/clearsans/1.0.0/fonts/";
    workers.push(
      ...fontStylesFiles.map(async file => {
        let content = await download(fontStylesBaseUri + file);
        if (file.match(/\.css$/)) content = content.toString().replace(/https:\/\/cdn\.plus4u.*?fonts\//g, "");
        zipArchive.append(content, { name: fontStylesInZipPrefix + file });
      })
    );

    // 2. download & zip uu5g04-icons
    let uu5g04IconsBaseUri = "https://cdn.plus4u.net/uu-uu5g04-icons/1.0.0/";
    let uu5g04IconsFiles = [
      "uu5g04_icons.css",
      "uu5g04_icons.min.css",
      "uu5g04-icons.ttf",
      "uu5g04-icons.woff",
      "uu5g04-icons.eot",
      "uu5g04-icons.svg"
    ];
    let uu5g04IconsInZipPrefix = "assets/uu-uu5g04-icons/1.0.0/";
    workers.push(
      ...uu5g04IconsFiles.map(async file => {
        let content = await download(uu5g04IconsBaseUri + file);
        zipArchive.append(content, { name: uu5g04IconsInZipPrefix + file });
      })
    );

    await Promise.all(workers);
  });

  console.log("  " + outputFile);
}

async function download(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, res => {
        if (res.statusCode >= 300)
          return reject(new Error("Got status " + res.statusCode + " while downloading " + url));
        let chunks = [];
        res.on("data", data => chunks.push(data));
        res.on("end", () => resolve(Buffer.concat(chunks)));
      })
      .on("error", e => reject(e));
  });
}

async function zip(builderFn) {
  return new Promise(async function(resolve, reject) {
    let zipBuilder = archiver("zip", { zlib: { level: 9 } });
    zipBuilder.on("error", () => reject());
    zipBuilder.on("end", () => resolve());
    await builderFn(zipBuilder);
    zipBuilder.finalize();
  });
}

module.exports = run();
