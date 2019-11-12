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

const ERRORS = {
  "uu5/e001": "No internet connection",
  "uu5/e002": "Unknown Error",
  "uu5/e004": "Client Error",
  "uu5/e005": "Server Error"
};

class UU5Request {
  static call(method, url, data, opt = {}) {
    let headers = { ...opt.headers };
    headers["Content-Type"] = headers["Content-Type"] || "application/json";

    let params = {
      ...opt,
      headers,
      method,
      // TODO binary, ...
      body: JSON.stringify(data)
    };

    if (method === "GET") {
      data && (url += UU5Request._encodeQuery(data));
      delete params.body;
    }

    return new Promise((resolve, reject) => {
      let request = new Request(url, params);

      fetch(request)
        .then(response => {
          let contentType = response.headers.get("content-type");

          let dataPromise;
          if (!contentType || contentType.includes("text/plain")) {
            dataPromise = response.text();
          } else if (contentType.includes("application/json")) {
            dataPromise = response.json();

            // TODO: another blob content types
          } else if (["image", "audio", "video", "octet-stream", "zip"].find(v => contentType.includes(v))) {
            dataPromise = response.blob();
          } else {
            dataPromise = contentType.startsWith("text/") ? response.text() : response.blob();
          }

          return { response, dataPromise };
        })
        .then(({ response, dataPromise }) => {
          if (response.status === 200) {
            // TODO: do resolve, reject just one param
            dataPromise.then(data => resolve(UU5Request._getDtoOut(url, data, response), response));
          } else {
            // TODO: error handling with uu dtoOut structure
            let code = "uu5/e002";
            if (response.status >= 500) {
              code = "uu5/e005";
            } else if (response.status >= 400) {
              code = "uu5/e004";
            }

            if (dataPromise) {
              dataPromise.then(data => reject(UU5Request._getDtoOut(url, data, response, code), response));
            } else {
              reject(UU5Request._getDtoOut(url, data, response, code), response);
            }
          }
        })
        .catch(response => {
          if (window.navigator.onLine) {
            reject(UU5Request._getDtoOut(url, data, response, "uu5/e002"), response);
          } else {
            reject(UU5Request._getDtoOut(url, data, response, "uu5/e001"), response);
          }
        });
    });
  }

  static get(url, data, opt) {
    return this.call("GET", url, data, opt);
  }

  static post(url, data, opt) {
    return this.call("POST", url, data, opt);
  }

  static _getDtoOut(url, data, response, code) {
    let dtoOut = {
      url,
      status: response.status,
      data
    };

    if (code) {
      dtoOut.code = code;
      dtoOut.error = ERRORS[code] + (response.message ? ": " + response.message : ".");
    }

    return dtoOut;
  }

  static _encodeValue = value => {
    let result = value + "";

    if (value && (Array.isArray(value) || typeof value === "object")) {
      result = JSON.stringify(value);
    }

    return encodeURIComponent(result);
  };

  static _encodeQuery = params => {
    let query = "?";

    for (let name in params) {
      query += name + "=" + UU5Request._encodeValue(params[name]) + "&";
    }

    return query.substr(0, query.length - 1);
  };
}

export { UU5Request as Request };
export default UU5Request;
