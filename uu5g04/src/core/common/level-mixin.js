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

import React from "react";
import { PropTypes } from "uu5g05";
import Level from "./level.js";
import { preprocessors, postprocessors } from "./component-processors.js";
import Environment from "../environment/environment.js";

export const LevelMixin = {
  //@@viewOn:statics
  statics: {
    "UU5.Common.LevelMixin": {
      requiredMixins: ["UU5.Common.BaseMixin"],
      defaults: {
        minLevel: 0,
        maxLevel: 6,
      },
      warnings: {
        levelMismatch: "Component level %s is lower than parent level %s.",
        levelMax: "Maximum level of component is 6 but is set %d.",
      },
    },
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    level: PropTypes.oneOf(["0", "1", "2", "3", "4", "5", "6", 0, 1, 2, 3, 4, 5, 6]),
    increaseLevel: PropTypes.bool,
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps: function () {
    return {
      level: null,
      increaseLevel: false,
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  getInitialState: function () {
    // initialize
    this.registerMixin("UU5.Common.LevelMixin");
    // state
    return {
      level: this.checkLevel(),
    };
  },

  UNSAFE_componentWillReceiveProps: function (nextProps) {
    this.getLevel() !== nextProps.level && this.setState({ level: this.checkLevel(nextProps) });
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  hasUU5CommonLevelMixin: function () {
    return this.hasMixin("UU5.Common.LevelMixin");
  },

  getLevel: function () {
    return this.state.level;
  },

  getUU5CommonLevelMixinProps: function () {
    return {
      level: this.props.level,
    };
  },

  getUU5CommonLevelMixinPropsToPass: function () {
    return this.getUU5CommonLevelMixinProps();
  },

  shouldIncreaseLevel: function (parentLevelComponent, props = this.props) {
    return this._shouldIncreaseLevel(parentLevelComponent, props, false);
  },

  checkLevel: function (props = this.props) {
    let { _parentLevelComponent, _parentLevel, _isDummyLevel } = props;
    var level = typeof props.level === "string" ? parseInt(props.level) : props.level;
    var maxLevel = this.getDefault("maxLevel", "UU5.Common.LevelMixin");
    var parentLevelComponent =
      _parentLevelComponent !== undefined ? _parentLevelComponent : this.getParentByType("hasUU5CommonLevelMixin");
    let isFromConsumer = _parentLevelComponent === null && _parentLevel != null; // for integration with UU5.Common.Level.Consumer & Provider
    var calculatedLevel =
      _parentLevel != null
        ? _parentLevel
        : parentLevelComponent
        ? parentLevelComponent.getLevel()
        : this.getDefault("minLevel", "UU5.Common.LevelMixin");
    if (!(isFromConsumer && _isDummyLevel)) {
      if (this._shouldIncreaseLevel(parentLevelComponent, props, isFromConsumer)) calculatedLevel++;
    }
    level = typeof level === "number" ? level : calculatedLevel;

    //check level hierarchy
    if (level < calculatedLevel) {
      this.showWarning("levelMismatch", [level, calculatedLevel], {
        mixinName: "UU5.Common.LevelMixin",
        context: {
          parent: {
            tagName: parentLevelComponent ? parentLevelComponent.getTagName() : null,
            component: parentLevelComponent,
          },
        },
      });
    }

    //check maxLevel
    if (level > maxLevel) {
      this.showWarning("levelMax", level, {
        mixinName: "UU5.Common.LevelMixin",
        context: {
          parent: {
            tagName: parentLevelComponent && parentLevelComponent.getTagName(),
            component: parentLevelComponent,
          },
        },
      });
      level = maxLevel;
    }

    return level;
  },
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  _shouldIncreaseLevel(parentLevelComponent, props, ignoreParent) {
    return !ignoreParent &&
      (!parentLevelComponent || (parentLevelComponent && parentLevelComponent.getOpt("dummyLevel")))
      ? false
      : this.getOpt("increaseLevel") ||
          props.increaseLevel ||
          (this.getHeader && this.getHeader(props)) ||
          (this.getFooter && this.getFooter(props));
  },

  _isUsingDummyLevel() {
    return this.getOpt("dummyLevel");
  },
  //@@viewOff:private
};

export const MIXINS_WITH_LEVEL_MIXIN = new Set([LevelMixin]);

preprocessors.push(function LevelMixinVCPreprocessor(componentDescriptor, ctx) {
  let { mixins } = componentDescriptor;
  if (Array.isArray(mixins)) {
    if (
      (process.env.NODE_ENV !== "test" || Environment._allowTestContext) && // disabled for tests because shallow rendering of components with LevelMixin would be useless (only wrapper with Level.Consumer would be visible)
      React.forwardRef
    ) {
      for (let i = 0; i < mixins.length; i++) {
        if (MIXINS_WITH_LEVEL_MIXIN.has(mixins[i])) {
          ctx["UU5.Common.LevelMixin"] = true;

          // change render() method to render Level Provider with level based on LevelMixin
          let origRender = componentDescriptor.render || function () {};
          componentDescriptor.render = function () {
            return (
              <LevelProvider level={this.state.level} isDummyLevel={this._isUsingDummyLevel()}>
                {origRender.apply(this)}
              </LevelProvider>
            );
          };
          break;
        }
      }
    }
  }
  return componentDescriptor;
});

postprocessors.push(function LevelMixinVCPostprocessor(Component, componentDescriptor, ctx) {
  if (ctx["UU5.Common.LevelMixin"]) {
    // wrap with level consumer
    let ResultComponent = React.forwardRef(function (props, ref) {
      return (
        <Level.Consumer>
          {({ level, isDummyLevel }) => {
            return (
              <Component
                {...props}
                ref={ref}
                _parentLevel={level}
                _parentLevelComponent={null}
                _isDummyLevel={isDummyLevel}
              />
            );
          }}
        </Level.Consumer>
      );
    });
    for (let k of Object.getOwnPropertyNames(Component)) {
      try {
        if (!(k in ResultComponent)) ResultComponent[k] = Component[k];
      } catch (e) {} // needed for IE for special properties like "caller"
    }
    ResultComponent.isUu5PureComponent = true;
    return ResultComponent;
  }
  return Component;
});

// helper component which does not re-render its subtree if level does not change
class LevelProvider extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { level: props.level, isDummyLevel: props.isDummyLevel };
  }
  static propTypes = {
    level: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    isDummyLevel: PropTypes.bool, // needed for interoperability with LevelMixin
  };
  static getDerivedStateFromProps(props, state) {
    return props.level !== state.level ? { level: props.level } : null;
  }
  render() {
    return <Level.Provider value={this.state}>{this.props.children}</Level.Provider>;
  }
}

export default LevelMixin;
