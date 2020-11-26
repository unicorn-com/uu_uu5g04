const fs = require("fs");
const path = require("path");
const pkg = require("../package.json");

// !!! Banner .ejs files must be using ES5 and there are no polyfills ready yet at that stage
//     so "startsWith()", ..., wouldn't work in IE.
// !!! .min.ejs file is not auto-generated. It must be updated manually.
// !!! .ejs file currently uses SystemJS's internal fields for detecting the base URI of the library
//     (watchout if SystemJS version gets updated)

let g05Banners = {};
function getG05Banner(isMinified, filename) {
  if (g05Banners[isMinified] === undefined) {
    g05Banners[isMinified] = fs.readFileSync(
      path.join(__dirname, "build", "uu5g05-banner" + (isMinified ? ".min" : "") + ".ejs"),
      "utf-8"
    );
  }
  return replaceExpressions(g05Banners[isMinified], {
    NAME_REGEXP: filename.replace(/[.?*+^$[\]\\(){}|]/g, "\\$&").replace(/(\\\.min)?\\\.js$/, "(?:\\.min)?\\.js"),
    VERSION: pkg.version,
    MAJOR_VERSION: pkg.version.replace(/\..*/, ""),
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
