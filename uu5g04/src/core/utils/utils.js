const Uu5g05 = require("uu5g05");

const exportsInitedOnFirstAccess = {
  Clipboard: () => Uu5g05.Utils,
  EventManager: () => Uu5g05.Utils,
  Uu5Loader: () => Uu5g05.Utils,
  ColorSchema: () => require("./color-schema.js"),
  Content: () => require("./content.js"),
  LoggerFactory: () => require("./logger-factory.js"),
  Lsi: () => require("./lsi.js"),
  NestingLevel: () => require("./nesting-level.js"),
  ScreenSize: () => require("./screen-size.js"),
  Session: () => require("./session.js"),
};

module.exports = {};

const propDescriptors = {};
for (let k in exportsInitedOnFirstAccess) {
  let ex;
  propDescriptors[k] = {
    get: () => {
      if (ex === undefined) ex = exportsInitedOnFirstAccess[k]()?.[k];
      return ex;
    },
    enumerable: true,
  };
}
Object.defineProperties(module.exports, propDescriptors);
