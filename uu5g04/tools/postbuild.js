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

  console.log("Fixing ES6 & Node uu5g04 entry point.");
  // generate dist-esm/index.js file which merges exports from all UU5 modules
  // so that IntelliSense works as if all modules were loaded
  let packs = pkg.uuBuildSettings.packs;
  let mainFile = packs[0].entryPoints[0].replace(/\\/g, "/").replace(/^(\.[/\\])?/, "./"); // make it start with "./"
  let mainGlobalVariable = packs[0].libraryGlobalVariable;
  let modulesExports = packs.filter((pack, i) => i && !pack.minify && pack.libraryGlobalVariable).map(pack => ({
    // omit uu5g04 and minified packs
    filename: pack.entryPoints[0].replace(/\\/g, "/").replace(/^(\.[/\\])?/, "./"), // e.g. "uu5g04-forms.js" => "./uu5g04-forms.js"
    exportAs: pack.libraryGlobalVariable.substr(mainGlobalVariable.length + 1) // e.g. "UU5.Forms" => "Forms"
  }));
  fs.writeFileSync(
    "target/dist-esm/" + pkg.main.replace(/^[^/]*\//, "").replace(/(\.js)?$/, ".js"),
    `import UU5DefaultExport from "${mainFile}";
export default UU5DefaultExport;
export * from "${mainFile}";
${modulesExports.map(ex => `import * as ${ex.exportAs} from "${ex.filename}";`).join("\n")}
export {${modulesExports.map(ex => ex.exportAs).join(",")}};
`,
    "utf-8"
  );

  console.log("Fixing uu5g04-test build due to test/ folder devkit conflict.");
  fs.removeSync("src/test-tmp");
  fs.moveSync("target/dist-esm/test-tmp", "target/dist-esm/test");
  fs.moveSync("target/dist-node/test-tmp", "target/dist-node/test");

  // demo pages have issue when linking non-minified files containing ES6 import/export statements in multi-line comments
  // (SystemJS loader detects the syntax and tries to transpile the file which usually results in error, not sure why)
  // => detect multi-line comments and add "* " before import / exports there
  console.log("Removing ES6 import/export syntax inside comments.");
  for (let i = 0; i < packs.length; ++i) {
    let outputFile = packs[i].outputFile;
    if (outputFile && outputFile.endsWith(".js") && !outputFile.includes(".min.")) {
      let content = fs.readFileSync("target/dist/" + outputFile, "utf-8");
      // NOTE The regexp is not entirely correct, e.g. it mismatches "comments" in regexps
      // ('var regexp= /\/* import /;' - it'll think that a comment started on this line)
      // regexp matches:                 /* comment */       | "string"            | 'string'
      let modContent = content.replace(/\/\*((?:\s|\S)*?)\*\/|"([^"\\]|\\(\s|\S))*"|'([^'\\]|\\(\s|\S))*'/g, (m, content) => {
        if (!content) return m;
        return "/*" + content.replace(/(^|\n)[ \t]*(import\s|export\s)/g, (m, g1, g2) => g1 + "* " + g2) + "*/";
      });
      fs.writeFileSync("target/dist/" + outputFile, modContent, "utf-8");
    }
  }

  console.log("Copying files for color-schema.less");
  await processColorSchemaFile("src", "target/dist", "src/color-schema.less");

  console.log("Copying jest-setup.js");
  fs.copyFileSync("src/core/test/jest-setup.js", "target/dist-node/jest-setup.js");
  fs.copyFileSync("src/core/test/jest-setup.js", "target/dist/jest-setup.js"); // for backward compatibility
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
    filename: file
  };
  let parseResult = await less.parse(fs.readFileSync(lessOpts.filename, "utf-8"), lessOpts);
  let importRules = parseResult.rules.filter(rule => rule.importedFilename);
  let promises = importRules.map(rule =>
    processColorSchemaFile(srcDir, destDir, rule.importedFilename, lessOpts.filename)
  );
  await Promise.all(promises);
}

if (!process.env.WATCH) run();
