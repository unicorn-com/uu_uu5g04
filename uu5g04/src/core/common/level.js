//@@viewOn:imports
import React from "react";
import PropTypes from "prop-types";
import BaseMixin from "./base-mixin";
import ElementaryMixin from "./elementary-mixin";
import ContentMixin from "./content-mixin";
import Context from "./context.js";
import VisualComponent from "./visual-component.js";
//@@viewOff:imports

const Ctx = Context.create({ level: null });

export const Level = VisualComponent.create({
  displayName: "Level", // for backward compatibility (test snapshots)
  //@@viewOn:mixins
  mixins: [BaseMixin, ElementaryMixin, ContentMixin], // eslint-disable-line uu5/base-mixin
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: "UU5.Common.Level"
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    level: PropTypes.oneOf(["0", "1", "2", "3", "4", "5", "6", 0, 1, 2, 3, 4, 5, 6])
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      level: undefined
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
      children = this.getChildren().map(child => {
        let newChild = child;

        if (React.isValidElement(child)) {
          newChild = React.cloneElement(child, ctxValue);
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
      <Ctx.Consumer>
        {context => {
          let level = this.props.level != null ? +this.props.level : computeComponentLevel(context);
          const value = { ...context, level };
          delete value.isDummyLevel;
          return <Ctx.Provider value={value}>{this._getChildren(value)}</Ctx.Provider>;
        }}
      </Ctx.Consumer>
    );
  }
  //@@viewOff:render
});

function computeComponentLevel(contextValue, skipIncrease = false) {
  let level;
  if (contextValue.level == null) {
    level = skipIncrease ? null : 0;
  } else {
    level = contextValue.level + (contextValue.isDummyLevel ? 0 : 1) + (skipIncrease ? -1 : 0);
  } // NOTE isDummyLevel is legacy flag from LevelMixin (for backward compatibility). Level component doesn't send it in Provider as it doesn't do "dummy" levels (it always increases the level).
  return level;
}

Level.Consumer = Ctx.Consumer;
Level.Provider = Ctx.Provider;
Level.Context = Ctx;
Level.computeComponentLevel = computeComponentLevel;

export default Level;
