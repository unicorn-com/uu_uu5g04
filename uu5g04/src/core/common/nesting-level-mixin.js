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
import PropTypes from "prop-types";
import Environment from "../environment/environment.js";

export const NestingLevelMixin = {
  //@@viewOn:statics
  statics: {
    "UU5.Common.NestingLevelMixin": {
      requiredMixins: ["UU5.Common.BaseMixin"],
      defaults: {
        nestingLevel: "boxCollection"
      },
      errors: {
        incorrectRequestedNestingLevel:
          'Component %s was used with property nestingLevel="%s", but it supports only one of: %s.',
        nestingLevelMismatch:
          'Component %s with supported nesting levels %s cannot be nested into parent component %s which uses nesting level "%s". Component would have to support one of: %s.',
        nestingLevelMismatchExplicitProp:
          'Component %s has prop nestingLevel="%s" and as such it cannot be nested into parent component %s which uses nesting level "%s". Component needs to use one of: %s.',
        unsupportedNestingLevel: 'Nesting level "%s" is not a supported value. Use one of: %s.'
      }
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    nestingLevel: PropTypes.oneOf(Environment.nestingLevelList)
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps: function() {
    return {
      nestingLevel: null
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  getInitialState: function() {
    // initialize
    this.registerMixin("UU5.Common.NestingLevelMixin");
    // state
    return {
      nestingLevel: this.checkNestingLevel()
    };
  },

  componentWillReceiveProps: function(nextProps) {
    this.getNestingLevel() !== nextProps.nestingLevel &&
      this.setState({ nestingLevel: this.checkNestingLevel(nextProps) });
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  hasUU5CommonNestingLevelMixin: function() {
    return this.hasMixin("UU5.Common.NestingLevelMixin");
  },

  getNestingLevel: function() {
    return this.state.nestingLevel;
  },

  getUU5CommonNestingLevelMixinProps: function() {
    return {
      nestingLevel: this.props.nestingLevel
    };
  },

  getUU5CommonNestingLevelMixinPropsToPass: function() {
    return this.getUU5CommonNestingLevelMixinProps();
  },

  getParentNestingLevel: function(parentNestingLevelComponent) {
    let component = parentNestingLevelComponent || this.getParentByType("hasUU5CommonNestingLevelMixin");
    return component ? component.getNestingLevel() : Environment.nestingLevelList[0];
  },

  getNestingLevelList: function() {
    return (
      (this.constructor.nestingLevel && [this.constructor.nestingLevel]) ||
      this.constructor.nestingLevelList ||
      Environment.nestingLevelList
    );
  },

  checkNestingLevel: function(props = this.props) {
    //step 1 - check prop nestingLevel
    let nestingLevelEnvIndex = Environment.nestingLevelList.indexOf(props.nestingLevel);
    let nestingLevel = nestingLevelEnvIndex > -1 ? props.nestingLevel : null;
    //console.log("step 1 requestedNestingLevel:",nestingLevel);

    //step 2 - check nestingLevelList
    let nestingLevelList = this.getNestingLevelList();
    //console.log("step 2 requestedNestingLevel:",nestingLevel,"nestingLevelList:",nestingLevelList,"parent::",parentNestingLevelComponent);

    if (props.nestingLevel && nestingLevelEnvIndex === -1) {
      this.showError("unsupportedNestingLevel", [props.nestingLevel, JSON.stringify(nestingLevelList)], {
        mixinName: "UU5.Common.NestingLevelMixin"
      });
    }

    //step 3 - check requested nestingLevel with build in nestingLevelList
    if (nestingLevel) {
      nestingLevelEnvIndex = Environment.nestingLevelList.indexOf(nestingLevel);

      //because ie11 dont know .find()
      let nestingLevelLocIndex;
      if (typeof nestingLevelList.find === "function") {
        nestingLevelLocIndex = nestingLevelList.indexOf(
          nestingLevelList.find(nestingLevel => {
            return Environment.nestingLevelList.indexOf(nestingLevel) >= nestingLevelEnvIndex;
          })
        );
      } else {
        for (let i = 0; i < nestingLevelList.lenght; i++) {
          let level = nestingLevelList[i];
          if (Environment.nestingLevelList.indexOf(level) >= nestingLevelEnvIndex) {
            nestingLevelLocIndex = nestingLevelList.indexOf(level);
          }
        }
      }

      nestingLevelList = nestingLevelLocIndex > -1 ? nestingLevelList.slice(nestingLevelLocIndex) : nestingLevelList;
    }

    //check nestingLevel rule incorrectRequestedNestingLevel
    if (
      Environment.nestingLevelList.indexOf(nestingLevel) >
      Environment.nestingLevelList.indexOf(nestingLevelList[nestingLevelList.length - 1])
    ) {
      this.showError(
        "incorrectRequestedNestingLevel",
        [this.getTagName(), nestingLevel, JSON.stringify(nestingLevelList)],
        {
          mixinName: "UU5.Common.NestingLevelMixin",
          context: {
            nestingLevelList: nestingLevelList
          }
        }
      );
      nestingLevelList = [];
    }

    //console.log("step 3 requestedNestingLevel:",nestingLevel,"requestedNestingLevelList:",nestingLevelList);

    //step 4 - build calculatedNestingLevelList from nestingLevel parent if exist
    let calculatedNestingLevelIndex = 0;
    let calculatedNestingLevelList = Environment.nestingLevelList;
    let parentNestingLevel = calculatedNestingLevelList[calculatedNestingLevelIndex];
    let parentNestingLevelComponent;
    if (!this.getOpt("nestingLevelRoot")) {
      parentNestingLevelComponent = this.getParentByType("hasUU5CommonNestingLevelMixin");
      parentNestingLevel = this.getParentNestingLevel(parentNestingLevelComponent);
      //console.log("step 4a",parentNestingLevel);
      calculatedNestingLevelIndex = Environment.nestingLevelList.indexOf(parentNestingLevel);
      if (
        parentNestingLevelComponent &&
        !parentNestingLevelComponent.getOpt("nestingLevelWrapper") &&
        parentNestingLevel.search(/Collection$/) === -1
      ) {
        calculatedNestingLevelIndex = Math.min(
          Environment.nestingLevelList.length - 1,
          calculatedNestingLevelIndex + 1
        );
      }
      calculatedNestingLevelList = Environment.nestingLevelList.slice(calculatedNestingLevelIndex);
    }

    //console.log("step 4",calculatedNestingLevelList);

    //step 5 - find the lowest requested nestingLevel as possible if is not requested or is not requested correctly
    if (!nestingLevel) {
      //because ie11 dont know .find()
      if (typeof nestingLevelList.find === "function") {
        nestingLevel = nestingLevelList.find(nestingLevel => {
          return Environment.nestingLevelList.indexOf(nestingLevel) >= calculatedNestingLevelIndex;
        });
      } else {
        for (let i = 0; i < nestingLevelList.length; i++) {
          let level = nestingLevelList[i];
          if (Environment.nestingLevelList.indexOf(level) >= calculatedNestingLevelIndex) {
            nestingLevel = level;
            break;
          }
        }
      }

      nestingLevelEnvIndex = Environment.nestingLevelList.indexOf(nestingLevel);
      //console.log("step 5",nestingLevel)
    }

    //check nestingLevel rule nestingLevelMismatch
    if (nestingLevelEnvIndex < calculatedNestingLevelIndex) {
      if (props.nestingLevel) {
        this.showError(
          "nestingLevelMismatchExplicitProp",
          [
            this.getTagName(),
            props.nestingLevel,
            parentNestingLevelComponent.getTagName(),
            parentNestingLevel,
            JSON.stringify(calculatedNestingLevelList)
          ],
          {
            mixinName: "UU5.Common.NestingLevelMixin",
            context: {
              parent: {
                tagName: parentNestingLevelComponent.getTagName(),
                component: parentNestingLevelComponent
              }
            }
          }
        );
      } else {
        this.showError(
          "nestingLevelMismatch",
          [
            this.getTagName(),
            JSON.stringify(nestingLevelList),
            parentNestingLevelComponent.getTagName(),
            parentNestingLevel,
            JSON.stringify(calculatedNestingLevelList)
          ],
          {
            mixinName: "UU5.Common.NestingLevelMixin",
            context: {
              parent: {
                tagName: parentNestingLevelComponent.getTagName(),
                component: parentNestingLevelComponent
              }
            }
          }
        );
      }
    }

    //step 6 - find the lowest nestingLevel as possible for render into parent

    //because ie11 dont know .find()
    if (typeof nestingLevelList.find === "function") {
      nestingLevel = nestingLevelList.find(nestingLevel => {
        return calculatedNestingLevelList.indexOf(nestingLevel) > -1;
      });
    } else {
      for (let i = 0; i < nestingLevelList.length; i++) {
        let level = nestingLevelList[i];
        if (calculatedNestingLevelList.indexOf(level) > -1) {
          nestingLevel = level;
          break;
        }
      }
    }

    //console.log("step 6",this.getTagName(),nestingLevel || null);

    return nestingLevel || null;
  }
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  //@@viewOff:private
};

export default NestingLevelMixin;
