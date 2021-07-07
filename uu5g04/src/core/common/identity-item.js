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
import React from "react";
import { PropTypes } from "uu5g05";
import BaseMixin from "./base-mixin.js";
import ContentMixin from "./content-mixin.js";
import VisualComponent from "./visual-component.js";
//@@viewOff:imports

const IdentityItem = VisualComponent.create({
  displayName: "IdentityItem", // for backward compatibility (test snapshots)
  //@@viewOn:mixins
  mixins: [BaseMixin, ContentMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: "UU5.Common.Identity.Item",
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    pending: PropTypes.bool,
    authenticated: PropTypes.bool,
    notAuthenticated: PropTypes.bool,
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      pending: false,
      authenticated: false,
      notAuthenticated: false,
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
  render() {
    return this.getChildren();
  },
  //@@viewOff:render
});

export default IdentityItem;
