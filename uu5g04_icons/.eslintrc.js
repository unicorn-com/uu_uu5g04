const path = require("path");

let config = {
  extends: ["./" + path.relative(__dirname, require.resolve("uu_appg01_devkit/src/config/.eslintrc.js", { paths: [__dirname] })).replace(/\\/g, "/")],
};

module.exports = config;
