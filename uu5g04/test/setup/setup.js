// Jest setup when using uu5g05-test
const { Session } = require("uu5g05-test");
const UU5 = require("uu5g04");

UU5.Common.Tools.setLanguage(UU5.Environment.defaultLanguage); // re-set language as uu5g04 resets it to navigator.language during startup
UU5.Environment.version = "0.0.0";
require("./common-setup");

beforeEach(async () => {
  UU5.Environment.session = Session.instance;
});
afterEach(async () => {
  UU5.Environment.session = null;
  let { _events } = UU5.Environment.EventListener;
  if (_events) _events.delete(Session.instance);
});

// make legacy API (UU5.Test.Tools.wait, ...) available too
// TODO Maybe show warning that they should use `import { ... } from "uu5g05-test"` instead of accessing UU5.Test.xyz.
require("./uu5g04-test-api.js");
