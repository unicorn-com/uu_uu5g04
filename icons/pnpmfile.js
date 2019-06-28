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
    "jest-environment-jsdom": "21.2.1" // jest -> jest-cli -> jest-config -> jest-environment-jsdom
  }
};
function readPackage(pkg) {
  if (pkg.name in depFixes) {
    pkg.dependencies = Object.assign(pkg.dependencies || {}, depFixes[pkg.name]);
  }
  return pkg;
}
