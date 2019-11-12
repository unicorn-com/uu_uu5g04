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

import PropTypes from "prop-types";

import Environment from "../environment/environment.js";
import Tools from "./tools.js";

export const ResizeMixin = {
  //@@viewOn:statics
  statics: {
    "UU5.Common.ResizeMixin": {
      requiredMixins: ["UU5.Common.BaseMixin"],
      defaults: {
        minResizeInterval: 100
      }
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    resizeInterval: PropTypes.number
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      resizeInterval: undefined
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
      resizeInterval: this.props.resizeInterval
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
  }
  //@@viewOff:private
};

export default ResizeMixin;
