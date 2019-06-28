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

const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const RemoteClient = require("./remote-client.js");

const UU_HOME = path.resolve(process.env[process.platform == "win32" ? "USERPROFILE" : "HOME"], ".uu");

class Session {
  constructor(accessToken) {
    this.accessToken = accessToken;
  }
  static async login(...args) {
    let tmpToken = getAccessToken(args);

    // Evaluate token, and obtain new JWT token
    // Send also previous token (if available) to create auth chain
    let svc = new RemoteClient(Session);
    svc.authToken = tmpToken;
    let result = await svc.post("login", null, Session.currentSession.accessToken);
    result = result.replace(/"/g, "");
    let session = new Session(result);
    session._credentialsToken = tmpToken;
    if (Session.currentSession === EMPTY_SESSION) Session.currentSession = session;
    return session;
  }

  async getOidcCallToken() {
    if (!this._oidcToken && this._credentialsToken) {
      let svc = new RemoteClient(Session, { baseUrl: "https://oidc.plus4u.net/uu-oidcg01-main/99923616732452117-4f06dafc03cb4c7f8c155aa53f0e86be", path: "" });
      svc.authToken = "Basic " + Buffer.from("uu-oidc%3Aunregistered-client%3A8395b97f-8e92-48bf-95ed-b3363c9075b7:12345", "utf-8").toString("base64");
      let cred = Buffer.from(this._credentialsToken.replace(/^Basic\s+/, ""), "base64").toString("utf-8");
      let [, ac1, ac2] = cred.match(/^([^:]*):(.*)$/);
      let params = {
        username: ac1,
        password: ac2,
        scope: "openid",
        grant_type: "password"
      };
      let result = await svc.post("grantToken", null, params)
      this._oidcToken = result.token_type + " " + result.id_token;
    }
    return this._oidcToken;
  }
}
Session.PATH = "ues/core/security/session/UESSession";

const EMPTY_SESSION = new Session();
Session.currentSession = EMPTY_SESSION;

function getAccessToken(args) {
  let tmpToken;
  if (args.length === 1) {
    // load from file
    let filePath = args[0];
    // TODO Use async methods.
    if (!fs.existsSync(filePath)) filePath = path.join(UU_HOME, filePath);
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      let fileContent = fs.readFileSync(filePath, "utf8")
      let crd = loadConfiguration(fileContent);
      if (!crd["accessCode1"]) crd = loadConfiguration(decrypt(fileContent));
      // FIXME realm
      let ac1 = crd["accessCode1"];
      let ac2 = crd["accessCode2"];
      tmpToken = "Basic " + Buffer.from(ac1 + ":" + ac2, "utf8").toString("base64");
    } else {
      // FIXME
      tmpToken = args[0];
    }
  } else if (args.length === 2) {
    tmpToken = "Basic " + Buffer.from(args[0] + ":" + args[1], "utf8").toString("base64");
  }
  // FIXME else args.length === 3 (realm, ac1, ac2).

  return tmpToken;
}

function loadConfiguration(fileContent) {
  let lines = fileContent.split(/\r?\n/).filter(it => it.trim() && !it.match(/^\s*#/));
  let conf = {};
  lines.forEach(it => {
    let eqlIdx = it.indexOf("=");
    if (eqlIdx === -1) return;
    let key = it.substr(0, eqlIdx);
    if (!key.match(/^[a-zA-Z0-9_\-.]+$/)) return;
    conf[key] = it.substr(eqlIdx + 1);
  });
  return conf;
}

function decrypt(str, password = null) {
  const ALGORITHM = "aes-128-cbc";
  const SECRET = "U2FsdGVkX19jrg+FR+SgV5nG6ulKFh+SvsegRXSV5kc=\\n";

  let buffer = Buffer.from(str, "base64");
  let salt = buffer.slice(8, 16);
  let data = buffer.slice(16);
  let key = crypto.pbkdf2Sync(password == null ? SECRET : password, salt, 1000, 128, "sha1").slice(0, 16);
  let decipher = crypto.createDecipheriv(ALGORITHM, key, key);
  return decipher.update(data) + decipher.final();
}

module.exports = Session;
