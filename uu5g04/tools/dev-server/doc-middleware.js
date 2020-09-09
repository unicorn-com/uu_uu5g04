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
const child_process = require("child_process");

module.exports = class Middleware {
  constructor(config) {
    this.config = config;
    this._fileCache = {};

    // link the directory to the output folder so that it's present when listing directory contents
    console.log("Linking doc/ folder to development server output folder.");
    if (process.platform === "win32") {
      child_process.spawnSync("mklink", ["/J", "doc", path.join("..", "..", "doc")], {
        shell: true,
        stdio: ["ignore", "ignore", "inherit"],
        cwd: path.resolve("target", "dist")
      });
    } else if (process.platform === "darwin") {
      // MacOS
      child_process.spawnSync("ln", ["-s", path.join("..", "..", "doc"), "doc"], {
        shell: true,
        stdio: ["ignore", "ignore", "inherit"],
        cwd: path.resolve("target", "dist")
      });
    } else if (process.platform === "linux") {
      child_process.spawnSync("ln", ["-s", path.join("..", "..", "doc"), "doc"], {
        shell: true,
        stdio: ["ignore", "ignore", "inherit"],
        cwd: path.resolve("target", "dist")
      });
    } else {
      console.warn("Linking doc/ folder is not implemented for this OS yet.");
    }
  }
  process(request, response, next) {
    // make oidc-callback.html page available to all doc/ pages
    if (request.url.match(/^\/doc[^?]*\/oidc-callback\.html(\?.*)?$/)) {
      return this._sendOidcCallback(response);
    }

    // handle .html files inside doc/ URLs
    if (request.url.match(/^\/doc\/.*\.html(\?.*)?$/)) {
      let file = request.url.substr(1).replace(/\?.*/, "");
      if (fs.existsSync(file)) {
        let html = fs.readFileSync(file, "utf-8");
        let modHtml = html;
        // comment out setting of <base>
        modHtml = modHtml.replace(/<script>(((?!<\/script>)(\s|\S))*<base(\s|\S)*?)<\/script>/, (m, g) => {
          return (
            "<script>" +
            g
              .split("\n")
              .map(it => "// " + it)
              .join("\n") +
            "</script>"
          );
        });
        // insert extra JS which reconfigures SystemJS and renders Controls
        modHtml = modHtml.replace(/<\/body>/g, m => {
          return [
            '<script src="doc-middleware-browser-config.js"></script>', // reconfigure via ES5
            '<script type="text/babel" src="doc-middleware-browser-controls.js"></script>', // Controls can use ES6+
            m
          ].join("\n");
        });
        return response.status(200).send(modHtml);
      }
    }
    if (request.url.match(/doc-middleware-browser-[^./\\]*\.js$/)) {
      let content = this._getFile(request.url.split("/").slice(-1)[0]);
      return content != null ? response.status(200).send(content) : response.status(404);
    }
    next();
  }

  _getFile(name) {
    if (name in this._fileCache) return this._fileCache[name];
    let result = null;
    let filePath = path.resolve(__dirname, name);
    if (fs.existsSync(filePath)) {
      let content = fs.readFileSync(filePath, "utf-8");
      result = content.replace(/<%=(.*?)%>/g, (m, expr) => {
        let context = this.config; // eslint-disable-line
        return eval(expr) + "";
      });
    }
    this._fileCache[name] = result;
    return result;
  }

  _sendOidcCallback(response) {
    let dirName = path.resolve("node_modules", "uu_oidcg01", "dist", "callbacks");
    if (fs.existsSync(path.join(dirName, "oidc-callback.html"))) {
      return response.sendFile("oidc-callback.html", { root: dirName });
    }
    return response.status(200)
      .send(String.raw`<script>if (opener && !opener.closed && opener.uuOidcCallbackFn) opener.uuOidcCallbackFn(location.href + "", window);
else if (frameElement && parent && parent.uuOidcCallbackFn) parent.uuOidcCallbackFn(location.href + "", window);
else if (navigator.standalone) {
  let state = (location.hash.match(/[#&]state=([^&]*)/) || [])[1];
  let redirectUrl = (state ? decodeURIComponent(state).replace(/^[^,]*,?/, "") : null);
  if (redirectUrl && redirectUrl.match(/^\//)) location.href = redirectUrl;
  else location.href = location.pathname.replace(/\/(public|assets)\/(\d+\.\d+\.\d+\/)?.*/, "/"); // guess app root
} else close();
</script>`);
  }
};
