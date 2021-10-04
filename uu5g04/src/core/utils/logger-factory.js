const { Utils } = require("uu5g05");
const { LoggerFactory } = Utils;
module.exports = LoggerFactory ? { LoggerFactory } : require("./_mock-logger-factory.js");
