const fs = require("fs");
const path = require("path");
const pkg = require("../package.json");

// !!! Banner .ejs files must be using ES5 and there are no polyfills ready yet at that stage
//     so "startsWith()", ..., wouldn't work in IE.
// !!! .min.ejs file is not auto-generated. It must be updated manually.
// !!! .ejs file currently uses SystemJS's internal fields for detecting the base URI of the library
//     (watchout if SystemJS version gets updated)

let g05Banners = {};
let uu5stringg01CdnVersion;
function getG05Banner(isMinified, filename) {
  if (g05Banners[isMinified] === undefined) {
    g05Banners[isMinified] = fs.readFileSync(
      path.join(__dirname, "build", "uu5g05-banner" + (isMinified ? ".min" : "") + ".ejs"),
      "utf-8"
    );
  }

  if (uu5stringg01CdnVersion === undefined) {
    let uu5g05Pkg = require("uu5g05/package.json");
    let uu5stringg01VersionSpec = (uu5g05Pkg.dependencies || {})["uu5stringg01"] || "";
    let match = uu5stringg01VersionSpec.match(/^([^]?)(\d+)\.\d+\.\d+$/);
    if (match) {
      uu5stringg01CdnVersion = match[2] + ".0.0";
    } else {
      let uu5g05Dir = require.resolve("uu5g05/package.json").replace(/[/\\][^/\\]*$/, "");
      let uu5stringg01Pkg = require(require.resolve("uu5stringg01/package.json", { paths: [uu5g05Dir] }));
      uu5stringg01CdnVersion = uu5stringg01Pkg.version.replace(/\..*/, "") + ".0.0";
    }
  }

  return replaceExpressions(g05Banners[isMinified], {
    NAME_REGEXP: filename.replace(/[.?*+^$[\]\\(){}|]/g, "\\$&").replace(/(\\\.min)?\\\.js$/, "(?:\\.min)?\\.js"),
    VERSION: pkg.version,
    MAJOR_VERSION: pkg.version.replace(/\..*/, ""),
    UU5STRINGG01_CDN_VERSION: uu5stringg01CdnVersion,
  });
}

function replaceExpressions(text, map) {
  return text.replace(/<%=\s*(.*?)\s*%>/g, (m, g) => map[g]);
}

module.exports = function ({ filename }, licenseComment) {
  let match = filename.match(/^uu5g04(?:-[^.]*)?(\.min)?\.js$/);
  if (!match) return licenseComment;
  let isMinified = !!match[1];
  let content = getG05Banner(isMinified, filename);
  return licenseComment + "\n" + content;
};
