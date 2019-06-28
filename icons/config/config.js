// uu5-library-1.7.0
var pkg = require("../package.json");
var buildHelpers = require("../tools/helpers.js");

module.exports.getConfig = function () {
  "use strict"; // To avoid: Uncaught SyntaxError: Block-scoped declarations (let, const, function, class) not yet supported outside strict mode
  let isProductionBuild = (process.env.NODE_ENV == "production");

  let config = {
    // server/browser settings
    host: "0.0.0.0",
    port: 4320,
    https: false,
    autoOpenInBrowser: false,

    // build settings
    sourcePath: "src",  // file system folder with source files to build
    outputPath: "dist", // file system folder to build files to
    packs: [{
      entryPoints: ["icons.css"], // files to build (relative to "src/", resp. sourcePath)
      libraryGlobalVariable: pkg.name.replace(/(^|[\-_]+)(.)/g, (m, g1, g2) => g2.toUpperCase()), // uu_some_lib => UuSomeLib; used if this library is linked via <script src="">
      outputFile: `${pkg.name}.css`,
      minify: false,
      useSourceMaps: true,
      isProductionBuild: false // consider this not a production build - library can include development warnings for developers by checking 'if (process.env.NODE_ENV !== "production") ...' in JS code
    }, isProductionBuild ? {
      entryPoints: ["icons.css"],
      libraryGlobalVariable: pkg.name.replace(/(^|[\-_]+)(.)/g, (m, g1, g2) => g2.toUpperCase()), // uu_some_lib => UuSomeLib
      outputFile: `${pkg.name}.min.css`,
      minify: true,
      useSourceMaps: true,
      isProductionBuild: true
    } : null],
    includeDemoPages: !isProductionBuild,

    // additional aliases usable in "import" statements in JS or CSS
    aliases: {
      "ns": buildHelpers.createNamespaceAliasFileForJs(),
      "cssns": buildHelpers.createNamespaceAliasFileForCss(),
    }
  };


  // merge with build settings in package.json
  if (pkg.uuBuildSettings) config = Object.assign({}, pkg.uuBuildSettings, config);

  return config;
};
