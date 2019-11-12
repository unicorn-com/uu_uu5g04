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

import React from "react";
import PropTypes from "prop-types";

export const RouteMixin = {
  //@@viewOn:mixins
  mixins: [],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    "UU5.Common.RouteMixin": {
      requiredMixins: ["UU5.Common.BaseMixin"]
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    params: PropTypes.object
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      params: null
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  getInitialState() {
    // initialize
    this.registerMixin("UU5.Common.RouteMixin");

    return {};
  },

  componentDidMount() {
    if (typeof this.onRouteChanged_ === "function") {
      this.onRouteChanged_();
    }
  },

  componentDidUpdate(prevProps, prevState) {
    if (typeof this.onRouteChanged_ === "function") {
      this.onRouteChanged_(prevProps, prevState);
    }
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  hasUU5CommonRouteMixin: function() {
    return this.hasMixin("UU5.Common.RouteMixin");
  },

  getUU5CommonRouteMixinProps: function() {
    return {};
  },

  getUU5CommonRouteMixinPropsToPass: function() {
    return this.getUU5CommonRouteMixinProps();
  }
  //@@viewOff:interface
};

export default RouteMixin;
