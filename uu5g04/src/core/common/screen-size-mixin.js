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
import Tools from "./tools.js";

export const ScreenSizeMixin = {
  //@@viewOn:statics
  statics: {
    "UU5.Common.ScreenSizeMixin": {
      requiredMixins: ["UU5.Common.BaseMixin"],
      defaults: {
        screenSizeEvent: "UU5_Common_screenSize"
      }
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  getInitialState() {
    // initialize
    this.registerMixin("UU5.Common.ScreenSizeMixin");
    // state
    return {
      screenSize: this.getScreenSize()
    };
  },

  componentDidMount() {
    window.UU5.Environment.EventListener.registerScreenSize(this.getId(), this._onChangeScreenSize);
  },

  componentWillUnmount() {
    window.UU5.Environment.EventListener.unregisterScreenSize(this.getId(), this._onChangeScreenSize);
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  hasUU5CommonScreenSizeMixinProps() {
    return this.hasMixin("UU5.Common.ScreenSizeMixin");
  },

  getUU5CommonScreenSizeMixinProps() {
    return {
      screenSize: this.getScreenSize()
    };
  },

  getUU5CommonScreenSizeMixinPropsToPass() {
    return this.getUU5CommonScreenSizeMixinProps();
  },

  getScreenSize() {
    return (this.state && this.state.screenSize) || Tools.getScreenSize();
  },

  isXs() {
    return this.getScreenSize() === "xs";
  },

  isS() {
    return this.getScreenSize() === "s";
  },

  isM() {
    return this.getScreenSize() === "m";
  },

  isL() {
    return this.getScreenSize() === "l";
  },

  isXl() {
    return this.getScreenSize() === "xl";
  },

  onChangeScreenSizeDefault(e, actualScreenSize) {
    this.setState({ screenSize: actualScreenSize });
    return this;
  },
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  _onChangeScreenSize(e, actualScreenSize) {
    if (typeof this.onChangeScreenSize_ === "function") {
      this.onChangeScreenSize_(actualScreenSize, e);
    } else {
      this.onChangeScreenSizeDefault(e, actualScreenSize);
    }
    return this;
  }
  //@@viewOff:private
};

export default ScreenSizeMixin;
