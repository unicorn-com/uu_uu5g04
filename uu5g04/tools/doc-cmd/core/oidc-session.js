const path = require("path");
const fs = require("fs");
const PropertiesReader = require("properties-reader");
const { AuthenticationService } = require("uu_appg01_oidc");

let instance;

class OidcSession {
  constructor(tokenFile = "target/.devkit-token") {
    this.tokenPath = tokenFile;
  }

  static async get() {
    if (!instance) instance = new OidcSession();
    return instance.get();
  }

  async refresh() {
    if (this.session || !(await this._loadTokenFromFile())) {
      await this._interactiveLogin();
    }
    return this.session;
  }

  async get() {
    if (this.session == null) {
      await this.refresh();
    }
    return this.session;
  }

  _setSession(session) {
    this.session = session;
    return this.session;
  }

  async _loadTokenFromFile() {
    if (!fs.existsSync(this.tokenPath)) {
      return false;
    }

    var properties = PropertiesReader(this.tokenPath);
    if (properties.get("id_token")) {
      let token = properties.get("id_token");
      try {
        let session = await AuthenticationService.authenticate(token);
        this._setSession(session);
        // console.log("Auth: Using token from file.");
        return true;
      } catch (e) {
        // console.log("Auth: Token from file is not valid or expired.");
        return false;
      }
    }

    return false;
  }

  async _interactiveLogin() {
    console.log("Auth: Starting interactive login process.");
    let session = await AuthenticationService.authenticate();
    let token = session._idToken;

    console.log("> Token obtained.");

    try {
      let dirname = path.dirname(this.tokenPath);
      if (!fs.existsSync(dirname)) {
        fs.mkdirSync(dirname);
      }
      fs.writeFileSync(this.tokenPath, `id_token=${token}`, "utf-8");
    } catch (e) {
      console.log("> Unable to save token to provided location: " + this.tokenPath);
    }

    return this._setSession(session);
  }
}

module.exports = OidcSession;
