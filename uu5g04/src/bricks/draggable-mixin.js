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

import * as UU5 from "uu5g04";
import ns from "./bricks-ns.js";

export const DraggableMixin = {
  //@@viewOn:statics
  statics: {
    UU5_Bricks_DraggableMixin: {
      requiredMixins: ["UU5.Common.BaseMixin"],
      classNames: {
        main: ns.css("draggable")
      }
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  getInitialState: function() {
    // initialize
    this.registerMixin("UU5_Bricks_DraggableMixin");
    return {};
  },

  componentWillUnmount: function() {
    UU5.Environment.EventListener.removeWindowEvent("mousemove", this.getId());
    UU5.Environment.EventListener.removeWindowEvent("touchmove", this.getId());
    UU5.Environment.EventListener.removeWindowEvent("mouseup", this.getId());
    UU5.Environment.EventListener.removeWindowEvent("touchend", this.getId());
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  hasUU5_Bricks_DraggableMixin: function() {
    return this.hasMixin("UU5_Bricks_DraggableMixin");
  },

  startDragging(draggedItem, x, y) {
    UU5.Environment.EventListener.addWindowEvent("mousemove", this.getId(), this._onMouseMove);
    UU5.Environment.EventListener.addWindowEvent("touchmove", this.getId(), this._onMouseMove);
    UU5.Environment.EventListener.addWindowEvent("mouseup", this.getId(), this.stopDragging);
    UU5.Environment.EventListener.addWindowEvent("touchend", this.getId(), this.stopDragging);

    this.draggedItem = draggedItem;
    this.x = x;
    this.startX = this.startX || x;
    this.y = y;
    this.startY = this.startY || y;
    this.width = UU5.Common.Tools.getWidth(this);
    this.height = UU5.Common.Tools.getHeight(this);
    this.itemMarginTop = this.getStylePropertyValue(this.draggedItem, "margin-top");
    this.itemMarginRight = this.getStylePropertyValue(this.draggedItem, "margin-right");
    this.itemMarginBottom = this.getStylePropertyValue(this.draggedItem, "margin-bottom");
    this.itemMarginLeft = this.getStylePropertyValue(this.draggedItem, "margin-left");
    return this;
  },

  dragStart: function(draggedItem, x, y) {
    // TODO: deprecated
    return this.startDragging(draggedItem, x, y);
  },

  stopDragging() {
    if (this.draggedItem) {
      UU5.Environment.EventListener.removeWindowEvent("mousemove", this.getId());
      UU5.Environment.EventListener.removeWindowEvent("touchmove", this.getId());
      UU5.Environment.EventListener.removeWindowEvent("mouseup", this.getId());
      UU5.Environment.EventListener.removeWindowEvent("touchend", this.getId());

      typeof this.draggedItem.moveEnd === "function" && this.draggedItem.moveEnd();
      this.draggedItem = null;
    }
    return this;
  },

  getXOffset: function() {
    return this.findDOMNode().offsetLeft;
  },

  getYOffset: function() {
    return this.findDOMNode().offsetTop;
  },

  getClientLeft: function() {
    return this.findDOMNode().clientLeft;
  },

  getClientTop: function() {
    return this.findDOMNode().clientTop;
  },

  getStylePropertyValue: function(object, property) {
    return this._getNumber(window.getComputedStyle(object.findDOMNode(), null).getPropertyValue(property));
  },

  getPaddingLeft: function() {
    return this.getStylePropertyValue(this, "padding-left");
  },

  getPaddingTop: function() {
    return this.getStylePropertyValue(this, "padding-top");
  },
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  _getNumber: function(value) {
    let match = value.match(/\d+/);
    return match ? Number(match[0]) : 0;
  },

  _onMouseMove: function(e) {
    e.preventDefault();
    if (this.draggedItem) {
      var posX = e.pageX || (e.touches && e.touches[0].pageX);
      var posY = e.pageY || (e.touches && e.touches[0].pageY);

      var x = posX - this.x;
      var y = posY - this.y;

      var itemDOMNode = this.draggedItem.findDOMNode();
      var itemOffsetLeft = itemDOMNode.offsetLeft;
      var itemOffsetTop = itemDOMNode.offsetTop;
      var itemOffsetWidth = itemDOMNode.offsetWidth;
      var itemOffsetHeight = itemDOMNode.offsetHeight;

      var parentX1 = this.getXOffset() + this.getClientLeft() + this.getPaddingLeft();
      var parentY1 = this.getYOffset() + this.getClientTop() + this.getPaddingTop();
      var itemX1 = itemOffsetLeft - this.itemMarginLeft;
      var itemY1 = itemOffsetTop - this.itemMarginTop;

      var parentX2 = this.width;
      var parentY2 = this.height;
      var itemX2 = itemOffsetLeft + itemOffsetWidth + this.itemMarginLeft + this.itemMarginRight;
      var itemY2 = itemOffsetTop + itemOffsetHeight + this.itemMarginTop + this.itemMarginBottom;

      if (itemX1 + x <= parentX1) {
        x = null;
      } else if (itemX2 + x - parentX1 - this.itemMarginLeft >= parentX2) {
        x = null;
      }

      if (itemY1 + y <= parentY1) {
        y = null;
      } else if (itemY2 + y - parentY1 - this.itemMarginTop >= parentY2) {
        y = null;
      }

      this.x = posX;
      this.y = posY;

      this.draggedItem.moveToPosition(x, y);
    }

    return this;
  }
  //@@viewOff:private
};

export default DraggableMixin;
