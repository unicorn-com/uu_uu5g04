/**
 * Copyright (C) 2021 Unicorn a.s.
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public
 * License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later
 * version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License at
 * <https://gnu.org/licenses/> for more details.
 *
 * You may obtain additional information at <https://unicorn.com> or contact Unicorn a.s. at address: V Kapslovne 2767/2,
 * Praha 3, Czech Republic or at the email: info@unicorn.com.
 */

//@@viewOn:imports
import * as UU5 from "uu5g04";
import ns from "./bricks-ns.js";
import { ListContext, Context } from "./list-context.js";
import Css from "./internal/css.js";

import "./ul.less";
//@@viewOff:imports

export const typeIconMap = {
  disc: "mdi-circle",
  circle: "mdi-circle-outline",
  square: "mdi-square",
};

export const Ul = Context.withListContext(
  UU5.Common.VisualComponent.create({
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
        customMarker: ns.css("ul-custom-marker"),
        inline: Css.css(`
        list-style-type: none;
        padding:0;
        margin:0;

        &&& ul{
          display:inline-flex;
          width: auto;
          list-style:none;
          padding:0;
          margin:0;
          padding-left: 0px;
        };

        && > li{
          float:left;
          display:inline-flex;
          list-style:none;
          text-decoration:none;
          margin-left:0px;
          ::before{
            width:16px;
            padding:0px 12px;
            left: 0;
            position: initial;
          }
      `),
      },
      defaults: {
        childTagName: "UU5.Bricks.Li",
      },
    },
    //@@viewOff:statics

    //@@viewOn:propTypes
    propTypes: {
      allowTags: UU5.PropTypes.arrayOf(UU5.PropTypes.string),
      type: UU5.PropTypes.oneOf(["disc", "circle", "square", "none"]),
      markerIcon: UU5.PropTypes.string,
      iconColorSchema: UU5.PropTypes.string,
      listLevel: UU5.PropTypes.number, // received from context
    },
    //@@viewOff:propTypes

    //@@viewOn:getDefaultProps
    getDefaultProps() {
      return {
        allowTags: [],
        type: null,
        markerIcon: null,
        iconColorSchema: null,
        listLevel: 1,
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
            mixinName: "UU5.Common.BaseMixin",
          });
        else this.showError("childNotAllowed", [child, defaultChildTagName], { mixinName: "UU5.Common.BaseMixin" });
      }
      return result;
    },
    //@@viewOff:overriding

    //@@viewOn:private
    _getMarkerIcon() {
      if (this.props.markerIcon) {
        return this.props.markerIcon;
      } else if (this.props.type) {
        return typeIconMap[this.props.type];
      } else {
        return "mdi-default";
      }
    },

    _getContextValues() {
      return {
        ordered: false,
        markerIcon: this._getMarkerIcon(),
        type: this.props.type,
        iconColorSchema: this.props.iconColorSchema,
        listLevel: this.props.listLevel,
      };
    },

    _getMainAttrs(notInline) {
      const mainAttrs = this.getMainAttrs();
      mainAttrs.type = this.props.type;
      this.props.type && (mainAttrs.className += " " + this.getClassName("type") + this.props.type);
      this.props.markerIcon && (mainAttrs.className += " " + this.getClassName("customMarker"));
      !notInline && (mainAttrs.className += " " + this.getClassName("inline"));
      return mainAttrs;
    },
    //@@viewOff:private

    //@@viewOn:render
    render() {
      return (
        <ListContext.Provider value={this._getContextValues()}>
          <ul {...this._getMainAttrs(this.getNestingLevel())}>
            {this.getHeaderChild()}
            {this.getChildren()}
            {this.getFooterChild()}
            {this.getDisabledCover()}
          </ul>
        </ListContext.Provider>
      )
    },
    //@@viewOff:render
  })
);

export default Ul;
