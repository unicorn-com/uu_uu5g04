const path = require("path");
const fs = require("fs");

let configJsPath = path.resolve("env", "bookkit-files-config.js");
if (!fs.existsSync(configJsPath)) {
  console.log("Configuration file does not exist - creating...");
  console.log("  " + configJsPath);
  let template = `// prettier-ignore
module.exports = {
  BOOK_AWID: null, // null <=> try to read it from uuapp.json; otherwise it can be e.g. "123456-ffffffffffffffffffffffffffffffff"
  FILES: {
    // "example00": "./examples/e00.html",
    // "code": "file.txt",
  }
};
`;
  fs.writeFileSync(configJsPath, template, "utf-8");
  process.exit(0);
}
let config = require(configJsPath);

if (!config.BOOK_AWID) {
  let bookkitTidAwid;
  let uuappJson = fs.existsSync("../uuapp.json") ? require(path.resolve("../uuapp.json")) : null;
  if (uuappJson) {
    let docUri = (uuappJson[path.basename(process.cwd())] || {}).docUri || uuappJson.docUri;
    if (docUri)
      bookkitTidAwid = docUri
        .replace(/^.*?uu-(bookkit|dockit)g01-main\//, "")
        .replace(/^.*?uu-(bookkit|dockit)-maing01\//, "")
        .replace(/\/.*/, "");
  }
  if (!bookkitTidAwid) {
    console.error(
      `Unable to read uuBookKit tid-awid from ../uuapp.json (there's no key '${path.basename(
        process.cwd()
      )}.docUri'). Fill it in or specify BOOK_AWID directly in ${configJsPath}`
    );
    process.exit(1);
  }
  config.BOOK_AWID = bookkitTidAwid;
}

module.exports = config;
