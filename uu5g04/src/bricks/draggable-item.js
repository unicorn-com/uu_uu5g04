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
import * as UU5 from "uu5g04";
import ns from "./bricks-ns.js";

import DraggableMixin from "./draggable-mixin.js";

import "./draggable-item.less";
//@@viewOff:imports

export const DraggableItem = UU5.Common.VisualComponent.create({
  displayName: "DraggableItem", // for backward compatibility (test snapshots)
  //@@viewOn:mixins
  mixins: [
    UU5.Common.BaseMixin,
    UU5.Common.ElementaryMixin,
    UU5.Common.ContentMixin,
    UU5.Common.NestingLevelMixin,
    UU5.Common.PureRenderMixin,
  ],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("DraggableItem"),
    nestingLevelList: UU5.Environment.getNestingLevelList("bigBoxCollection", "box"),
    classNames: {
      main: ns.css("draggable-item"),
    },
    errors: {
      invalidParentType: "Parrent of the component does not have DraggableMixin.",
    },
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    x: UU5.PropTypes.number,
    y: UU5.PropTypes.number,
    onMoveStart: UU5.PropTypes.func,
    onMove: UU5.PropTypes.func,
    onMoveEnd: UU5.PropTypes.func,
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      x: 0,
      y: 0,
      onMoveStart: null,
      onMove: null,
      onMoveEnd: null,
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  getInitialState() {
    return {
      x: this.props.x,
      y: this.props.y,
    };
  },

  UNSAFE_componentWillMount() {
    this.draggableParent = this.getParentByType("hasUU5_Bricks_DraggableMixin");
    return this;
  },

  componentDidMount() {
    if (this.draggableParent) {
      this.setState((state) => {
        return {
          x:
            state.x +
            this.draggableParent.getXOffset() +
            this.draggableParent.getClientLeft() +
            this.draggableParent.getPaddingLeft(),
          y:
            state.y +
            this.draggableParent.getYOffset() +
            this.draggableParent.getClientTop() +
            this.draggableParent.getPaddingTop(),
        };
      });
    } else {
      this.showError("invalidParentType");
    }
    return this;
  },

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.controlled) {
      this.setState({
        x: nextProps.x,
        y: nextProps.y,
      });
    }
    return this;
  },

  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  moveToPosition(x, y) {
    if (x || y) {
      let opt = { component: this, x: x, y: y };
      if (typeof this.props.onMove === "function") {
        this.props.onMove(opt);
      } else {
        this.onMoveDefault(opt);
      }
    }
    return this;
  },

  setPosition(x, y, setStateCallback) {
    x = isNaN(x) ? 0 : x;
    y = isNaN(y) ? 0 : y;
    this.setState((state) => {
      return {
        x: x + state.x,
        y: y + state.y,
      };
    }, setStateCallback);
    return this;
  },

  stopDragging() {
    this.draggableParent && this.draggableParent.stopDragging();
    return this;
  },

  moveEnd() {
    typeof this.props.onMoveEnd === "function" && this.props.onMoveEnd();
    return this;
  },

  onMoveDefault(opt) {
    this.setPosition(opt.x, opt.y);

    return this;
  },
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  _onMouseDown(e) {
    var onStart;
    if (typeof this.props.onMoveStart === "function") {
      onStart = this.props.onMoveStart();
    }
    if (onStart !== false) {
      var x = e.pageX || e.touches[0].pageX;
      var y = e.pageY || e.touches[0].pageY;

      this.draggableParent.startDragging(this, x, y);
    }

    return this;
  },
  //@@viewOff:private

  // Render

  //@@viewOn:render
  render() {
    return this.getNestingLevel() ? (
      <div
        {...this.getMainAttrs()}
        onMouseDown={this._onMouseDown}
        onTouchStart={this._onMouseDown}
        style={{
          left: this.state.x,
          top: this.state.y,
        }}
      >
        <UU5.Bricks.Div parent={this} content={this.props.content} pureRender>
          {this.props.children}
        </UU5.Bricks.Div>
        {this.getDisabledCover()}
      </div>
    ) : null;
  },
  //@@viewOff:render
});

export default DraggableItem;
