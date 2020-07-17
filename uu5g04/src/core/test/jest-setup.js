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

// override logging (don't log context with React components because the output is too long)
UU5.Common.Tools.warning = function(msg, context = {}) {
  console.warn(msg);
};
UU5.Common.Tools.error = function(msg, context = {}) {
  console.error(msg);
};

// override BaseMixin's showWarning and showError so that we can ignore
// specific errors / warnings during tests
let ignoredMessageKeys = {
  incorrectRequestedNestingLevel: true,
  nestingLevelMismatch: true,
  nestingLevelMismatchExplicitProp: true,
  childTagNotAllowed: true,
  childNotAllowed: true,
  noPropsGiven: true
};

let origShowWarning = UU5.Common.BaseMixin.showWarning;
UU5.Common.BaseMixin.showWarning = function(msgKey /* ... */) {
  if (ignoredMessageKeys[msgKey]) return;
  return origShowWarning.apply(this, arguments);
};

let origShowError = UU5.Common.BaseMixin.showError;
UU5.Common.BaseMixin.showError = function(msgKey /* ... */) {
  if (ignoredMessageKeys[msgKey]) return;
  return origShowError.apply(this, arguments);
};

// use enzyme-to-json as serializer (handles enzyme wrappers, e.g. expect(wrapper).toMatchSnapshot())
// NOTE This is required so that enzyme wrappers are converted to modifiable JSON.
const IGNORE_DEFAULT_PROPS = true;
expect.addSnapshotSerializer(require("enzyme-to-json").createSerializer({ ignoreDefaultProps: IGNORE_DEFAULT_PROPS }));

// add serializers from UU5.Test.Tools (serializing with comment & serializing into string)
expect.addSnapshotSerializer(new Tools.SnapshotCommentSerializer());
expect.addSnapshotSerializer(new Tools.SnapshotToStringSerializer());

// filter out "parent" props in snapshots (handles JSON, e.g. expect(enzymeToJson(wrapper)).toMatchSnapshot()
// as well as JSON from other serializers, such as enzyme-to-json)
let React;
function removeProps(val, props) {
  let newProps = {};
  for (let k of props) newProps[k] = undefined;
  let args = [val, newProps];
  if ("children" in val && !("children" in newProps)) args.push(val.children);
  val = (React = React || require("react")).cloneElement(...args);
  return val;
}
let processedSet = new WeakSet();
expect.addSnapshotSerializer({
  print: (val, serialize, ...rest) => {
    // remove "parent" / "id" props and default props
    if ("$$typeof" in val && val.props) {
      let propsToRemove = [];
      if ("parent" in val.props) propsToRemove.push("parent");
      if (typeof val.props.id === "string" && val.props.id.match(/^[0-9a-f]{32}(-|$)/)) propsToRemove.push("id");
      if (IGNORE_DEFAULT_PROPS && val.node && val.node.type) {
        let defaultProps = val.node.type.defaultProps;
        if (!defaultProps && typeof val.node.type.getDefaultProps === "function")
          defaultProps = val.node.type.getDefaultProps();
        if (defaultProps && typeof defaultProps === "object") {
          for (let k in defaultProps) {
            if (val.props[k] === defaultProps[k] && val.props[k] !== undefined) propsToRemove.push(k);
          }
        }
      }
      if (propsToRemove.length > 0) {
        val = removeProps(val, propsToRemove);
      }
    }

    // transform instances of UU5 components into JSON without functions and add tagName
    if (val.getUU5CommonBaseMixinProps) {
      let newVal = {
        tagName: (val.constructor || {}).tagName
      };
      Object.keys(val)
        .filter(k => typeof val[k] !== "function")
        .filter(k => k !== "updater") // React/enzyme field
        .forEach(k => (newVal[k] = val[k]));
      val = newVal;
    }

    processedSet.add(val);
    return serialize(val, ...rest);
  },

  test: val => {
    return (
      val &&
      typeof val === "object" &&
      (("$$typeof" in val && val.props) || val.getUU5CommonBaseMixinProps) && // React element or instance of UU5 component
      !processedSet.has(val)
    );
  }
});
