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
const readline = require('readline');
const UU = require("../../tools/uu-client/uu-client.js");
const DocKitClient = require("./core/bookkit-client.js");
const Config = require("./config.js");

const UuDocKit = {
  client() {
    return this._client = this._client || new DocKitClient({ baseUrl: `https://uuos9.plus4u.net/uu-bookkitg01-main/${Config.BOOK_TID_AWID}/` });
  },

  File: class File {
    static async delete(code) {
      await UuDocKit.client().uuAppBinaryStore_deleteBinary({ code: code });
    }

    static async _upload(filePath, code, params = {}) {
      params = JSON.parse(JSON.stringify(params));
      params.code = code;

      let f = fs.createReadStream(filePath, "binary");
      params.data = new UU.OS.REST.BinaryValue({ data: f, name: path.basename(filePath) });

      await UuDocKit.client().uuAppBinaryStore_createBinary(params);
      console.log(`Binary file ${code} added.`);
    }

    static async upload(filePath, code) {
      let params = {};

      if (filePath.match(/\.html?$/)) {
        let html = fs.readFileSync(filePath, "utf-8");
        fs.writeFileSync(filePath, html.replace(/\r\n/g, "\n"));
        params.contentType = "text/html";
      }

      try {
        await UuDocKit.File._upload(filePath, code, params);
      } catch (e) {
        if (e.uuAppErrorMap && Object.keys(e.uuAppErrorMap)[0] === "uu-app-binarystore/uuBinaryCreateBinary/duplicateCode") {
          let rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
          });

          rl.question(`Binary ${code} already exists. Update? [y/n]: `, async function (answer) {
            answer = answer.trim().toLowerCase() === "y";

            if (answer) {
              await UuDocKit.File.delete(code);
              await UuDocKit.File._upload(filePath, code, params);
              process.exit();
            }
          });
        } else {
          console.error(`Binary file ${code} failed.`, e);
          throw e;
        }
      }
    }
  }
};

(async function () {
  await UU.OS.Security.Session.login(Config.ACCESS_FILE_PATH);
  UuDocKit.File.upload("C:/Users/ocape/Desktop/component.js", "testTestTest");
})();
