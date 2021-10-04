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

 const fs = require("fs-extra");
 const path = require("path");
 const less = require("less");
 
 let pkg = require("../package.json");
 
 async function run() {
   // copy tools.less
   fs.copyFileSync("src/tools.less", "target/dist/tools.less");
 
   console.log("Fixing uu5g04-test build due to test/ folder devkit conflict.");
   fs.removeSync("src/test-tmp");
   fs.moveSync("target/dist-node/test-tmp", "target/dist-node/test");
 
   // uu5g04-test is not listed in uuBuildSettings (it is not for browser)
   // so devkit doesn't know about it => generate Intellisense on our own
   console.log("Generating uu5g04-test Intellisense.");
   try {
     const Es6ExportsReader = require("uu_appg01_devkit/src/scripts/intellisense/es6-exports-reader");
     const ExportsToTypings = require("uu_appg01_devkit/src/scripts/intellisense/exports-to-typings");
     let processEnv = {
       NAME: pkg.name,
       VERSION: pkg.version,
       TARGET_ENVIRONMENT: "browser",
     };
     let babelConfig = require("uu_appg01_devkit/src/config/.babelrc.js")("development", processEnv);
     let exportsReader = new Es6ExportsReader(babelConfig);
     let testExports = exportsReader.getExportsFromFile("src/test/test-build.js");
     let typingsTest = new ExportsToTypings().serialize(testExports, "UU5.Test", "");
     let typings = fs.readFileSync("target/dist-root/index.d.ts", "utf-8");
     let modTypings = typings.replace(/namespace Test\s+\{\s*\}/, (m) => {
       let from = typingsTest.indexOf("namespace Test");
       let fromNewLine = typingsTest.lastIndexOf("\n", from);
       let whitespaces = typingsTest.substr(fromNewLine + 1, from - fromNewLine).match(/^\s*/)[0];
       let toMatch = typingsTest.substr(from).match(new RegExp("\\n" + whitespaces + "}"));
       let to = toMatch ? from + toMatch.index + toMatch[0].length : null;
       return to !== null
         ? typingsTest
             .substr(from, to - from)
             .trim()
             .replace(/(\r?\n)/g, "$1    ")
         : m;
     });
     fs.writeFileSync("target/dist-root/index.d.ts", modTypings, "utf-8");
   } catch (e) {
     let chalk;
     try {
       chalk = require("chalk");
     } catch (e) {} // eslint-disable-line
     console.warn(
       `  ${chalk ? chalk.yellow("WARN") : "WARN"} Failed - there'll be no Intellisense for UU5.Test.* APIs. Cause: ${
         e.message
       }`
     );
   }
 
   console.log("Copying files for color-schema.less.");
   await processColorSchemaFile("src", "target/dist", "src/color-schema.less");
 
   console.log("Copying jest-setup.js.");
   fs.copyFileSync("src/core/test/jest-setup.js", "target/dist-node/jest-setup.js");
   fs.copyFileSync("src/core/test/jest-setup.js", "target/dist/jest-setup.js"); // for backward compatibility
 
   // remove uu5g05 from externals (it must not be in .tgz's package.json)
   // NOTE We can't do this in prepackage step because that step gets executed sooner than prebuild step
   // (and prebuild needs to add uu5g05 to externals).
   console.log("Fixing externals for 'package' step.");
   let pkgJson = JSON.parse(fs.readFileSync("package.json", "utf-8"));
   delete pkgJson.uuBuildSettings.externals.uu5g05;
   fs.writeFileSync("package.json", JSON.stringify(pkgJson, null, 2) + "\n", "utf-8");
 }
 
 let processed = new Set();
 async function processColorSchemaFile(srcDir, destDir, fileRelative, fromFile = null) {
   let file = fileRelative.replace(/\\/g, "/"); // normalize to use forward slashes
   if (processed.has(file)) return;
   processed.add(file);
 
   // check existence
   if (!fs.existsSync(file)) {
     console.warn("File " + file + " does not exist - skipping.");
     return;
   }
 
   // copy the file
   // console.log("Copying " + file + " (used from " + fromFile + ")");
   let destFile = file.startsWith(srcDir + "/") ? destDir + "/" + file.substr(srcDir.length + 1) : file;
   fs.mkdirsSync(path.dirname(destFile));
   fs.copyFileSync(file, destFile);
 
   // copy & process any other @import-ed files
   let lessOpts = {
     filename: file,
   };
   let parseResult = await less.parse(fs.readFileSync(lessOpts.filename, "utf-8"), lessOpts);
   let importRules = parseResult.rules.filter((rule) => rule.importedFilename);
   let promises = importRules.map((rule) =>
     processColorSchemaFile(srcDir, destDir, rule.importedFilename, lessOpts.filename)
   );
   await Promise.all(promises);
 }
 
 function removeVersionConsoleLog(file) {
   let content = fs.readFileSync(file, "utf-8");
   let modContent = content.replace(
     /console\.log\((?:(?!console\.log)(?:\s|\S)){0,100}?Terms of Use: https:\/\/unicorn\.com\/[^;\n,}]+/,
     (m) => "void/*" + m + "*/0"
   );
   if (content === modContent) {
     console.warn("WARN Console log in uu5g05 was not replaced - console.log(...) not found in " + file);
   } else {
     fs.writeFileSync(file, modContent, "utf-8");
   }
 }
 function copyUu5g05() {
   // TODO (after uu_plus4u5g01 configures uu5g05 from standard CDN URL) Remove copying of uu5g05 & uu5stringg01, keep copying of uu5g05-browser-compatibility.
   let uu5g05Dir = require.resolve("uu5g05/package.json").replace(/[/\\][^/\\]*$/, "");
   fs.copySync(path.join(uu5g05Dir, "dist") + "/", "target/dist/uu5g05/", { overwrite: true, recursive: true });
 
   removeVersionConsoleLog("target/dist/uu5g05/uu5g05.js");
   removeVersionConsoleLog("target/dist/uu5g05/uu5g05.min.js");
 
   let bcFile1 = require.resolve("uu5g05-browser-compatibility/dist/uu5g05-browser-compatibility.min.js");
   fs.copyFileSync(bcFile1, "target/dist/uu5g04-browser-update.min.js");
   let bcFile2 = require.resolve("uu5g05-browser-compatibility/dist/uu5g05-browser-compatibility.js");
   fs.copyFileSync(bcFile2, "target/dist/uu5g04-browser-update.js");
 
   // copy uu5stringg01 too (uu5g05 depends on it)
   try {
     let uu5stringg01Dir = require
       .resolve("uu5stringg01/package.json", { paths: [uu5g05Dir] })
       .replace(/[/\\][^/\\]*$/, "");
     fs.copySync(path.join(uu5stringg01Dir, "dist") + "/", "target/dist/uu5stringg01/", {
       overwrite: true,
       recursive: true,
     });
   } catch (e) {
     if (e.code !== "MODULE_NOT_FOUND") throw e;
     // uu5stringg01 might not be present if uu5g05 is in older version (< 0.8.0) and that's ok
   }
 }
 
 copyUu5g05();
 if (!process.env.WATCH) run();
 