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
import ns from "./common-ns.js";
import BaseMixin from "./base-mixin.js";
import ElementaryMixin from "./elementary-mixin.js";
import ContentMixin from "./content-mixin.js";
import NestingLevelMixin from "./nesting-level-mixin.js";
import Environment from "../environment/environment.js";
import PureRenderMixin from "./pure-render-mixin";
import VisualComponent from "./visual-component.js";
import Element from "./element.js";

import "./div.less";
//@@viewOff:imports

export const Div = VisualComponent.create({
  displayName: "Div", // for backward compatibility (test snapshots)
  //@@viewOn:mixins
  mixins: [BaseMixin, ElementaryMixin, ContentMixin, NestingLevelMixin, PureRenderMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("Div"),
    classNames: {
      main: ns.css("div"),
    },
    nestingLevelList: Environment.getNestingLevelList("bigBoxCollection", "smallBox"),
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
  //@@viewOff:private

  //@@viewOn:render
  render: function () {
    return this.getNestingLevel()
      ? Element.create("div", this.getMainAttrs(), this.getChildren(), this.getDisabledCover())
      : Element.create("span", this.getMainAttrs(), this.getChildren(), this.getDisabledCover());
  },
  //@@viewOff:render
});

export default Div;
