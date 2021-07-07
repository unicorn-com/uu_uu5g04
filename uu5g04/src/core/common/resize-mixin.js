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

import { PropTypes } from "uu5g05";

import Environment from "../environment/environment.js";
import Tools from "./tools.js";

export const ResizeMixin = {
  //@@viewOn:statics
  statics: {
    "UU5.Common.ResizeMixin": {
      requiredMixins: ["UU5.Common.BaseMixin"],
      defaults: {
        minResizeInterval: 100,
      },
    },
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    resizeInterval: PropTypes.number,
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      resizeInterval: undefined,
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  getInitialState() {
    // initialize
    this.registerMixin("UU5.Common.ResizeMixin");
    // state
    return {};
  },

  componentDidMount() {
    this._startResize();
  },

  componentDidUpdate(prevProps, prevState) {
    if (this.props.resizeInterval !== prevProps.resizeInterval) {
      this._resizeMixinInterval && Environment.TimeManager.clearInterval(this._resizeMixinInterval);
      this._startResize();
    }
  },

  componentWillUnmount() {
    this._resizeMixinInterval && Environment.TimeManager.clearInterval(this._resizeMixinInterval);
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  hasUU5CommonResizeMixin() {
    return this.hasMixin("UU5.Common.ResizeMixin");
  },

  getUU5CommonResizeMixinProps() {
    return {
      resizeInterval: this.props.resizeInterval,
    };
  },

  getUU5CommonResizeMixinPropsToPass() {
    return {};
  },
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  _startResize() {
    this._resizeWidth = 0;
    this._resizeHeight = 0;

    this._resizeMixinInterval = Environment.TimeManager.setInterval(() => {
      let domNode = this.findDOMNode();
      if (!domNode) return;
      let newWidth = Tools.getWidth(domNode);
      let oldWidth = this._resizeWidth;
      let newHeight = Tools.getHeight(domNode);
      let oldHeight = this._resizeHeight;

      if (oldWidth === newWidth && oldHeight === newHeight) {
        if (this._resizeStart) {
          this._resizeStart = false;
          if (typeof this.onResizeEnd_ === "function") {
            this.onResizeEnd_(oldWidth, newHeight);
          }
        }
      } else {
        this._resizeWidth = newWidth;
        this._resizeHeight = newHeight;

        if (!this._resizeStart) {
          this._resizeStart = true;
          if (typeof this.onResizeStart_ === "function") {
            this.onResizeStart_(newWidth, newHeight);
            return;
          }
        }

        // call too if onResizeStart_ is not set
        if (typeof this.onResize_ === "function") {
          this.onResize_(oldWidth, newWidth, oldHeight, newHeight);
        }
      }
    }, this._getResizeInterval());
  },

  _getResizeInterval() {
    let interval = Environment.resizeInterval;

    if (this.props.resizeInterval) {
      interval = this.props.resizeInterval;
    } else if (this.getOpt() && this.getOpt("resizeInterval")) {
      interval = this.getOpt("resizeInterval");
    }

    return Math.max(interval, this.getDefault("minResizeInterval", "UU5.Common.ResizeMixin"));
  },
  //@@viewOff:private
};

export default ResizeMixin;
