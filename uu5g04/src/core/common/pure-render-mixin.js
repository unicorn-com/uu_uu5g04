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

import React from "react";
import { PropTypes } from "uu5g05";

export const PureRenderMixin = {
  //@@viewOn:statics
  statics: {
    "UU5.Common.PureRenderMixin": {
      requiredMixins: ["UU5.Common.BaseMixin"],
    },
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    pureRender: PropTypes.bool,
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      pureRender: false,
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  getInitialState() {
    // initialize
    this.registerMixin("UU5.Common.PureRenderMixin");
    // state
    return {};
  },

  shouldComponentUpdate(nextProps, nextState) {
    let shouldUpdate;
    if (!this.props.pureRender && !this.getOpt("pureRender")) {
      shouldUpdate = true;
    } else if (typeof this.shouldComponentUpdate_ === "function") {
      shouldUpdate = this.shouldComponentUpdate_(nextProps, nextState);
    } else {
      shouldUpdate = this.shouldComponentUpdateDefault(nextProps, nextState);
    }
    return shouldUpdate;
  },

  shouldComponentUpdateDefault(nextProps, nextState) {
    return this.shouldRender(nextProps, nextState);
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  hasUU5CommonPureRenderMixin() {
    return this.hasMixin("UU5.Common.PureRenderMixin");
  },

  getUU5CommonPureRenderMixinProps() {
    return {
      pureRender: this.props.pureRender,
    };
  },

  getUU5CommonPureRenderMixinPropsToPass() {
    return this.getUU5CommonPureRenderMixinProps();
  },
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  //@@viewOff:private
};

export default PureRenderMixin;
