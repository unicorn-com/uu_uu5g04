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

const fetch = require("node-fetch");
const FormData = require("form-data");
const BinaryValue = require("./binary-value.js");

let Session;

// FIXME Use environment (uu-client.properties).
class RemoteClient {
  constructor(Cls, opts = {}) {
    if (!Session) Session = require("./session.js"); // lazy-load due to cyclic dependency

    let baseUrl = opts.baseUrl || Cls.BASE_URL || "https://api.plus4u.net/ues/wcp";
    this.authToken = opts.authToken || null;
    this.mainObjectUriParameterName = opts.mainObjectUriParameterName || "uesuri";
    this.contentType = null;
    this._baseUrl = baseUrl;
    this._basePath = opts.path != null ? opts.path : Cls.PATH;
  }
  async post(method, uesuri = null, data = null) {
    let url = concatUrlPath(this._baseUrl, this._basePath, method);
    if (uesuri) url += "?" + encodeURIComponent(this.mainObjectUriParameterName) + "=" + encodeURIComponent(uesuri);
    let isMultipart = this.contentType === "multipart/form-data";
    let body = isMultipart ? toFormData(data) : (data != null ? JSON.stringify(data) : null);
    let response = await fetch(url, {
      method: "POST",
      headers: Object.assign({
        accept: "application/json",
        authorization: this.authToken || Session.currentSession.accessToken
      }, isMultipart ? null : { "content-type": this.contentType || "application/json;charset=utf-8" }),
      body: body
    });
    return await processResponse(response);
  }
  async get(method, uesuri = null, data = null) {
    let url = concatUrlPath(this._baseUrl, this._basePath, method);
    let params = {};
    if (uesuri) params[this.mainObjectUriParameterName] = uesuri;
    if (data) Object.assign(params, data);
    url +=
      "?" +
      Object.keys(params)
        .filter(k => params[k] != null)
        .map(k => encodeURIComponent(k) + "=" + encodeURIComponent(params[k]))
        .join("&");
    let response = await fetch(url, {
      method: "GET",
      headers: {
        accept: "application/json",
        authorization: this.authToken || Session.currentSession.accessToken
      }
    });
    return await processResponse(response);
  }
}

function concatUrlPath(...args) {
  return args.filter(it => !!it).reduce((r, v) => r.replace(/\/+$/, "") + "/" + v.replace(/^\/+/, ""));
}

function toFormData(data) {
  if (!data || typeof data !== "object") return null;
  let formData = new FormData();
  Object.keys(data).forEach(key => {
    let value = data[key];
    let opts = {};
    if (value instanceof BinaryValue) {
      if (value.name) opts.filename = value.name;
      opts.contentType = value.contentType || "application/octet-stream";
      value = value.asStreamOrBuffer();
    } else {
      opts.contentType = "text/plain; charset=UTF-8";
    }
    formData.append(key, value, opts);
  });
  return formData;
}

async function processResponse(response) {
  let responseValue;
  let responseContentType = response ? response.headers.get("content-type") : null;
  if (responseContentType && responseContentType.startsWith("application/json")) {
    responseValue = await response.json();
  } else {
    responseValue = await response.text();
  }
  // console.log(JSON.stringify(responseValue).substr(0, 1000));
  if (response.status >= 400) {
    throw Object.assign(
      new Error(((responseValue.errorMessages || [])[0] || {}).localizedMessage || response.statusText),
      typeof responseValue === "object" ? responseValue : null
    );
  }
  return responseValue;
}

module.exports = RemoteClient;
