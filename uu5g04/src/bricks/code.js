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

import Factory from "./factory.js";

import "./code.less";
//@@viewOff:imports

const Code_ = Factory.createTag("code", "_code");

export const Code = UU5.Common.VisualComponent.create({
  displayName: "Code", // for backward compatibility (test snapshots)
  //@@viewOn:mixins
  mixins: [
    UU5.Common.BaseMixin,
    UU5.Common.ElementaryMixin,
    UU5.Common.ContentMixin,
    UU5.Common.NestingLevelMixin,
    UU5.Common.PureRenderMixin,
  ],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("Code"),
    nestingLevel: "inline",
    classNames: {
      main: ns.css("code"),
    },
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
  _getMainProps: function () {
    var mainProps = this.getMainPropsToPass();

    mainProps.id = this.getId() + "-code";
    mainProps.ignoreInnerHTML = true;
    mainProps.language = "code";

    return mainProps;
  },
  //@@viewOff:private

  //@@viewOn:render
  render: function () {
    return this.getNestingLevel() ? (
      <Code_ {...this._getMainProps()}>{this.props.children && UU5.Common.Children.toArray(this.props.children)}</Code_>
    ) : null;
  },
  //@@viewOff:render
});

export default Code;
