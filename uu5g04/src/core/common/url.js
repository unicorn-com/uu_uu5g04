/**
 * Copyright (C) 2021 Unicorn a.s.
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public
 * License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later
 * version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License at
 * <https://gnu.org/licenses/> for more details.
 *
 * You may obtain additional information at <https://unicorn.com> or contact Unicorn a.s. at address: V Kapslovne 2767/2,
 * Praha 3, Czech Republic or at the email: info@unicorn.com.
 */

import Environment from "../environment/environment.js";

const regexp = {
  url: /^((http[s]?|ftp):\/)?\/?([^:\/\s]+):?(\d+)?([^?#]+)?\??([^#]+)?#?(.*)$/,
  colon: /:$/,
  slash: /^[/]/,
  hash: /^#/,
  http: /^(\/|[a-z0-9\-+.]+:)/,
  slashes: /([^:])\/+/g,
};

function isRoute(href) {
  return href && !regexp.http.test(href) && !regexp.hash.test(href);
}

function getRouteUrl(href) {
  let basePath = Environment.getAppBasePath();
  let usedHref = href.charAt(0) === "?" ? (Url.parse(location.href).useCase || "") + href : href;
  return basePath ? basePath.replace(/\/*$/, "/") + usedHref.replace(/^\/+/, "") : usedHref;
}

export class Url {
  static parse(url) {
    url = url || window.location.href;
    let result = new Url();

    if (typeof url === "string") {
      let parser;
      try {
        parser = new URL(url);
      } catch (e) {
        // HF for ie, Safari
        let matcher = url.match(regexp.url);

        parser = {
          protocol: matcher[2],
          hostname: matcher[3],
          port: matcher[4],
          pathname: matcher[5],
          search: matcher[6],
          hash: matcher[7],
        };
      }
      parser.protocol && (result.protocol = parser.protocol.replace(regexp.colon, ""));
      parser.hostname && (result.hostName = parser.hostname);
      parser.port && (result.port = parser.port);
      parser.pathname && (result.pathName = parser.pathname.replace(regexp.slash, ""));
      parser.search && (result.parameters = parser.search);
      parser.hash && (result.hash = parser.hash);
    } else if (typeof url === "object") {
      url.protocol && (result.protocol = url.protocol);
      url.hostName && (result.hostName = url.hostName);
      url.port && (result.port = url.port);
      url.pathName && (result.pathName = url.pathName.replace(regexp.slash, ""));
      url.parameters && (result.parameters = url.parameters);
      url.hash && (result.hash = url.hash);
    }

    return result;
  }

  static encodeValue(value) {
    let result = value + "";

    if (value && (Array.isArray(value) || typeof value === "object")) {
      result = JSON.stringify(value);
    }

    return encodeURIComponent(result);
  }

  static encodeQuery(params) {
    let query = "?";

    for (let name in params) {
      query += name + "=" + Url.encodeValue(params[name]) + "&";
    }

    return query.substr(0, query.length - 1);
  }

  static decodeValue(value) {
    value = decodeURIComponent(value);
    let result = value;

    if (!isNaN(value)) {
      result = value;
    } else if (value === "true") {
      result = true;
    } else if (value === "false") {
      result = false;
    } else {
      let json = Url._checkJson(value);

      if (json) {
        result = json;
      }
    }

    return result;
  }

  static decodeQuery(query) {
    let params = {};

    query = query.replace(/^\?/, "");
    query.split("&").forEach((value) => {
      let valueSplitter = value.split("=");
      params[valueSplitter[0]] = Url.decodeValue(valueSplitter[1]);
    });

    return params;
  }

  static _checkJson(str) {
    try {
      return JSON.parse(str);
    } catch (e) {
      return false;
    }
  }

  static getAbsoluteUri(uri) {
    let resultUri;

    if (uri != null) {
      if (regexp.hash.test(uri)) {
        resultUri = location.href.split("#")[0] + uri;
      } else if (isRoute(uri)) {
        resultUri = getRouteUrl(uri);
      } else {
        resultUri = uri;
      }

      if (!/^[a-z0-9\-+.]+:/i.test(resultUri)) {
        if (!resultUri.startsWith("/")) resultUri = "/" + resultUri;
        resultUri = location.protocol + "//" + location.host + resultUri;
      }
    }

    return resultUri;
  }

  static join(...args) {
    let url = args.join("/").replace(regexp.slashes, "$1/");
    if (url[url.length - 1] === "/") url = url.replace(/\/*$/, "");
    return url;
  }

  constructor() {
    this.protocol = null;
    this.hostName = null;
    this.port = null;
    this._pathName = null;
    this._parameters = null;
    this._hash = null;
  }

  get useCase() {
    let useCase = null;
    let baseName = this.baseName;

    if (baseName) {
      useCase = this._pathName.substr(baseName.length);
    } else {
      useCase = this._pathName;
    }

    return useCase;
  }

  set useCase(useCase) {
    let baseName = this.baseName || "";
    this._pathName = baseName + useCase;
    return this;
  }

  get baseName() {
    let baseName = null;
    let basePath = Environment.getAppBasePath();
    if (basePath && this._pathName) {
      basePath = basePath.replace(regexp.slash, "");
      if (this._pathName.startsWith(basePath) || this._pathName === basePath.replace(/\/$/, "")) {
        baseName = basePath;
      }
    }
    return baseName;
  }

  get pathName() {
    return this._pathName;
  }

  set pathName(pathName) {
    this._pathName = pathName.replace(regexp.slash, "");
    return this;
  }

  get parameters() {
    return this._parameters;
  }

  set parameters(parameters) {
    if (typeof parameters === "string") {
      this._parameters = Url.decodeQuery(parameters);
    } else {
      this._parameters = parameters || null;
    }
    return this;
  }

  get hash() {
    return this._hash;
  }

  set hash(hash) {
    this._hash = typeof hash === "string" ? hash.replace(regexp.hash, "") : null;
    return this;
  }

  get host() {
    let host = "";
    this.hostName && (host += this.hostName);
    this.port && (host += ":" + this.port);
    return host || null;
  }

  get origin() {
    let origin = "";

    this.protocol && (origin += this.protocol + "://");

    let host = this.host;
    host && (origin += host);

    return origin || null;
  }

  set(params) {
    params.protocol !== undefined && (this.protocol = params.protocol);
    params.hostName !== undefined && (this.hostName = params.hostName);
    params.port !== undefined && (this.port = params.port);
    params.useCase !== undefined && (this.useCase = params.useCase);
    params.pathName !== undefined && (this.pathName = params.pathName);
    params.parameters !== undefined && (this.parameters = params.parameters);
    params.hash !== undefined && (this.hash = params.hash);
    return this;
  }

  toString() {
    let url = this.origin || "";
    url += "/";
    this.pathName && (url += this.pathName);
    this.parameters && (url += Url.encodeQuery(this.parameters));
    this.hash && (url += "#" + this.hash);
    return url;
  }
}

export default Url;
