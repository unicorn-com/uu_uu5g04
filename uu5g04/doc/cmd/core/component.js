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
const Config = require("../config.js");
const UU = require("../../../tools/uu-client/uu-client.js");
const DocKitClient = require("./bookkit-client.js");

module.exports = class Component {
  constructor(tag_name, tid_awid = null) {
    this.tag_name = tag_name
    this.tid_awid = tid_awid || Config.BOOK_TID_AWID
  }

  async update_example(i, file_name0 = null) {
    let file_name = file_name0 || this._get_file_name()
    let base_code = `example${this.tag_name.replace(/\./g, "")}`

    let num = i.toString();
    if (num.length < 2) num = "0" + num;
    let code = `${base_code}${num}`
    let file_path = `../${file_name}/e${num}.html`

    await this._update_file(file_path, code)
  }

  async update_examples() {
    let file_name = this._get_file_name();
    let i = 0
    while (i < 15) {
      await this.update_example(i, file_name)
      i += 1
    }
  }

  async update_source() {
    let parts = this.tag_name.split('.')
    let vendor = parts.shift()
    let mdl = parts.shift()
    let name = parts.join('.')

    let source_path_js = `../../src/${this._get_file_name().replace(/^common\//g, 'core/common/')}.js`
    let code_js = `source${mdl}${name.replace(/\./g, '')}Js`
    await this._update_file(source_path_js, code_js)

    // let source_path_less = `../../src/${mdl.toLowerCase()}/${name.replace(/\./g, "-").toLowerCase()}.less`
    // let code_less = `source${mdl}${name.replace(/\./g, "")}Less`
    // await this._update_file(source_path_less, code_less)
  }

  async update(opt = {}) {
    if (opt.source !== false) await this.update_source()

    if (opt.example) await this.update_example(opt.example)
    else await this.update_examples()
  }

  _client() {
    return this.client || (this.client = new DocKitClient({ baseUrl: `https://uuos9.plus4u.net/uu-bookkitg01-main/${this.tid_awid}/` }))
  }

  _get_file_name() {
    let parts = this.tag_name.split('.')
    let vendor = parts.shift()
    let mdl = parts.shift()
    let name = parts.join('.')
    if (mdl === "UuBmlDraw") mdl = "uubmldraw"; // for backward compatibility we don't want to rename folder to "uu-bml-draw/"
    return `${this._dash_case(mdl).toLowerCase()}/${this._dash_case(name).toLowerCase()}`
  }

  async _update_file(filePath, code) {
    if (fs.existsSync(filePath)) {
      let params = { code: code }

      if (filePath.match(/\.html?$/)) {
        let html = fs.readFileSync(filePath, "utf-8");
        fs.writeFileSync(filePath, html.replace(/\r\n/g, "\n"), "utf-8");

        params["contentType"] = "text/html";
      }

      let f = fs.readFileSync(filePath); // not using streams because of server-side issue with sending files larger than 16kB
      params["data"] = new UU.OS.REST.BinaryValue({ data: f, name: path.basename(filePath) });
      try {
        params["revisionStrategy"] = "NONE";
        await this._client().uuAppBinaryStore_updateBinaryData(params);
        console.log(`Binary file ${code} updated.`);
      } catch (e) {
        let err = e.uuAppErrorMap && e.uuAppErrorMap["uu-app-binarystore/uuBinaryUpdateBinaryData/uuBinaryDaoUpdateByCodeFailed"];
        while (err && err.cause) err = err.cause.uuAppErrorMap;
        if (err && err["uu-app-binarystore/objectNotFound"]) {
          try {
            delete params["revisionStrategy"];
            await this._client().uuAppBinaryStore_createBinary(params);
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
  }

  _dash_case(string) {
    return string.replace(/([A-Z]+)([A-Z][a-z])/g, "$1-$2").
      replace(/([a-z\d])([A-Z])/g, "$1-$2").
      replace(/\./g, "").
      toLowerCase();
  }
}
