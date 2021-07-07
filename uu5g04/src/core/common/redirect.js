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
import { PropTypes } from "uu5g05";
import BaseMixin from "./base-mixin.js";
import VisualComponent from "./visual-component.js";
import Url from "./url.js";
import Tools from "./tools.js";
//@@viewOff:imports

export const Redirect = VisualComponent.create({
  displayName: "Redirect", // for backward compatibility (test snapshots)
  //@@viewOn:mixins
  mixins: [BaseMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("Redirect"),
    classNames: {
      main: ns.css("redirect"),
    },
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    uri: PropTypes.string,
    target: PropTypes.oneOf(["_blank", "_parent", "_top", "_self"]),
  },
  //@@viewOff:propTypes
  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      uri: undefined,
      target: "_self",
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  componentDidMount() {
    if (this.props.uri) {
      Tools.openWindow(Url.getAbsoluteUri(this.props.uri), this.props.target || "_self");
    }
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  //@@viewOff:private

  //@@viewOn:render
  render() {
    return null;
  },
  //@@viewOff:render
});

export default Redirect;
