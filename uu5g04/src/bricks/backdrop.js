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

import "./backdrop.less";
//@@viewOff:imports

export const Backdrop = UU5.Common.VisualComponent.create({
  displayName: "Backdrop", // for backward compatibility (test snapshots)
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin, UU5.Common.ElementaryMixin, UU5.Common.NestingLevelMixin, UU5.Common.PureRenderMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("Backdrop"),
    nestingLevelList: UU5.Environment.getNestingLevelList("bigBoxCollection", "smallBox"),
    classNames: {
      main: ns.css("backdrop"),
      background: ns.css("backdrop-background"),
    },
    opt: {
      nestingLevelWrapper: true,
    },
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    onClick: UU5.PropTypes.func,
    onMouseOver: UU5.PropTypes.func,
    background: UU5.PropTypes.bool,
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps: function () {
    return {
      onClick: null,
      onMouseOver: null,
      background: false,
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
  //@@viewOff:private

  //@@viewOn:render
  render: function () {
    var mainAttrs = this.getMainAttrs();
    mainAttrs.id = this.getId();
    if (typeof this.props.onClick === "function") {
      mainAttrs.onClick = (e) => this.props.onClick(this, e);
    }
    if (typeof this.props.onMouseOver === "function") {
      mainAttrs.onMouseOver = (e) => this.props.onMouseOver(this, e);
    }
    if (this.props.background) {
      mainAttrs.className += " " + this.getClassName("background");
    }

    return this.getNestingLevel() ? <div {...mainAttrs}>{this.getDisabledCover()}</div> : null;
  },
  //@@viewOff:render
});

export default Backdrop;
