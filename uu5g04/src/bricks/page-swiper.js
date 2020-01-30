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
import * as UU5 from "uu5g04";
import ns from "./bricks-ns.js";
//@@viewOff:imports

const PageSwiper = UU5.Common.VisualComponent.create({
  displayName: "PageSwiper", // for backward compatibility (test snapshots)
  //@@viewOn:mixins
  mixins: [
    UU5.Common.BaseMixin,
    UU5.Common.PureRenderMixin,
    UU5.Common.ElementaryMixin,
    UU5.Common.ContentMixin,
    UU5.Common.SwipeMixin,
    UU5.Common.NestingLevelMixin
  ],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("PageSwiper"),
    nestingLevelList: UU5.Environment.getNestingLevelList("bigBoxCollection", "box"),
    classNames: {
      main: ns.css("page-swiper")
    },
    defaults: {
      swipePositionLimit: 8
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    leftSwipe: UU5.PropTypes.oneOfType([UU5.PropTypes.bool, UU5.PropTypes.number]),
    rightSwipe: UU5.PropTypes.oneOfType([UU5.PropTypes.bool, UU5.PropTypes.number])
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      leftSwipe: false,
      rightSwipe: false
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  componentDidMount() {
    this._allowLeftMenuAction = false;
    this._allowRightMenuAction = false;
    this._allowLeftMenuClose = false;
    this._allowRightMenuClose = false;
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  _getSwipePositionLimit(right) {
    let propValue = this.props[right ? "rightSwipe" : "leftSwipe"];
    let result = typeof propValue === "number" ? propValue : this.getDefault().swipePositionLimit;
    return result;
  },

  _getEventPath(e) {
    let path = [];
    let node = e.target;
    while (node != document.body) {
      path.push(node);
      node = node.parentNode;
    }
    return path;
  },

  _onSwipeStart() {
    let e = arguments[0][1].nativeEvent;
    let touchPosX = e.changedTouches[0].clientX;
    let columnAlwaysShown;
    let leftColumn = UU5.Environment.page.getLeft();
    let leftColumnNode = leftColumn && leftColumn.findDOMNode();
    let rightColumn = UU5.Environment.page.getRight();
    let rightColumnNode = leftColumn && rightColumn.findDOMNode();

    let result = {
      input: e.target instanceof HTMLInputElement,
      leftColumn: false,
      rightColumn: false,
      otherSwiper: false
    };
    let eventPath = this._getEventPath(e);
    eventPath.every(item => {
      let functionType = item.matches ? "matches" : "msMatchesSelector";
      if (leftColumnNode && item === leftColumnNode) {
        result.leftColumn = true;
      }

      if (rightColumnNode && item === rightColumnNode) {
        result.rightColumn = true;
      }

      if (item[functionType]) {
        if (item[functionType]("uu5-bricks-swiper")) {
          result.otherSwiper = true;
        }
        return true;
      } else {
        return false;
      }
    });

    if (!result.input && !result.otherSwiper) {
      if (this.props.leftSwipe) {
        columnAlwaysShown =
          leftColumn && leftColumn.props.minWidth && leftColumn.props.maxWidth && !leftColumn.props.block;
        if (columnAlwaysShown) {
          if (result.leftColumn) {
            this._allowLeftMenuOpen = true;
            this._allowLeftMenuClose = true;
          }
        } else if (!this._getSwipePositionLimit() || touchPosX <= this._getSwipePositionLimit()) {
          this._allowLeftMenuOpen = true;
          this._allowLeftMenuClose = true;
        } else {
          this._allowLeftMenuClose = true;
        }
      }

      if (this.props.rightSwipe) {
        columnAlwaysShown =
          rightColumn && rightColumn.props.minWidth && rightColumn.props.maxWidth && !rightColumn.props.block;
        if (columnAlwaysShown) {
          if (result.rightColumn) {
            this._allowRightMenuOpen = true;
            this._allowRightMenuClose = true;
          }
        } else if (
          !this._getSwipePositionLimit(true) ||
          touchPosX >= document.documentElement.clientWidth - this._getSwipePositionLimit(true)
        ) {
          this._allowRightMenuOpen = true;
          this._allowRightMenuClose = true;
        } else {
          this._allowRightMenuClose = true;
        }
      }
    }
  },

  _onSwipeEnd() {
    if (this.isSwipedHorizontal()) {
      if (this.isSwipedRight()) {
        if (this._isRightOpen() && this._allowRightMenuClose) {
          this._close(true);
        } else if (this._allowLeftMenuOpen) {
          this._open();
        }
      } else if (this.isSwipedLeft()) {
        if (this._isLeftOpen() && this._allowLeftMenuClose) {
          this._close();
        } else if (this._allowRightMenuOpen) {
          this._open(true);
        }
      }
    }

    this._allowLeftMenuOpen = false;
    this._allowRightMenuOpen = false;
    this._allowLeftMenuClose = false;
    this._allowRightMenuClose = false;

    return this;
  },

  _close(right) {
    if (right && UU5.Environment.page.getRight()) {
      UU5.Environment.page.getRight().close();
    } else if (UU5.Environment.page.getLeft()) {
      UU5.Environment.page.getLeft().close();
    }

    return this;
  },

  _open(right) {
    if (right && UU5.Environment.page.getRight()) {
      UU5.Environment.page.getRight().open();
    } else if (UU5.Environment.page.getLeft()) {
      UU5.Environment.page.getLeft().open();
    }
  },

  _isLeftOpen() {
    return UU5.Environment.page.isLeftOpen();
  },

  _isRightOpen() {
    return UU5.Environment.page.isRightOpen();
  },

  _getPropsToPass() {
    let newProps = this.getMainPropsToPass();
    newProps.mainAttrs = {
      onTouchStart: this.swipeOnTouchStart.bind(this, this._onSwipeStart),
      onTouchMove: this.swipeOnTouchMove,
      onTouchEnd: this.swipeOnTouchEnd.bind(this, this._onSwipeEnd)
    };
    return newProps;
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    return <UU5.Bricks.Div {...this._getPropsToPass()}>{this.getChildren()}</UU5.Bricks.Div>;
  }
  //@@viewOff:render
});

export default PageSwiper;
