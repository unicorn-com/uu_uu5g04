// setup that is common regardless of whether the developed library is or is not using uu5g05-test
// (obviously, cannot do require("uu5g05-test") here)
const UU5 = require("uu5g04");

// override logging (don't log context with React components because the output is too long)
UU5.Common.Tools.warning = function (msg, context) {
  let args = [msg];
  if (arguments.length > 1 && (typeof context !== "object" || context instanceof Error)) args.push(context);
  console.warn(...args);
};
UU5.Common.Tools.error = function (msg, context) {
  let args = [msg];
  if (arguments.length > 1 && (typeof context !== "object" || context instanceof Error)) args.push(context);
  console.error(...args);
};

// override BaseMixin's showWarning and showError so that we can ignore
// specific errors / warnings during tests
let ignoredMessageKeys = {
  incorrectRequestedNestingLevel: true,
  nestingLevelMismatch: true,
  nestingLevelMismatchExplicitProp: true,
  childTagNotAllowed: true,
  childNotAllowed: true,
  noPropsGiven: true,
};

let origShowWarning = UU5.Common.BaseMixin.showWarning;
UU5.Common.BaseMixin.showWarning = function (msgKey /* ... */) {
  if (ignoredMessageKeys[msgKey]) return;
  return origShowWarning.apply(this, arguments);
};

let origShowError = UU5.Common.BaseMixin.showError;
UU5.Common.BaseMixin.showError = function (msgKey /* ... */) {
  if (ignoredMessageKeys[msgKey]) return;
  return origShowError.apply(this, arguments);
};

// filter out "parent" props in snapshots (handles JSON, e.g. expect(enzymeToJson(wrapper)).toMatchSnapshot()
// as well as JSON from other serializers, such as enzyme-to-json)
const IGNORE_DEFAULT_PROPS = true;
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
        tagName: (val.constructor || {}).tagName,
      };
      Object.keys(val)
        .filter((k) => typeof val[k] !== "function")
        .filter((k) => k !== "updater") // React/enzyme field
        .forEach((k) => (newVal[k] = val[k]));
      val = newVal;
    }

    processedSet.add(val);
    return serialize(val, ...rest);
  },

  test: (val) => {
    return (
      val &&
      typeof val === "object" &&
      (("$$typeof" in val && val.props) || val.getUU5CommonBaseMixinProps) && // React element or instance of UU5 component
      !processedSet.has(val)
    );
  },
});

// for legacy purposes, if the current project doesn't know about uu_plus4u5g02 then mock it
// so that it loads from inside of uu_plus4u5g01 to be backward compatible;
//    uu_plus4u5g02 => uu_plus4u5g01/dist/uu_plus4u5g02/uu_plus4u5g02.js
// TODO Should be in uu_plus4u5g01 but devkit doesn't support custom test setups (at least not ones that
// are loaded automatically) so until then we'll configure it here.
function makeFallbackToInternal(name, internalBasedIn) {
  let actual;
  jest.doMock(
    name,
    () => {
      if (actual === undefined) {
        try {
          actual = jest.requireActual(name);
        } catch (e) {
          if (e.code !== "MODULE_NOT_FOUND") throw e;
          let basedInPath = require.resolve(internalBasedIn);
          let usedPath = basedInPath.replace(
            new RegExp("^(.*" + internalBasedIn + ")([/\\\\]).*$"),
            (m, g1, sep) => g1 + sep + "dist" + sep + name + sep + name + ".js"
          );
          const path = require("path");
          actual = require("./" + path.relative(__dirname, usedPath).replace(/\\/g, "/"));
        }
      }
      return actual;
    },
    { virtual: true }
  );
}
makeFallbackToInternal("uu_plus4u5g02", "uu_plus4u5g01");
