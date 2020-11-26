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
try {
  require("uu5g05");
} catch (e) {
  if (e.code !== "MODULE_NOT_FOUND") throw e;
  jest.doMock("uu5g05", () => require("../dist/uu5g05/uu5g05.js"), { virtual: true });
}
const UU5 = require("uu5g04");

// import test tools & mocks
// NOTE Importing mocks from other libraries must be done in Jest setup files if they need to be unmock-able.
// If it was directly in test file:
//   import UU5 from "uu5g04";
//   import "uu5g04-test"; // <-- here is mock
//   import Library from "uu_libraryg01";
//   ...
//   jest.unmock("uu_appg01");
// then using jest.unmock() wouldn't work because babel-jest moves it upwards, ending with:
//   jest.unmock("uu_appg01");
//   var UU5 = require("uu5g04");
//   require("uu5g04-test");
//   var Library = require("uu_libraryg01");
// i.e. unmock would be called sooner than the mock was defined.
const { Tools } = require("uu5g04-test");

// set language to "en", timezone to Europe/Prague (requires NodeJS >= 13.x to have effect)
UU5.Common.Tools.setLanguage("en");
if (!process.env.TZ) process.env.TZ = "Europe/Prague";

// use enzyme-to-json as serializer (handles enzyme wrappers, e.g. expect(wrapper).toMatchSnapshot())
// NOTE This is required so that enzyme wrappers are converted to modifiable JSON.
const IGNORE_DEFAULT_PROPS = true;
expect.addSnapshotSerializer(require("enzyme-to-json").createSerializer({ ignoreDefaultProps: IGNORE_DEFAULT_PROPS }));

// add serializers from UU5.Test.Tools (serializing with comment & serializing into string)
expect.addSnapshotSerializer(new Tools.SnapshotCommentSerializer());
expect.addSnapshotSerializer(new Tools.SnapshotToStringSerializer());

// NOTE :-/ This file is copied as-is to .tgz/dist-node/jest-setup.js
// where there is also .tgz/test/setup/* files - that's why the path seems mismatched.
require("../test/setup/common-setup.js");
