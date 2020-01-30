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
import React from "react";
import PropTypes from "prop-types";
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
    tagName: "UU5.Common.Identity.Item"
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    pending: PropTypes.bool,
    authenticated: PropTypes.bool,
    notAuthenticated: PropTypes.bool
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      pending: false,
      authenticated: false,
      notAuthenticated: false
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
  }
  //@@viewOff:render
});

export default IdentityItem;
