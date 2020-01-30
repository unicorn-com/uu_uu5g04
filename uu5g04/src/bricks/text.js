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

import "./text.less";
//@@viewOff:imports

export const Text = UU5.Common.VisualComponent.create({
  displayName: "Text", // for backward compatibility (test snapshots)
  //@@viewOn:mixins
  mixins: [
    UU5.Common.BaseMixin,
    UU5.Common.PureRenderMixin,
    UU5.Common.ElementaryMixin,
    UU5.Common.NestingLevelMixin,
    UU5.Common.ContentMixin,
    UU5.Common.ColorSchemaMixin
  ],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("Text"),
    nestingLevelList: UU5.Environment.getNestingLevelList("smallBox", "inline"),
    classNames: {
      main: ns.css("text uu5-common-text"),
      nestingLevelSmallBox: ns.css("text-nesting-level-small-box"),
      nestingLevelInline: ns.css("text-nesting-level-inline")
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  _getMainAttrs: function() {
    let attrs = this.getMainAttrs();

    switch (this.getNestingLevel()) {
      case "inline":
        attrs.className += " " + this.getClassName().nestingLevelInline;
        break;
      default:
        attrs.className += " " + this.getClassName().nestingLevelSmallBox;
    }

    return attrs;
  },
  //@@viewOff:private

  //@@viewOn:render
  render: function() {
    let component;
    switch (this.getNestingLevel()) {
      case "smallBox":
        component = (
          <div {...this._getMainAttrs()}>
            {this.getChildren()}
            {this.getDisabledCover()}
          </div>
        );
        break;
      case "inline":
        component = (
          <span {...this._getMainAttrs()}>
            {this.getChildren()}
            {this.getDisabledCover()}
          </span>
        );
        break;
      default:
        component = null;
    }

    return component;
  }
  //@@viewOff:render
});

export default Text;
