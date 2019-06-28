// uu5-library-1.7.0
const webpack = require("webpack");
const fs = require("fs-extra");
const os = require("os");
const path = require("path");
const childProcess = require("child_process");
const klawSync = require("klaw-sync");
const babel = require("babel-core");
const babylon = require("babylon");

fs.emptyDirSync(".tmp");

let pkg = require("../package.json");
let config = require("../config/config.js").getConfig();
let srcDir = config.sourcePath || "src";
let destDir = config.outputPath || "dist";
let srcDirAbsPath = path.resolve(srcDir);
fs.emptyDirSync(destDir);

// show summary & run webpack if necessary
summarize(config);
let skipWebpack = (process.argv.slice(2).indexOf("--skip-webpack") !== -1);
if (!skipWebpack) doWebpackBuild(config);

function doWebpackBuild(config, callback) {
  console.log("Running webpack...");
  let webpackConfig = require("./webpack.config.js");
  webpack(webpackConfig, function (err, statsObj) {
    if (err) {
      console.error(err);
      return callback ? callback(err) : err;
    }

    // show standard output of webpack (if there're errors)
    let stats = statsObj.toJson();
    let statsConfig = (Array.isArray(webpackConfig) ? webpackConfig[0] : webpackConfig).stats;
    console.log(statsObj.toString(statsConfig));
    if (stats.errors.length > 0) {
      console.error("\n\x1b[31mBuild ended with errors!\x1b[0m");
      return callback ? callback(stats.errors[0]) : stats.errors[0];
    }

    // build for ES6 - copy source files (containing ES6 imports/exports) into dist-esm/, to enable IntelliSense
    // in IDEs such as RubyMine
    console.log("Adding ES6 files (to support Intellisense in IDEs)...");
    pkg = require("../package.json");
    if (!pkg["module"] || !pkg["jsnext:main"]) { // "jsnext:main" is required for Intellisense in RubyMine; "module" is newer version of it
      console.warn("WARNING Fields \"module\" or \"jsnext:main\" not found in package.json - adding to enable better Intellisense.");
      if (!pkg["module"]) pkg["module"] = "dist-esm/index.js";
      if (!pkg["jsnext:main"]) pkg["jsnext:main"] = "dist-esm/index.js";
      fs.writeFileSync("package.json", JSON.stringify(pkg, null, "  "), "utf-8");
    }
    let esmTargetFolder = pkg.module.split(/\//).slice(0, -1)[0] || "dist-esm";
    fs.emptyDirSync(esmTargetFolder);
    klawSync(srcDir).forEach(fileInfo => {
      // ignore demo folders / files
      if (fileInfo.stats.isDirectory() && fileInfo.path.endsWith(path.sep + "demo")) return;
      if (fileInfo.path.indexOf(path.sep + "demo" + path.sep) !== -1) return;
      if (fileInfo.stats.isDirectory() && fileInfo.path.endsWith(path.sep + "test")) return;
      if (fileInfo.path.indexOf(path.sep + "test" + path.sep) !== -1) return;

      // copy to target as-is, or with fixup of webpack aliases
      let relPath = path.resolve(fileInfo.path).substr(srcDirAbsPath.length + path.sep.length);
      let targetFile = path.join(esmTargetFolder, relPath);
      if (fileInfo.stats.isDirectory()) fs.mkdirSync(targetFile);
      else if (!fileInfo.path.match(/\.jsx?$/)) fs.copySync(fileInfo.path, targetFile); // copy non-JS files as-is
      else fixAliasedImports(fileInfo.path, targetFile, { targetFolder: esmTargetFolder }); // replace webpack aliases in files
    });

    // build for NodeJS - transpile ES6 imports/exports to NodeJS require-s (e.g. to support tests via Jest)
    console.log("Building for NodeJS (to support tests via Jest)...");
    fs.removeSync("dist-node");
    let babelCmd = path.join("node_modules", ".bin", (os.platform() === "win32" ? "babel.cmd" : "babel"));
    let babelCmdArgs = ["--copy-files", "--plugins=transform-es2015-modules-commonjs", "--out-dir", "dist-node", esmTargetFolder]
    let babelOutput = childProcess.spawnSync(babelCmd, babelCmdArgs, {shell: true, cwd: path.resolve("."), stdio: ["inherit", "pipe", "inherit"]});
    let hasUnexpectedOutput = babelOutput.stdout.toString().split(/\n/).map(it => it.replace(/^\S+\s+->\s+\S+$/, "").trim()).some(it => !!it);
    if (hasUnexpectedOutput) process.stdout.write(babelOutput.stdout);

    if (callback) callback();
  });
}

function summarize(config, err) {
  if (err) return;

  // nothing to show yet
}

function fixAliasedImports(srcFile, targetFile, opts) {
  function getModuleName(moduleName) {
    if (!config.aliases || !config.aliases[moduleName]) return moduleName;

    // redirect webpack aliases to standalone files
    let redirectTo = opts.targetFolder + "/__" + moduleName.replace(/[/\\]/g, "__") + ".js";
    if (!fs.existsSync(redirectTo)) fs.copySync(config.aliases[moduleName], redirectTo);
    return path.relative(path.dirname(path.resolve(targetFile)), path.resolve(redirectTo)).replace(/\\/g, "/");
  }

  // replace webpack aliases in "import" statements - copy contents of the aliased files
  // into targetFolder and redirect aliased names to the new file, e.g.:
  //   `import ns from "ns";`   =>  `import ns from "../../__ns.js"`
  // & copy contents of current "ns" alias to dist-esm/__ns.js
  let ast = babylon.parse(fs.readFileSync(srcFile, "utf-8"), { sourceType: "module", sourceFileName: srcFile, plugins: ["jsx", "flow"] });
  ((ast.program || {}).body || []).filter(it => it.type === "ImportDeclaration").forEach(importDecl => {
    let moduleName = importDecl.source.value;
    let usedModuleName = getModuleName(moduleName);
    if (usedModuleName !== moduleName) {
      // console.log(moduleName, "->", usedModuleName, srcFile);
      importDecl.source.value = importDecl.source.rawValue = usedModuleName;
      importDecl.source.raw = JSON.stringify(usedModuleName);
    }
  });
  let transResult = babel.transformFromAst(ast);
  fs.writeFileSync(targetFile, transResult.code, "utf-8");
}
