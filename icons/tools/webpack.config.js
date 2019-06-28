// uu5-library-1.7.0
var buildHelpers = require("./helpers.js");

var config = require("../config/config.js").getConfig();

// each "pack" in "config" must be built separately
var packs = config.packs || [config];
var webpackConfig = packs.reduce((result, pack) => {
  if (!pack) return result;

  var packConfig = Object.assign({}, config, pack);
  delete packConfig.packs;
  if (result.length === 0) packConfig.copyFiles = true; // use copy plugin only for 1st invocation so that it isn't invoked for each built JS file
  var packWebpackConfig = buildHelpers.getWebpackConfig(packConfig);
  return result.concat(packWebpackConfig);
}, []);

module.exports = webpackConfig;
