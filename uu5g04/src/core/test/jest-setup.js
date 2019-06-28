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
expect.addSnapshotSerializer(require("enzyme-to-json").createSerializer());

// filter out "parent" props in snapshots (handles JSON, e.g. expect(enzymeToJson(wrapper)).toMatchSnapshot()
// as well as JSON from other serializers, such as enzyme-to-json)
let React;
function removeProp(val, propName) {
  if (Object.isFrozen(val.props)) {
    let args = [val, { [propName]: undefined }];
    if ("children" in val) args.push(val.children);
    val = (React = React || require("react")).cloneElement(...args);
  } else {
    delete val.props[propName];
  }
  return val;
}
let processedSet = new WeakSet();
expect.addSnapshotSerializer({
  print: (val, serialize, ...rest) => {
    // remove "parent" / "id" prop
    if ("$$typeof" in val && val.props) {
      if ("parent" in val.props) val = removeProp(val, "parent");
      if (val.props.id && val.props.id.match(/^[0-9a-f]{32}(-|$)/)) val = removeProp(val, "id");
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
