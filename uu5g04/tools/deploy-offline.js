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
const uploadFile = require("./doc-cmd/core/upload-file.js");

async function run() {
  if (process.argv.slice(-1)[0] !== "false") {
    await require("./build-offline.js");
  }
  let { version } = JSON.parse(fs.readFileSync("package.json", "utf-8"));
  let filePath = `target/uu5g04-${version}-offline.zip`;
  if (!fs.existsSync(filePath)) throw new Error(`Nothing to upload - ${filePath} doesn't exist.`);

  console.log(`Uploading ${filePath} to uuBookKit...`);
  await uploadFile.File.upload(filePath, "uu5g04Offline", true);
}

module.exports = run();
