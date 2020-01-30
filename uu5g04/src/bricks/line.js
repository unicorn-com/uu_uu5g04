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

import "./line.less";
//@@viewOff:imports

export const Line = UU5.Common.VisualComponent.create({
  displayName: "Line", // for backward compatibility (test snapshots)
  //@@viewOn:mixins
  mixins: [
    UU5.Common.BaseMixin,
    UU5.Common.PureRenderMixin,
    UU5.Common.ElementaryMixin,
    UU5.Common.ColorSchemaMixin,
    UU5.Common.NestingLevelMixin
  ],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("Line"),
    nestingLevel: "smallBox",
    classNames: {
      main: ns.css("line uu5-common-bg"),
      size: ns.css("line-size-"),
      vertical: ns.css("line-vertical")
    },
    defaults: {
      sizes: ["s", "m", "l", "xl"]
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    size: UU5.PropTypes.oneOfType([UU5.PropTypes.string, UU5.PropTypes.number]),
    borderRadius: UU5.PropTypes.string,
    vertical: UU5.PropTypes.bool
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      size: "m",
      borderRadius: null,
      vertical: false
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
  _buildMainAttrs() {
    let mainAttrs = this.getMainAttrs();
    let size = this.props.size;
    if (this.props.vertical) {
      mainAttrs.className += " " + this.getClassName("vertical");
    }

    if (this.getDefault().sizes.includes(size)) {
      mainAttrs.className += " " + this.getClassName().size + size;
    } else {
      if (typeof size === "number") {
        size = size + "px";
      }
      mainAttrs.style = { ...mainAttrs.style, ...(this.props.vertical ? { width: size } : { height: size }) };
    }

    if (this.props.borderRadius) {
      mainAttrs.style = { ...mainAttrs.style, ...{ borderRadius: this.props.borderRadius } };
    }
    return mainAttrs;
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    return this.getNestingLevel() ? <div {...this._buildMainAttrs()}>{this.getDisabledCover()}</div> : null;
  }
  //@@viewOff:render
});

export default Line;
