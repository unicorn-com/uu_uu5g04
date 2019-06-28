const fs = require("fs");
const path = require("path");

module.exports = {
  hooks: {
    readPackage
  }
};

// handle "bad" packages that require() things that aren't in their package.json
// https://github.com/pnpm/pnpm/issues/949
// NOTE To apply changes added to this map: remove node_modules/, shrinkwrap.yaml and run "pnpm install" again.
const depFixes = {
  "jest-runner": {
    "jest-environment-jsdom": "23.4.0" // jest -> jest-cli -> jest-config -> jest-environment-jsdom
  },
  "@webassemblyjs/helper-module-context": {
    "debug": "from-other-deps" // copy from peerDependencies / devDependencies
  },
  "@webassemblyjs/wasm-parser": {
    "@webassemblyjs/utf8": "from-other-deps"
  },
  // mini-css-extract-plugin in "some" installations on Windows fails with
  // "Cannot destructure property `createHash` of 'undefined' or 'null'." when importing "webpack"
  // (as in https://github.com/webpack-contrib/mini-css-extract-plugin/issues/69) - add "webpack"
  // to its dependencies
  "mini-css-extract-plugin": {
    "webpack": "from-other-deps"
  },
  // "request-promise@4.x" uses "request" but has it only as peerDependency
  // (generating nodejs-app was failing in postinstall script in mongodb-memory-server@1.8.0)
  "request-promise-native": {
    "request": "from-other-deps"
  },
  "postcss-minify-params": {
    "browserslist": "from-other-deps"
  },
  "postcss-normalize-unicode": {
    "browserslist": "from-other-deps"
  }
};
let customNpmTag;
let useCustomNpmTag;
function readPackage(pkg) {
  // explicitly use tag from .npmrc for uu_* dependencies (pnpm otherwise ignores the setting)
  // but only for backend apps / libraries
  if (pkg.dependencies || pkg.devDependencies) {
    if (customNpmTag === undefined) {
      let projectPkg = require("./package.json");
      useCustomNpmTag = typeof projectPkg.spec === "string" && projectPkg.spec.match(/^(nodejs-|iso-)/);
      if (useCustomNpmTag) {
        customNpmTag = getTagFromNpmrc(".npmrc");
        if (customNpmTag === undefined) customNpmTag = getTagFromNpmrc(path.join(require("os").homedir(), ".npmrc"));
        useCustomNpmTag = !!customNpmTag;
      }
      if (customNpmTag === undefined) customNpmTag = null;
    }
    if (useCustomNpmTag) {
      setDependendciesTag(pkg.dependencies, customNpmTag);
      setDependendciesTag(pkg.devDependencies, customNpmTag);
    }
  }

  // fix missing dependency declarations
  if (pkg.name in depFixes) {
    for (let k in depFixes[pkg.name]) {
      let v = depFixes[pkg.name][k];
      if (v === "from-other-deps" && pkg.dependencies && pkg.dependencies[k]) continue;
      let version = (v !== "from-other-deps" ? v : (pkg.peerDependencies || {})[k] || (pkg.devDependencies || {})[k] || "*");
      if (version) {
        if (!pkg.dependencies) pkg.dependencies = {};
        pkg.dependencies[k] = version;
      }
    }
  }

  // Jest has dependency on "babel-core@^6.x.y || ^7.0.0-0", but it should be "^7.0.0-bridge" instead.
  if (pkg.name.match(/jest/)) {
    let babelCoreVersion = pkg.dependencies && pkg.dependencies["babel-core"]
    if (babelCoreVersion && babelCoreVersion.match(/7\.0\.0-0/)) {
      pkg.dependencies["babel-core"] = "^7.0.0-bridge";
    }
  }

  // hide peer dependency warnings from enzyme/react-hot-loader in nodejs-app project
  if (pkg.peerDependencies) {
    delete pkg.peerDependencies["react"];
    delete pkg.peerDependencies["react-dom"];
  }

  return pkg;
}

function getTagFromNpmrc(npmrcPath) {
  if (!fs.existsSync(npmrcPath)) return;
  let tag;
  let npmrc = fs.readFileSync(npmrcPath, "utf-8");
  npmrc.replace(/(?:^|\n)\s*tag\s*=\s*(\S+)/, (m, g) => (tag = g));
  return tag;
}
function setDependendciesTag(deps, tag) {
  if (!deps) return;
  for (let k in deps) {
    if (k.startsWith("uu_") && (typeof deps[k] !== "string" || !deps[k].startsWith("file:"))) {
      deps[k] = tag;
    }
  }
}
