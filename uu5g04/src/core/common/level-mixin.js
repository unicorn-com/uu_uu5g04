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

import React from 'react';
import PropTypes from 'prop-types';

export const LevelMixin = {

  //@@viewOn:statics
  statics: {
    "UU5.Common.LevelMixin": {
      requiredMixins: ["UU5.Common.BaseMixin"],
      defaults: {
        minLevel: 0,
        maxLevel: 6
      },
      warnings: {
        levelMismatch: 'Component level %s is lower than parent level %s.',
        levelMax: 'Maximum level of component is 6 but is set %d.'
      }
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    level: PropTypes.oneOf(['0', '1', '2', '3', '4', '5', '6', 0, 1, 2, 3, 4, 5, 6])
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps: function () {
    return {
      level: null
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:standardComponentLifeCycle
  getInitialState: function () {
    // initialize
    this.registerMixin("UU5.Common.LevelMixin");
    // state
    return {
      level: this.checkLevel()
    };
  },

  componentWillReceiveProps: function (nextProps) {
    this.getLevel() !== nextProps.level && this.setState({ level: this.checkLevel(nextProps) });
  },
  //@@viewOff:standardComponentLifeCycle

  //@@viewOn:interface
  hasUU5CommonLevelMixin: function () {
    return this.hasMixin("UU5.Common.LevelMixin");
  },

  getLevel: function () {
    return this.state.level;
  },

  getUU5CommonLevelMixinProps: function () {
    return {
      level: this.props.level
    };
  },

  getUU5CommonLevelMixinPropsToPass: function () {
    return this.getUU5CommonLevelMixinProps();
  },

  shouldIncreaseLevel: function (parentLevelComponent, props = this.props) {
    return !parentLevelComponent || parentLevelComponent && parentLevelComponent.getOpt('dummyLevel')
      ? false
      : (
      this.getOpt('increaseLevel') ||
      this.getHeader && this.getHeader(props) ||
      this.getFooter && this.getFooter(props)
    );
  },

  checkLevel: function (props = this.props) {
    var level = typeof props.level === 'string' ? parseInt(props.level) : props.level;
    var maxLevel = this.getDefault('maxLevel', "UU5.Common.LevelMixin");
    var parentLevelComponent = this.getParentByType('hasUU5CommonLevelMixin');
    var calculatedLevel = parentLevelComponent ? parentLevelComponent.getLevel() : this.getDefault('minLevel', "UU5.Common.LevelMixin");
    this.shouldIncreaseLevel(parentLevelComponent, props) && calculatedLevel++;
    level = typeof level === "number" ? level : calculatedLevel;

    //check level hierarchy
    if (level < calculatedLevel) {
      this.showWarning(
        'levelMismatch', [level, calculatedLevel], {
          mixinName: "UU5.Common.LevelMixin",
          context: {
            parent: {
              tagName: parentLevelComponent ? parentLevelComponent.getTagName() : null,
              component: parentLevelComponent
            }
          }
        }
      );
    }

    //check maxLevel
    if (level > maxLevel) {
      this.showWarning(
        'levelMax', level, {
          mixinName: "UU5.Common.LevelMixin",
          context: {
            parent: {
              tagName: parentLevelComponent && parentLevelComponent.getTagName(),
              component: parentLevelComponent
            }
          }
        }
      );
      level = maxLevel;
    }
    return level;
  }
  //@@viewOff:interface

  //@@viewOn:overridingMethods
  //@@viewOff:overridingMethods

  //@@viewOn:componentSpecificHelpers
  //@@viewOff:componentSpecificHelpers

};

export default LevelMixin;
