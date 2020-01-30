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

//@@viewOn:imports
import * as UU5 from "uu5g04";
import ns from "./bricks-ns.js";
import ListContext from "./list-context.js";

import "./ul.less";
//@@viewOff:imports

const typeIconMap = {
  disc: "mdi-circle",
  circle: "mdi-circle-outline",
  square: "mdi-square"
};

export const Ul = UU5.Common.VisualComponent.create({
  displayName: "Ul", // for backward compatibility (test snapshots)

  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin, UU5.Common.ElementaryMixin, UU5.Common.SectionMixin, UU5.Common.NestingLevelMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("Ul"),
    nestingLevelList: UU5.Environment.getNestingLevelList("bigBoxCollection", "box"),
    classNames: {
      main: ns.css("ul"),
      type: ns.css("ul-type-"),
      customMarker: ns.css("ul-custom-marker")
    },
    defaults: {
      childTagName: "UU5.Bricks.Li"
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    allowTags: UU5.PropTypes.arrayOf(UU5.PropTypes.string),
    type: UU5.PropTypes.oneOf(["disc", "circle", "square", "none"]),
    markerIcon: UU5.PropTypes.string,
    iconColorSchema: UU5.PropTypes.string
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      allowTags: [],
      type: null,
      icon: null,
      markerIcon: null,
      iconColorSchema: null
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  shouldComponentUpdate(nextProps, nextState) {
    return this.shouldRender(nextProps, nextState);
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:overriding
  shouldChildRender_(child) {
    let childTagName = UU5.Common.Tools.getChildTagName(child);
    let defaultChildTagName = this.getDefault().childTagName;
    let childTagNames = this.props.allowTags.concat(defaultChildTagName);
    let result = childTagNames.indexOf(childTagName) > -1;
    if (!result && (typeof child !== "string" || child.trim())) {
      if (childTagName)
        this.showError("childTagNotAllowed", [childTagName, this.getTagName(), childTagName, defaultChildTagName], {
          mixinName: "UU5.Common.BaseMixin"
        });
      else this.showError("childNotAllowed", [child, defaultChildTagName], { mixinName: "UU5.Common.BaseMixin" });
    }
    return result;
  },

  expandChildProps_(child, i) {
    let newChildProps = { ...child.props };

    if (!newChildProps.markerIcon) {
      if (this.props.markerIcon) {
        newChildProps.markerIcon = this.props.markerIcon;
      } else if (this.props.type) {
        newChildProps.markerIcon = typeIconMap[this.props.type];
      } else {
        newChildProps.markerIcon = "mdi-default";
      }
    }
    if (!newChildProps.iconColorSchema) {
      if (this.props.iconColorSchema) {
        newChildProps.iconColorSchema = this.props.iconColorSchema;
      }
    }
    return newChildProps;
  },
  //@@viewOff:overriding

  //@@viewOn:private
  _getMainAttrs() {
    const mainAttrs = this.getMainAttrs();
    mainAttrs.type = this.props.type;
    this.props.type && (mainAttrs.className += " " + this.getClassName("type") + this.props.type);
    this.props.markerIcon && (mainAttrs.className += " " + this.getClassName("customMarker"));
    return mainAttrs;
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    return this.getNestingLevel() ? (
      <ListContext.Provider value={{ tagName: this.getTagName() }}>
        <ul {...this._getMainAttrs()}>
          {this.getHeaderChild()}
          {this.getChildren()}
          {this.getFooterChild()}
          {this.getDisabledCover()}
        </ul>
      </ListContext.Provider>
    ) : null;
  }
  //@@viewOff:render
});

export default Ul;
