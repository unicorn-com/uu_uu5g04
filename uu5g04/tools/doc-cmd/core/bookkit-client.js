const fs = require("fs");
const path = require("path");
const { Client, Util } = require("uu_appg01");

const OidcSession = require("./oidc-session.js");
const BOUNDARY = "--------------------------854570457571352147975512";
const BOUNDARY_PRE = "--" + BOUNDARY;
const BOUNDARY_FINAL = BOUNDARY_PRE + "--";
const CRLF = "\r\n";

function binaryToMultipartString(binary) {
  let result = [];
  let { filename, ...data } = binary;
  Object.keys(data).forEach(key => {
    let value = data[key];
    let contentType;
    if (value instanceof fs.ReadStream) throw new Error("fs.ReadStream is not supported for uploading to binary store");
    if (value instanceof Buffer) {
      contentType = data.contentType || "application/octet-stream";
    } else {
      contentType = "text/plain; charset=UTF-8";
    }
    result.push(BOUNDARY_PRE);
    result.push(CRLF);
    result.push(`Content-Disposition: form-data; name="${key}"${key === "data" ? `; filename="${filename}"` : ""}`);
    result.push(CRLF);
    result.push(`Content-Type: ${contentType}`);
    result.push(CRLF);
    result.push(CRLF);
    result.push(value == null ? "" : value instanceof Buffer ? value : value + "");
    result.push(CRLF);
  });
  result.push(BOUNDARY_FINAL);
  result.push(CRLF);
  result.push(CRLF);
  return Buffer.concat(result.map(it => (it instanceof Buffer ? it : Buffer.from(it, "utf-8"))));
}

Util.Config.set("uuapp.perflog.logger.log_level", "OFF");

class BookKitClient {
  constructor(opts = {}) {
    Object.assign(this, opts); // {baseUrl: ""}
  }
  async uuAppBinaryStore_createBinary(binary) {
    await Client.post(`${this.baseUrl}createBinary`, binaryToMultipartString(binary), {
      session: await OidcSession.get(),
      transformParameters: false,
      headers: {
        "Content-Type": `multipart/form-data; boundary=${BOUNDARY}`
      }
    });
  }
  async uuAppBinaryStore_updateBinaryData(binary) {
    await Client.post(`${this.baseUrl}updateBinaryData`, binaryToMultipartString(binary), {
      session: await OidcSession.get(),
      transformParameters: false,
      headers: {
        "Content-Type": `multipart/form-data; boundary=${BOUNDARY}`
      }
    });
  }
  async uuAppBinaryStore_deleteBinary(binary) {
    await Client.post(`${this.baseUrl}deleteBinary`, binaryToMultipartString(binary), {
      session: await OidcSession.get(),
      transformParameters: false,
      headers: {
        "Content-Type": `multipart/form-data; boundary=${BOUNDARY}`
      }
    });
  }

  // _toFormData(data) {
  //   if (!data || typeof data !== "object") return null;
  //   let formData = new FormData();
  //   Object.keys(data).forEach(key => {
  //     let value = data[key];
  //     let opts = {};
  //     if (value instanceof Buffer || value instanceof fs.ReadStream) {
  //       if (value.path) opts.filename = path.basename(value.path);
  //       opts.contentType = value.contentType || data.contentType || "application/octet-stream";
  //     } else {
  //       opts.contentType = "text/plain; charset=UTF-8";
  //     }
  //     formData.append(key, value, opts);
  //   });
  //   return formData;
  // }
}
BookKitClient.BASE_URL = "https://uuos9.plus4u.net/uu-bookkitg01-main/0-0/";

module.exports = BookKitClient;
