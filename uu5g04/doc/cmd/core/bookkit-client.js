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

const UU = require("../../../tools/uu-client/uu-client.js");

class DocKitClient {
  constructor(opts = {}) {
    Object.assign(this, opts); // {baseUrl: ""}
  }
  async uuAppBinaryStore_createBinary(binary) {
    let svc = new UU.OS.REST.RemoteClient(DocKitClient, { baseUrl: this.baseUrl });
    svc.authToken = await UU.OS.Security.Session.currentSession.getOidcCallToken();
    svc.contentType = "multipart/form-data";
    return await svc.post("createBinary", null, binary);
  }
  async uuAppBinaryStore_updateBinaryData(binary) {
    let svc = new UU.OS.REST.RemoteClient(DocKitClient, { baseUrl: this.baseUrl });
    svc.authToken = await UU.OS.Security.Session.currentSession.getOidcCallToken();
    svc.contentType = "multipart/form-data";
    return await svc.post("updateBinaryData", null, binary);
  }
  async uuAppBinaryStore_deleteBinary(binary) {
    let svc = new UU.OS.REST.RemoteClient(DocKitClient, { baseUrl: this.baseUrl });
    svc.authToken = await UU.OS.Security.Session.currentSession.getOidcCallToken();
    svc.contentType = "multipart/form-data";
    return await svc.post("deleteBinary", null, binary);
  }
}
DocKitClient.BASE_URL = "https://uuos9.plus4u.net/uu-bookkitg01-main/0-0/";

module.exports = DocKitClient;
