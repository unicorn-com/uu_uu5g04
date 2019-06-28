// uu5-library-1.7.0
const jestResolve = require("jest-resolve");
const fs = require("fs");

const config = require("../config/config.js").getConfig();
const aliases = config.aliases || {};

// https://facebook.github.io/jest/docs/en/configuration.html#resolver-string
module.exports = function(name, options) {
  // handle webpack aliases in source files of this library / app
  if (aliases[name] && !options.basedir.match(/node_modules/)) return aliases[name];

  // use identity-obj-proxy module for CSS & Less files (in case something is using CSS Modules)
  if (name.match(/\.(css|less)$/)) return require.resolve("identity-obj-proxy");

  // ignore image imports
  if (name.match(/\.(png|svg|gif|jpg|jpeg|ico)$/)) return require.resolve("empty/object");

  // fallback to default jest resolver
  let result = jestResolve.findNodeModule(name, options);

  // fallback to using resolved soft/hard links (jest resolver doesn't count
  // with them and they're used when using pnpm) and try jest resolver again
  if (!result) {
    options.basedir = toRealPath(options.basedir);
    options.paths = options.paths && options.paths.map(it => toRealPath(it));
    result = jestResolve.findNodeModule(name, options);
  }
  return result;
};

function toRealPath(pth) {
  if (fs.existsSync(pth)) return fs.realpathSync(pth);
  return pth;
}
