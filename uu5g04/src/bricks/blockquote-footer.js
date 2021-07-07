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
import Css from "./internal/css.js";

import "./blockquote-footer.less";
//@@viewOff:imports

export default UU5.Common.VisualComponent.create({
  displayName: "blockquote-footer", // for backward compatibility (test snapshots)
  //@@viewOn:mixins
  mixins: [
    UU5.Common.BaseMixin,
    UU5.Common.ElementaryMixin,
    UU5.Common.NestingLevelMixin,
    UU5.Common.ContentMixin,
    UU5.Common.PureRenderMixin,
  ],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("Blockquote.footer"),
    nestingLevelList: UU5.Environment.getNestingLevelList("bigBoxCollection", "box"),
    classNames: {
      main: ns.css("blockquote-footer"),
      right: ns.css("blockquote-footer-right"),
      left: ns.css("blockquote-footer-left"),
      inline: () => Css.css`
      padding-left: 8px;
      display: inline-block;
    `,
    },
    opt: {
      nestingLevelWrapper: true,
    },
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    alignment: UU5.PropTypes.oneOf(["left", "right"]),
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps: function () {
    return {
      alignment: "left",
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
  _buildMainAttrs: function (inline) {
    var mainAttrs = this.getMainAttrs();
    this.props.alignment === "right" && (mainAttrs.className += " " + this.getClassName().right);
    this.props.alignment === "left" && (mainAttrs.className += " " + this.getClassName().left);
    !inline && (mainAttrs.className += " " + this.getClassName("inline"));
    return mainAttrs;
  },
  //@@viewOff:private

  //@@viewOn:render
  render: function () {
    let nestingLevel = this.props.nestingLevel;
    return <footer {...this._buildMainAttrs()}>{this.getChildren(nestingLevel)}</footer>;
  },
  //@@viewOff:render
});
