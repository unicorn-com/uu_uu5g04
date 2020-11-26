//@@viewOn:imports
import React from "react";
import { PropTypes } from "uu5g05";
import BaseMixin from "./base-mixin";
import ElementaryMixin from "./elementary-mixin";
import ContentMixin from "./content-mixin";
import VisualComponent from "./visual-component.js";
import Element from "./element.js";
import { LevelContext, computeComponentLevel } from "../uu5g05-integration/use-level.js";
//@@viewOff:imports

export const Level = VisualComponent.create({
  displayName: "Level", // for backward compatibility (test snapshots)
  //@@viewOn:mixins
  mixins: [BaseMixin, ElementaryMixin, ContentMixin], // eslint-disable-line uu5/base-mixin
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: "UU5.Common.Level",
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    level: PropTypes.oneOf(["0", "1", "2", "3", "4", "5", "6", 0, 1, 2, 3, 4, 5, 6]),
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      level: undefined,
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  _getChildren(ctxValue) {
    let children;

    if (typeof this.props.children === "function") {
      children = this.props.children(ctxValue);
    } else {
      children = this.getChildren().map((child) => {
        let newChild = child;

        if (Element.isValid(child)) {
          newChild = Element.clone(child, ctxValue);
        }

        return newChild;
      });
    }

    return children;
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    return (
      <LevelContext.Consumer>
        {(context) => {
          let level = this.props.level != null ? +this.props.level : computeComponentLevel(context);
          const value = { ...context, level };
          delete value.isDummyLevel;
          return <LevelContext.Provider value={value}>{this._getChildren(value)}</LevelContext.Provider>;
        }}
      </LevelContext.Consumer>
    );
  },
  //@@viewOff:render
});

Level.Consumer = LevelContext.Consumer;
Level.Provider = LevelContext.Provider;
Level.Context = LevelContext;
Level.computeComponentLevel = computeComponentLevel;

export default Level;
