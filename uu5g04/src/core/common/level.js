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
  _getChildren(level) {
    let children;

    if (typeof this.props.children === "function") {
      children = this.props.children({ level });
    } else {
      children = this._getChildren().map(child => {
        let newChild = child;

        if (React.isValidElement(child)) {
          newChild = React.cloneElement(child, { level });
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
          return <Ctx.Provider value={{ level }}>{this._getChildren(level)}</Ctx.Provider>;
        }}
      </Ctx.Consumer>
    );
  }
  //@@viewOff:render
});

function computeComponentLevel(contextValue) {
  let level;
  if (contextValue.level == null) level = 0;
  else level = contextValue.level + (contextValue.isDummyLevel ? 0 : 1); // NOTE isDummyLevel is legacy flag from LevelMixin (for backward compatibility). Level component doesn't send it in Provider as it doesn't do "dummy" levels (it always increases the level).
  return level;
}

Level.Consumer = Ctx.Consumer;
Level.Provider = Ctx.Provider;
Level.Context = Ctx;
Level.computeComponentLevel = computeComponentLevel;

export default Level;
