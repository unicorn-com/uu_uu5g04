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
import Tools from "./tools.js";

export const SwipeMixin = {
  //@@viewOn:statics
  statics: {
    "UU5.Common.SwipeMixin": {
      requiredMixins: ["UU5.Common.BaseMixin"],
      defaults: {
        maxLengthOnShortSwipe: 70,
        minLengthOnSwipe: 10,
        maxSpeedOnSlowSwipe: 0.3,
        maxAngleDivergence: 10
      }
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  // React lifecycle
  propTypes: {
    swiped: PropTypes.oneOf(["up", "right", "down", "left", "upRight", "downRight", "upLeft", "downLeft"]),
    // null is not false - null is not swiped
    swipedLong: PropTypes.bool,
    swipedFast: PropTypes.bool
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps: function() {
    return {
      swiped: null, // up|right|down|left|upRight|downRight|upLeft|downLeft
      swipedLong: null, // true|false
      swipedFast: null // true|false
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  getInitialState: function() {
    // initialize
    this.registerMixin("UU5.Common.SwipeMixin");
    this.lastSwipe = {
      x: 0,
      y: 0,
      dx: 0,
      dy: 0,
      ex: 0,
      ey: 0,
      left: false,
      right: false,
      up: false,
      down: false,
      long: this.props.swipedLong,
      fast: this.props.swipedFast,
      length: 0,
      speed: 0,
      startTime: null,
      endTime: null,
      angle: 0
    };
    // state
    return null;
  },

  componentWillMount: function() {
    this.props.swiped && (this.lastSwipe = this._getUpdatedSwipe(this.props));
  },

  componentWillReceiveProps: function(nextProps) {
    nextProps.swiped && (this.lastSwipe = this._getUpdatedSwipe(nextProps));
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  hasUU5CommonSwipeMixin: function() {
    return this.hasMixin("UU5.Common.SwipeMixin");
  },

  getUU5CommonSwipeMixinProps: function() {
    return {
      swiped: this.props.swiped,
      swipedLong: this.props.swipedLong,
      swipedFast: this.props.swipedFast
    };
  },

  getUU5CommonSwipeMixinPropsToPass: function() {
    return this.getUU5CommonSwipeMixinProps();
  },

  getSwipeLength: function() {
    var dx = this.lastSwipe.dx;
    var dy = this.lastSwipe.dy;
    return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
  },

  getAngle: function() {
    return this.lastSwipe.angle;
  },

  isSwipedHorizontal: function() {
    return (
      Math.abs(this.getAngle()) <= this.getDefault("maxAngleDivergence", "UU5.Common.SwipeMixin") ||
      Math.abs(this.getAngle()) >= 180 - this.getDefault("maxLengthOnShortSwipe", "UU5.Common.SwipeMixin")
    );
  },

  isSwipedVertical: function() {
    return (
      Math.abs(this.getAngle()) <= 90 + this.getDefault("maxLengthOnShortSwipe", "UU5.Common.SwipeMixin") &&
      Math.abs(this.getAngle()) >= 90 - this.getDefault("maxLengthOnShortSwipe", "UU5.Common.SwipeMixin")
    );
  },

  isSwiped: function() {
    return this.isSwipedUp() || this.isSwipedRight() || this.isSwipedDown() || this.isSwipedLeft();
  },

  isSwipedShort: function() {
    return this.lastSwipe.long !== null && !this.lastSwipe.long;
  },

  isSwipedLong: function() {
    return this.lastSwipe.long !== null && this.lastSwipe.long;
  },

  isSwipedSlow: function() {
    return this.lastSwipe.fast !== null && !this.lastSwipe.fast;
  },

  isSwipedFast: function() {
    return this.lastSwipe.fast !== null && this.lastSwipe.fast;
  },

  isSwipedUp: function() {
    return this.lastSwipe.up && this.isSwipedVertical();
  },

  isSwipedRight: function() {
    return this.lastSwipe.right && this.isSwipedHorizontal();
  },

  isSwipedDown: function() {
    return this.lastSwipe.down && this.isSwipedVertical();
  },

  isSwipedLeft: function() {
    return this.lastSwipe.left && this.isSwipedHorizontal();
  },

  // Two directions
  isSwipedUpRight: function() {
    return this.lastSwipe.up && this.lastSwipe.right;
  },

  isSwipedDownRight: function() {
    return this.lastSwipe.down && this.lastSwipe.right;
  },

  isSwipedUpLeft: function() {
    return this.lastSwipe.up && this.lastSwipe.left;
  },

  isSwipedDownLeft: function() {
    return this.lastSwipe.down && this.lastSwipe.left;
  },

  // Short
  isSwipedUpShort: function() {
    return this.isSwipedUp() && this.isSwipedShort();
  },

  isSwipedRightShort: function() {
    return this.isSwipedRight() && this.isSwipedShort();
  },

  isSwipedDownShort: function() {
    return this.isSwipedDown() && this.isSwipedShort();
  },

  isSwipedLeftShort: function() {
    return this.isSwipedLeft() && this.isSwipedShort();
  },

  isSwipedUpRightShort: function() {
    return this.isSwipedUpRight() && this.isSwipedShort();
  },

  isSwipedDownRightShort: function() {
    return this.isSwipedDownRight() && this.isSwipedShort();
  },

  isSwipedUpLeftShort: function() {
    return this.isSwipedUpLeft() && this.isSwipedShort();
  },

  isSwipedDownLeftShort: function() {
    return this.isSwipedDownLeft() && this.isSwipedShort();
  },

  // Long
  isSwipedUpLong: function() {
    return this.isSwipedUp() && this.isSwipedLong();
  },

  isSwipedRightLong: function() {
    return this.isSwipedRight() && this.isSwipedLong();
  },

  isSwipedDownLong: function() {
    return this.isSwipedDown() && this.isSwipedLong();
  },

  isSwipedLeftLong: function() {
    return this.isSwipedLeft() && this.isSwipedLong();
  },

  isSwipedUpRightLong: function() {
    return this.isSwipedUpRight() && this.isSwipedLong();
  },

  isSwipedDownRightLong: function() {
    return this.isSwipedDownRight() && this.isSwipedLong();
  },

  isSwipedUpLeftLong: function() {
    return this.isSwipedUpLeft() && this.isSwipedLong();
  },

  isSwipedDownLeftLong: function() {
    return this.isSwipedDownLeft() && this.isSwipedLong();
  },

  swipeOnTouchStart: function(handler, e) {
    if (typeof handler === "object") {
      e = handler;
      handler = null;
    }
    e = e || handler;
    this.lastSwipe = Tools.merge({}, this.lastSwipe, {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
      dx: 0,
      dy: 0,
      length: 0,
      speed: null,
      startTime: new Date().getTime()
    });
    typeof handler === "function" && handler(arguments);
    return this;
  },

  swipeOnTouchMove: function(handler, e) {
    if (typeof handler === "object") {
      e = handler;
      handler = null;
    }
    e = e || handler;
    // e.preventDefault();
    this.lastSwipe = Tools.merge({}, this.lastSwipe, {
      dx: e.touches[0].clientX - this.lastSwipe.x,
      dy: e.touches[0].clientY - this.lastSwipe.y,
      ex: e.touches[0].clientX,
      ey: e.touches[0].clientY,
      endTime: new Date().getTime()
    });

    (this.isSwipedLeft() || this.isSwipedRight()) && e.preventDefault();

    typeof handler === "function" && handler(e);
    return this;
  },

  swipeOnTouchEnd: function(handler, e) {
    if (typeof handler === "object") {
      e = handler;
      handler = null;
    }
    e = e || handler;
    var length = this.getSwipeLength();

    if (length > this.getDefault("maxLengthOnShortSwipe", "UU5.Common.SwipeMixin")) {
      var duration = this.lastSwipe.endTime - this.lastSwipe.startTime;
      var speed = length / duration;

      this.lastSwipe = Tools.merge({}, this.lastSwipe, {
        left: this.lastSwipe.dx < -this.getDefault("minLengthOnSwipe", "UU5.Common.SwipeMixin"),
        right: this.lastSwipe.dx > this.getDefault("minLengthOnSwipe", "UU5.Common.SwipeMixin"),
        down:
          this.lastSwipe.dy > -this.getDefault("minLengthOnSwipe", "UU5.Common.SwipeMixin") && this.lastSwipe.dy > 0,
        up: this.lastSwipe.dy < this.getDefault("minLengthOnSwipe", "UU5.Common.SwipeMixin") && this.lastSwipe.dy < 0,
        long: length > this.getDefault("maxLengthOnShortSwipe", "UU5.Common.SwipeMixin"),
        fast: speed > this.getDefault("maxLengthOnShortSwipe", "UU5.Common.SwipeMixin"),
        length: length,
        speed: length / duration,
        angle: this.angle(this.lastSwipe.x, this.lastSwipe.y, this.lastSwipe.ex, this.lastSwipe.ey)
      });

      typeof handler === "function" && handler(arguments);
    }
    return this;
  },

  angle: function(x, y, ex, ey) {
    var dy = y - ey;
    var dx = ex - x;
    var theta = Math.atan2(dy, dx);
    theta *= 180 / Math.PI;
    //if (theta < 0) theta = 360 + theta;
    return theta;
  },
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  _getUpdatedSwipe: function(props) {
    return {
      up: props.swiped === "up" || props.swiped === "upRight" || props.swiped === "upLeft",
      right: props.swiped === "right" || props.swiped === "upRight" || props.swiped === "downRight",
      down: props.swiped === "down" || props.swiped === "downRight" || props.swiped === "downLeft",
      left: props.swiped === "left" || props.swiped === "upLeft" || props.swiped === "downLeft",
      long: props.swipedLong,
      fast: props.swipedFast
    };
  }
  //@@viewOff:private
};

export default SwipeMixin;
