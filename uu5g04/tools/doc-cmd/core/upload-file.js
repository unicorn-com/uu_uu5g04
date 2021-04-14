const fs = require("fs");
const path = require("path");
const readline = require("readline");
const BookKitClient = require("./bookkit-client.js");
const Config = require("./config.js");

let rl;

const UuBookKit = {
  client() {
    return (this._client =
      this._client ||
      new BookKitClient({ baseUrl: `https://uuos9.plus4u.net/uu-bookkitg01-main/${Config.BOOK_AWID}/` }));
  },

  File: class File {
    static async delete(code) {
      await UuBookKit.client().uuAppBinaryStore_deleteBinary({ code: code });
    }

    static async _upload(filePath, code, params = {}) {
      params = JSON.parse(JSON.stringify(params));
      params.code = code;

      // params.data = fs.createReadStream(filePath, { highWaterMark: 30 << 20 }); // read 30MB as a single chunk because there's some issue with streaming on gateway
      params.filename = path.basename(filePath);
      params.data = fs.readFileSync(filePath);

      await UuBookKit.client().uuAppBinaryStore_createBinary(params);
      console.log(`Binary file ${code} added.`);
    }

    static async upload(filePath, code, overwrite = null) {
      let params = {};

      if (filePath.match(/\.html?$/)) {
        params.contentType = "text/html";
      }

      try {
        await UuBookKit.File._upload(filePath, code, params);
      } catch (e) {
        if (
          e.code === "uu-app-binarystore/uuBinaryCreateBinary/duplicateCode" ||
          e.code === "uu-app-binarystore/createBinary/duplicateCode" ||
          e.code === "uu-appbinarystore/duplicateDataKey" ||
          e.code === "uu-appbinarystore/duplicateCode"
        ) {
          if (!rl && typeof overwrite !== "boolean") {
            rl = readline.createInterface({
              input: process.stdin,
              output: process.stdout,
            });
          }

          let doOverwrite =
            typeof overwrite === "boolean"
              ? overwrite
              : await new Promise((resolve) => {
                  rl.question(`Binary ${code} already exists. Update? [Y/n]: `, async function (answer) {
                    answer = !!answer.trim().match(/^y?$/i);
                    resolve(answer);
                  });
                });
          if (doOverwrite) {
            try {
              await UuBookKit.File.delete(code);
              await UuBookKit.File._upload(filePath, code, params);
            } catch (e) {
              console.error(e.dtoOut && e.dtoOut.uuAppErrorMap ? JSON.stringify(e.dtoOut, null, 2) : e);
              throw e;
            }
          }
        } else {
          console.error(`Binary file ${code} failed.`, JSON.stringify(e, null, 2));
          throw e;
        }
      }
    }
  },
};

module.exports = UuBookKit;
