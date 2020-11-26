// legacy API - UU5.Test.Tools.wait, ...
const UU5 = require("uu5g04");
const {
  Session,
  mount,
  shallow,
  act,
  wait,
  waitUntilCalled,
  waitUntilCalledTimes,
  waitWhile,
  renderHook,
  initHookRenderer,
  setInputValue,
  testProperty,
  testProperties,
} = require("uu5g05-test");
const MixinProps = require("./uu5g04-test-mixin-props.js");

const Tools = {
  mount,
  shallow,
  act,
  wait,
  waitUntilCalled,
  waitUntilCalledTimes,
  waitWhile,
  renderHook,
  initHookRenderer,
  setInputValue,
  testProperty,
  testProperties(Component, config) {
    testProperties(Component, config);

    if (config.mixins) {
      config.mixins.forEach((mixinName) => {
        let mixinProps = MixinProps[mixinName];
        if (mixinProps) {
          for (let propName in mixinProps) {
            if (propName in config.props) continue;
            let requiredProps = { ...config.requiredProps, ...mixinProps[propName].requiredProps };
            Tools.testProperty(Component, propName, mixinProps[propName].values, requiredProps, {
              ...config.opt,
              ...mixinProps[propName].opt,
            });
          }
        }
      });
    }
  },
};

Object.assign(UU5.Test, { Tools, Session });
module.exports = UU5.Test;
