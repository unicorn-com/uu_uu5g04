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
const path = require("path");
const DocKitClient = require("../doc/cmd/core/bookkit-client.js");
const Config = require("../doc/cmd/config.js");
const UU = require("./uu-client/uu-client.js");

async function run() {
  if (process.argv.slice(-1) !== "false") {
    await require("./build-offline.js");
  }
  let { version } = JSON.parse(fs.readFileSync("package.json", "utf-8"));
  let filePath = `target/uu5g04-${version}-offline.zip`;
  if (!fs.existsSync(filePath)) throw new Error(`Nothing to upload - ${filePath} doesn't exist.`);

  console.log(`Uploading ${filePath} to DocKit...`);
  await UU.OS.Security.Session.login(Config.ACCESS_FILE_PATH);
  let client = new DocKitClient({ baseUrl: `https://uuos9.plus4u.net/uu-bookkitg01-main/${Config.BOOK_TID_AWID}/` });
  await upload(client, { code: "uu5g04Offline", filePath });
}

async function upload(client, { code, filePath }) {
  let params = { code };
  let f = fs.readFileSync(filePath); // not using streams because of server-side issue with sending files larger than 16kB
  params["data"] = new UU.OS.REST.BinaryValue({ data: f, name: path.basename(filePath) });
  try {
    params["revisionStrategy"] = "NONE";
    await client.uuAppBinaryStore_updateBinaryData(params);
    console.log(`Binary file ${code} updated.`);
  } catch (e) {
    let err =
      e.uuAppErrorMap && e.uuAppErrorMap["uu-app-binarystore/uuBinaryUpdateBinaryData/uuBinaryDaoUpdateByCodeFailed"];
    while (err && err.cause) err = err.cause.uuAppErrorMap;
    if (err && err["uu-app-binarystore/objectNotFound"]) {
      try {
        delete params["revisionStrategy"];
        await client.uuAppBinaryStore_createBinary(params);
        console.log(`Binary file ${code} added.`);
      } catch (e) {
        console.log(`\x1b[31mBinary file ${code} failed.\x1b[0m`);
        console.error(e.uuAppErrorMap ? JSON.stringify(e, null, 2) : e);
        throw e;
      }
    } else {
      console.error(e.uuAppErrorMap ? JSON.stringify(e, null, 2) : e);
      throw e;
    }
  }
}

module.exports = run();
