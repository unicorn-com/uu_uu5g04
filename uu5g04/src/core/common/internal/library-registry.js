// NOTE Can be removed when g04 & g05 are integrated together.
// Copy&pasted from uu5g05 (library-registry.js) and tweaked imports.

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

import Environment, { statistics } from "../../environment/environment";

export class LibraryRegistry {
  static _libraryMap = {}; // name (e.g. "uu5g04-bricks") => { name, version, namespace }
  static _namespaceMap = {}; // namespace (e.g. "UU5.Bricks") => { name, version, namespace, exports, ready, promise } (see use-dynamic-library-component.js)
  static _backCompatGetLibrary = Environment.getLibrary; // (libraryCode) => ({ version: "" }) // backward-compatibility field for usage in uu5g04 (UU5.Environment.getLibrary)
  static _loadLibraryCache = {};

  static registerLibrary({ name, version, namespace }) {
    let oldItem = this._libraryMap[name];
    if (namespace && oldItem?.namespace && oldItem.namespace !== namespace) {
      this._namespaceMap[namespace] = this._namespaceMap[oldItem.namespace];
      console.warn(
        `Library ${name}@${version} was supposed to use namespace '${oldItem.namespace}' but it uses '${namespace}'. This might mean that it is registered into library registry having code='${oldItem.namespace}' whereas its components identify themselves (displayName) with '${namespace}.' prefix (or the library is passing custom data into addRuntimeLibrary(...) call instead of passing standardized data prepared by uu_appg01_devkit build tool). It is recommended to make these two match.`
      ); // not using Tools due to cyclic dependencies
    }
    this._libraryMap[name] = { name, version, namespace };
    if (namespace) {
      if (!this._namespaceMap[namespace]) this._namespaceMap[namespace] = {};
      Object.assign(this._namespaceMap[namespace], this._libraryMap[name]); // merge, don't fully replace
    }
  }

  static listLibraries() {
    return Object.values(this._libraryMap);
  }

  static async getLibrary(namespace) {
    // TODO Use Utils.Request API when ready.
    let dtoIn = {
      code: namespace,
    };
    let library = LibraryRegistry._backCompatGetLibrary?.(namespace);
    library && library.version && (dtoIn.version = library.version);
    let query = _encodeQuery(dtoIn);
    let url = Environment.COMPONENT_REGISTRY_URL + "?" + query;
    let cache = LibraryRegistry._loadLibraryCache;

    if (!cache[query]) {
      let resolve, reject;
      let promise = new Promise((res, rej) => {
        resolve = res;
        reject = rej;
      });
      cache[query] = {
        result: null,
        error: null,
        promise,
      };
      let request = new XMLHttpRequest();
      request.onreadystatechange = () => {
        if (request.readyState === XMLHttpRequest.DONE) {
          let result, error, body;
          // TODO: componentRegistry must return error, not 200
          try {
            body = JSON.parse(request.response);
          } catch (e) {
            error = e;
          }
          if (request.status === 200 && error === undefined) {
            result = body;
          } else {
            let cause = error;
            error = new Error("Loading library ended with status " + request.status + " on url:" + url);
            error.dtoOut = body;
            if (typeof body?.uuAppErrorMap === "object" && body.uuAppErrorMap) {
              for (let k in body.uuAppErrorMap) {
                if (body.uuAppErrorMap[k]?.type === "error") {
                  error.code = k;
                  break;
                }
              }
            }
            if (cause) error.cause = cause;
          }
          cache[query].result = result;
          cache[query].error = error;
          if (error) reject(error);
          else resolve(result);
        }
      };
      request.open("GET", url, true);
      request.setRequestHeader("Content-Type", "application/json");
      request.send(null);
    }
    return cache[query].promise;
  }
}

function _encodeQuery(dtoIn) {
  let result = [];
  for (let k in dtoIn) {
    let value = dtoIn[k];
    if (value == null) continue;
    if (Array.isArray(value) || typeof value === "object") value = JSON.stringify(value);
    result.push(encodeURIComponent(k) + "=" + encodeURIComponent(value));
  }
  return result.join("&");
}

// NOTE Moved here to prevent circular dependencies.
// library = {name, version} or {name, version, namespace}
Environment.addRuntimeLibrary = (library) => {
  LibraryRegistry.registerLibrary(library);
  return this;
};
const origG05RegisterLibrary = LibraryRegistry.registerLibrary;
LibraryRegistry.registerLibrary = function (...args) {
  origG05RegisterLibrary.apply(this, args);
  statistics.addLibrary(args[0]);
};
for (let item of LibraryRegistry.listLibraries()) statistics.addLibrary(item);

export default LibraryRegistry;
