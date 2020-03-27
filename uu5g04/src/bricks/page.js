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

import { Div } from "./factory.js";
import Row from "./row.js";
import PageColumn from "./page-column.js";
import MenuButton from "./page-menu-button.js";
import UpdateWrapper from "./update-wrapper.js";
import PageSwiper from "./page-swiper.js";
import PageTop from "./page-top.js";
import PageBottom from "./page-bottom.js";
import ResizeObserver from "./resize-observer.js";

import "./page.less";
//@@viewOff:imports

const LEFT = "left";
const RIGHT = "right";
const TOP = "top";
const BOTTOM = "bottom";
const CONTENT = "content";
const PAGE_CONTENT = UU5.PropTypes.oneOfType([
  UU5.PropTypes.shape({
    tag: UU5.PropTypes.oneOfType([UU5.PropTypes.string, UU5.PropTypes.element]),
    props: UU5.PropTypes.arrayOf(UU5.PropTypes.object)
  }),
  UU5.PropTypes.node,
  UU5.PropTypes.element,
  UU5.PropTypes.string,
  UU5.PropTypes.number
]); //content (bodyItem, node, element, string, number)

function checkScreenSizeDependableProp(screenSize, propValue) {
  let result = false;

  if (typeof propValue === "string") {
    propValue
      .trim()
      .split(" ")
      .some(size => {
        if (screenSize == size) {
          result = true;
          return true;
        } else {
          return false;
        }
      });
  } else if (typeof propValue === "boolean") {
    result = propValue;
  }

  return result;
}

export const Page = UU5.Common.VisualComponent.create({
  displayName: "Page", // for backward compatibility (test snapshots)
  //@@viewOn:mixins
  mixins: [
    UU5.Common.BaseMixin,
    UU5.Common.PureRenderMixin,
    UU5.Common.ElementaryMixin,
    UU5.Common.NestingLevelMixin,
    UU5.Common.ContentMixin,
    UU5.Common.ScreenSizeMixin,
    UU5.Common.CcrWriterMixin
  ],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("Page"),
    nestingLevel: "page",
    classNames: {
      main: ns.css("page"),
      top: ns.css("page-top"),
      bottom: ns.css("page-bottom"),
      left: ns.css("page-left"),
      right: ns.css("page-right"),
      content: ns.css("page-content"),
      contentBody: ns.css("page-content-body"),
      modal: ns.css("page-modal uu5-elevation-5"),
      popover: ns.css("page-popover uu5-elevation-5"),
      alertBus: ns.css("page-alert-bus uu5-elevation-5"),
      appLayer: ns.css("page-app-layer"),
      systemLayer: ns.css("page-system-layer"),
      columnFloat: ns.css("page-column-float"),
      elevation0: "uu5-elevation-0",
      elevation1: "uu5-elevation-1",
      elevation2: "uu5-elevation-2",
      elevation3: "uu5-elevation-3",
      elevation4: "uu5-elevation-4",
      zIndex0: ns.css("page-z-index-0"),
      zIndex1: ns.css("page-z-index-1"),
      zIndex2: ns.css("page-z-index-2"),
      zIndex3: ns.css("page-z-index-3"),
      zIndex4: ns.css("page-z-index-4"),
      type: ns.css("page-type-"),
      flex: ns.css("page-flex"),
      flexGrow: ns.css("page-flex-grow"),
      flexBasis: ns.css("page-flex-basis"),
      pageFull: ns.css("page-full"),
      overflowHidden: ns.css("page-overflow"),
      swiper: ns.css("page-swiper"),
      swiperBody: ns.css("page-swiper-body"),
      IEBottomFix: ns.css("page-bottom-ie-fix"),
      scrolledDown: ns.css("page-scrolled-down")
    },
    opt: {
      ccrKey: UU5.Environment.CCRKEY_PAGE
    },
    errors: {
      pageAlreadyRegistered: "Page is already registered."
    },
    defaults: {
      regexpEclMark: /!/g,
      regexpNumbers: /[0-9]/g
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    type: UU5.PropTypes.oneOf([
      "0",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "11",
      "12",
      "13",
      "14",
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14
    ]),
    fullPage: UU5.PropTypes.bool,

    topWrapperProps: UU5.PropTypes.object,
    bottomWrapperProps: UU5.PropTypes.object,
    leftWrapperProps: UU5.PropTypes.object,
    rightWrapperProps: UU5.PropTypes.object,
    contentWrapperProps: UU5.PropTypes.object,
    appLayerWrapperProps: UU5.PropTypes.object,
    systemLayerWrapperProps: UU5.PropTypes.object,
    switchElevationTopBottom: UU5.PropTypes.bool,
    switchElevationLeftRight: UU5.PropTypes.bool,
    isLeftOpen: UU5.PropTypes.oneOfType([UU5.PropTypes.bool, UU5.PropTypes.string]),
    isRightOpen: UU5.PropTypes.oneOfType([UU5.PropTypes.bool, UU5.PropTypes.string]),

    top: PAGE_CONTENT, //content (bodyItem, node, element, string, number)
    bottom: PAGE_CONTENT, //content (bodyItem, node, element, string, number)
    left: PAGE_CONTENT, //content (bodyItem, node, element, string, number)
    leftOpen: PAGE_CONTENT, //content (bodyItem, node, element, string, number)
    leftClosed: PAGE_CONTENT, //content (bodyItem, node, element, string, number)
    right: PAGE_CONTENT, //content (bodyItem, node, element, string, number)
    rightOpen: PAGE_CONTENT, //content (bodyItem, node, element, string, number)
    rightClosed: PAGE_CONTENT, //content (bodyItem, node, element, string, number)

    alertBus: UU5.PropTypes.oneOfType([
      UU5.PropTypes.shape({
        tag: UU5.PropTypes.oneOfType([UU5.PropTypes.string, UU5.PropTypes.element]),
        props: UU5.PropTypes.arrayOf(UU5.PropTypes.object)
      }),
      UU5.PropTypes.node,
      UU5.PropTypes.element
    ]), //content (bodyItem, node, element)
    modal: UU5.PropTypes.oneOfType([
      UU5.PropTypes.shape({
        tag: UU5.PropTypes.oneOfType([UU5.PropTypes.string, UU5.PropTypes.element]),
        props: UU5.PropTypes.arrayOf(UU5.PropTypes.object)
      }),
      UU5.PropTypes.node,
      UU5.PropTypes.element
    ]), //content (bodyItem, node, element)
    appLayerContent: UU5.PropTypes.any, //content
    systemLayerContent: UU5.PropTypes.any, //content
    leftWidth: UU5.PropTypes.string, // 'xs-0 s-20 m-15 l-15 xl-30' [!|][xs|s|m|l|xl][-nn][-nn]
    rightWidth: UU5.PropTypes.string, // 'xs-0 s-20 m-15 l-15 xl-30'
    leftSwipe: UU5.PropTypes.oneOfType([UU5.PropTypes.bool, UU5.PropTypes.number]),
    rightSwipe: UU5.PropTypes.oneOfType([UU5.PropTypes.bool, UU5.PropTypes.number]),
    topFixed: UU5.PropTypes.oneOfType([UU5.PropTypes.bool, UU5.PropTypes.oneOf(["always", "smart", "none"])]),
    topFixedHeight: UU5.PropTypes.number,
    topFixedScrolledDownOffset: UU5.PropTypes.number,
    bottomFixed: UU5.PropTypes.oneOfType([UU5.PropTypes.bool, UU5.PropTypes.oneOf(["always", "smart", "none"])]),
    bottomFixedHeight: UU5.PropTypes.number,
    leftFixed: UU5.PropTypes.bool,
    rightFixed: UU5.PropTypes.bool,
    leftRelative: UU5.PropTypes.string, // 'xs s m l xl'
    rightRelative: UU5.PropTypes.string, // 'xs s m l xl'
    leftResizable: UU5.PropTypes.oneOfType([
      UU5.PropTypes.bool,
      UU5.PropTypes.string,
      UU5.PropTypes.oneOf(["open", "closed"])
    ]),
    rightResizable: UU5.PropTypes.oneOfType([
      UU5.PropTypes.bool,
      UU5.PropTypes.string,
      UU5.PropTypes.oneOf(["open", "closed"])
    ]),
    leftResizableMinWidth: UU5.PropTypes.number,
    leftResizableMaxWidth: UU5.PropTypes.number,
    rightResizableMinWidth: UU5.PropTypes.number,
    rightResizableMaxWidth: UU5.PropTypes.number,
    onLeftResize: UU5.PropTypes.func,
    onRightResize: UU5.PropTypes.func,
    useDnD: UU5.PropTypes.bool,
    overlayTop: UU5.PropTypes.bool,
    content: UU5.PropTypes.any, // property from content mixin
    showLeftToggleButton: UU5.PropTypes.bool,
    showRightToggleButton: UU5.PropTypes.bool
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      type: 1,
      fullPage: true,
      topWrapperProps: {},
      bottomWrapperProps: {},
      leftWrapperProps: {},
      rightWrapperProps: {},
      contentWrapperProps: {},
      appLayerWrapperProps: {},
      systemLayerWrapperProps: {},
      switchElevationTopBottom: false,
      switchElevationLeftRight: false,
      top: null,
      bottom: null,
      left: null,
      leftOpen: null,
      leftClosed: null,
      isLeftOpen: false,
      right: null,
      rightOpen: null,
      isRightOpen: false,
      rightClosed: null,
      alertBus: null,
      modal: null,
      appLayerContent: null,
      systemLayerContent: null,
      leftWidth: null,
      rightWidth: null,
      leftSwipe: false,
      rightSwipe: false,
      topFixed: "none",
      topAlwaysFixed: false,
      topFixedHeight: 0,
      topFixedScrolledDownOffset: 1,
      bottomFixed: "none",
      bottomAlwaysFixed: false,
      bottomFixedHeight: 0,
      leftFixed: false,
      rightFixed: false,
      leftRelative: null,
      rightRelative: null,
      leftResizable: false,
      rightResizable: false,
      leftResizableMinWidth: undefined,
      leftResizableMaxWidth: undefined,
      rightResizableMinWidth: undefined,
      rightResizableMaxWidth: undefined,
      onLeftResize: null,
      onRightResize: null,
      useDnD: false,
      overlayTop: false,
      showLeftToggleButton: false,
      showRightToggleButton: false
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  getInitialState() {
    // initialize
    this.props.userLayerContent &&
      UU5.Common.Tools.warning("Property 'userLayerContent' is deprecated! Use 'appLayerContent' instead.");
    this.props.userLayerWrapperProps &&
      UU5.Common.Tools.warning("Property 'userLayerWrapperProps' is deprecated! Use 'appLayerWrapperProps' instead.");
    // NOTE We need onscroll processed sooner than scroll handlers in nested components
    // (e.g. if app uses uu5-bricks-page-scrolled-down CSS class for restyling top bar
    // then we need PageTop to already have those styles applied in its scroll handler).
    UU5.Environment.EventListener.addWindowEvent("scroll", this.getId(), this._onPageScroll);
    // state
    return {
      widths: this._setWidths(),
      scrolledDown: this.props.topFixed === "always" && window.pageYOffset >= this.props.topFixedScrolledDownOffset,
      popoverProviderValue: { getPopover: this.getPopover }
    };
  },

  componentDidMount() {
    if (UU5.Environment.page) {
      this.showError("pageAlreadyRegistered");
    } else {
      UU5.Environment.page = this;
    }

    this._setLayerContent(this.props.systemLayerContent, this._systemLayer);
    this._setLayerContent(this.props.appLayerContent || this.props.userLayerContent, this._appLayer);
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.controlled) {
      this.setState({ widths: this._setWidths(nextProps) });
      this._setLayerContent(nextProps.systemLayerContent, this._systemLayer);
      this._setLayerContent(nextProps.appLayerContent || this.props.userLayerContent, this._appLayer);
    }
  },

  componentWillUnmount() {
    UU5.Environment.page === this && (UU5.Environment.page = null);
    UU5.Environment.EventListener.removeWindowEvent("scroll", this.getId(), this._onPageScroll);
  },

  componentDidUpdate() {
    if ((this.props.leftFixed || this._isLeftRelative()) && this.getLeft()) {
      this.getLeft()._adjustFixedPosition();
    }

    if ((this.props.rightFixed || this._isRightRelative()) && this.getRight()) {
      this.getRight()._adjustFixedPosition();
    }
  },

  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  isPage() {
    return true;
  },

  isLeftFloat() {
    return this.state.widths.left[this.getScreenSize()] && this.state.widths.left[this.getScreenSize()].float;
  },

  isRightFloat() {
    return this.state.widths.right[this.getScreenSize()] && this.state.widths.right[this.getScreenSize()].float;
  },

  isLeftOpen() {
    return this.getLeft() && this.getLeft().isOpen();
  },

  isRightOpen() {
    return this.getRight() && this.getRight().isOpen();
  },

  //page left column
  getLeftColumn() {
    UU5.Common.Tools.warning(
      "Method '[component].getLeftColumn()' is deprecated! Use '[component].getLeft()' instead."
    );
    return this.getLeft();
  },

  getLeft() {
    return this._pageLeft;
  },

  //page right column
  getRightColumn() {
    UU5.Common.Tools.warning(
      "Method '[component].getRightColumn()' is deprecated! Use '[component].getLeft()' instead."
    );
    return this.getRight();
  },

  getRight() {
    return this._pageRight;
  },

  //content component of column
  getLeftOpen() {
    if (this._pageLeft.isOpen()) {
      return this._leftOpen || this._left;
    } else {
      return null;
    }
  },

  //content component of column
  getLeftClosed() {
    if (!this._pageLeft.isOpen()) {
      return this._leftClosed || this._left;
    } else {
      return null;
    }
  },

  //content component of column
  getRightOpen() {
    if (this._pageRight.isOpen()) {
      return this._rightOpen || this._right;
    } else {
      return null;
    }
  },

  //content component of column
  getRightClosed() {
    if (!this._pageRight.isOpen()) {
      return this._rightClosed || this._right;
    } else {
      return null;
    }
  },

  //content component of column
  getTop() {
    return this._top;
  },

  //content component of column
  getBottom() {
    return this._bottom;
  },

  toggleLeft(setStateCallback) {
    if (!this.isLeftOpen() && this.isRightOpen() && !this._isRightRelative()) {
      this.closeRight();
    }

    this._pageLeft && this._pageLeft.toggle(setStateCallback);
    return this;
  },

  openLeft(setStateCallback) {
    if (this.isRightOpen() && !this._isRightRelative()) {
      this.closeRight();
    }

    this._pageLeft && this._pageLeft.open(setStateCallback);
    return this;
  },

  closeLeft(setStateCallback) {
    this._pageLeft && this._pageLeft.close(setStateCallback);
    return this;
  },

  toggleRight(setStateCallback) {
    if (!this.isRightOpen() && this.isLeftOpen() && !this._isLeftRelative()) {
      this.closeLeft();
    }

    this._pageRight && this._pageRight.toggle(setStateCallback);
    return this;
  },

  openRight(setStateCallback) {
    if (this.isLeftOpen() && !this._isLeftRelative()) {
      this.closeLeft();
    }

    this._pageRight && this._pageRight.toggle(setStateCallback);
    return this;
  },

  closeRight(setStateCallback) {
    this._pageRight && this._pageRight.toggle(setStateCallback);
    return this;
  },

  getUserLayer() {
    UU5.Common.Tools.warning(
      "Method '[component].getUserLayer()' is deprecated! Use '[component].getAppLayer()' instead."
    );
    return this._appLayer;
  },

  getAppLayer() {
    return this._appLayer;
  },

  getSystemLayer() {
    return this._systemLayer;
  },

  getAlertBus() {
    return this._alertBus;
  },

  getModal() {
    if (!this._modal && this._hasModal()) {
      return this._getMockModal();
    }
    return this._modal;
  },

  getPopover() {
    if (!this._popover) {
      return this._getMockPopover();
    }
    return this._popover;
  },

  onLeftResizeDefault(opt) {
    if (opt) {
      this._setNewWidths(opt.nextWidth, opt.screenSize, false);
    }
  },

  onRightResizeDefault(opt) {
    if (opt) {
      this._setNewWidths(opt.nextWidth, opt.screenSize, true);
    }
  },
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  _onPageScroll(e) {
    let newScrolledDown =
      this.props.topFixed === "always" && window.pageYOffset >= this.props.topFixedScrolledDownOffset;
    this.setState(({ scrolledDown }) =>
      scrolledDown !== newScrolledDown ? { scrolledDown: newScrolledDown } : undefined
    );
    if (typeof this.props.onScroll === "function") {
      this.props.onScroll({ component: this, event: e, scrollTop: window.pageYOffset, scrollLeft: window.pageXOffset });
    }
  },

  _getPropsToPass() {
    let newProps = UU5.Common.Tools.merge(this.getMainPropsToPass(), { content: null });
    newProps.className += " " + this.getClassName("type") + this.props.type;
    this.props.fullPage && (newProps.className += " " + this.getClassName("pageFull"));
    this.state.scrolledDown && (newProps.className += " " + this.getClassName("scrolledDown"));
    newProps.leftSwipe = this.props.leftSwipe;
    newProps.rightSwipe = this.props.rightSwipe;

    return newProps;
  },

  _getWidths(width) {
    width = width || "xs-0";
    let widths = {
      xs: { minWidth: 0, minUnit: "%" },
      s: { minWidth: 0, minUnit: "%" },
      m: { minWidth: 0, minUnit: "%" },
      l: { minWidth: 0, minUnit: "%" },
      xl: { minWidth: 0, minUnit: "%" }
    };

    let splitter = width.split(" ");
    splitter.forEach(split => {
      let [key, minWidth, maxWidth] = split.split("-");
      let match = key.match(this.getDefault().regexpEclMark);
      let float = match && match.length > 0;
      if (float && minWidth && !maxWidth) {
        maxWidth = minWidth;
        minWidth = 0;
      }

      widths[key.replace("!", "")] = {
        minWidth: parseInt(minWidth),
        maxWidth: maxWidth ? parseInt(maxWidth) : null,
        float: float,
        minUnit: (minWidth && minWidth.replace(this.getDefault().regexpNumbers, "")) || "%",
        maxUnit: (maxWidth && maxWidth.replace(this.getDefault().regexpNumbers, "")) || "%"
      };
    });

    widths.xs.minWidth = widths.xs.minWidth === 0 ? 0 : widths.xs.minWidth || 0;
    widths.s.minWidth = widths.s.minWidth === 0 ? 0 : widths.s.minWidth || widths.xs.minWidth;
    widths.m.minWidth = widths.m.minWidth === 0 ? 0 : widths.m.minWidth || widths.s.minWidth;
    widths.l.minWidth = widths.l.minWidth === 0 ? 0 : widths.l.minWidth || widths.m.minWidth;
    widths.xl.minWidth = widths.xl.minWidth === 0 ? 0 : widths.xl.minWidth || widths.l.minWidth;

    return widths;
  },

  _setWidths(props) {
    let widths;
    let defaultWidth = {
      xs: { minWidth: 0, minUnit: "%" },
      s: { minWidth: 0, minUnit: "%" },
      m: { minWidth: 0, minUnit: "%" },
      l: { minWidth: 0, minUnit: "%" },
      xl: { minWidth: 0, minUnit: "%" }
    };
    props = props || this.props;

    let leftWidths = props.left || props.leftOpen || props.leftClosed ? this._getWidths(props.leftWidth) : defaultWidth;
    let rightWidths =
      props.right || props.rightOpen || props.rightClosed ? this._getWidths(props.rightWidth) : defaultWidth;

    widths = {
      left: leftWidths,
      right: rightWidths
    };

    return widths;
  },

  _setNewWidths(width, screenSize, right) {
    let widths = { ...this.state.widths };
    let newWidth = widths[right ? "right" : "left"];
    let column = right ? this.getRight() : this.getLeft();
    let isOpen = column && column.isOpen();
    let item = newWidth[screenSize];

    if (isOpen) {
      if (item.float && item.maxWidth && item.maxUnit) {
        item.maxWidth = parseInt(width);
        item.maxUnit = "px";
      } else {
        item.minWidth = parseInt(width);
        item.minUnit = "px";
      }
    } else {
      item.minWidth = parseInt(width);
      item.minUnit = "px";
    }

    this.setState({ widths });
  },

  _getWidth(screenSize) {
    let result = {
      widthContent: "100%",
      widthTop: "100%",
      floatLeft: this.state.widths.left[screenSize].float,
      floatRight: this.state.widths.right[screenSize].float
    };

    let elevation = this._getElevation(this.props.type);
    let minWidthLeft = 0;
    let widthLeft = 0;
    let maxWidthLeft = null;
    let minWidthRight = 0;
    let widthRight = 0;
    let maxWidthRight = null;
    let left = 0;
    let right = 0;

    if (this.props.type !== 0) {
      if (this.props.left || (this.props.leftOpen && this.props.leftClosed)) {
        minWidthLeft = this.state.widths.left[screenSize].minWidth;
        maxWidthLeft = this.state.widths.left[screenSize].maxWidth;
        widthLeft = maxWidthLeft || minWidthLeft;
      }
      result.minWidthLeft = minWidthLeft ? minWidthLeft + this.state.widths.left[screenSize].minUnit : null;
      result.maxWidthLeft = maxWidthLeft ? maxWidthLeft + this.state.widths.left[screenSize].maxUnit : null;
      result.widthLeft =
        widthLeft +
        (maxWidthLeft ? this.state.widths.left[screenSize].maxUnit : this.state.widths.left[screenSize].minUnit);

      if (this.props.right || (this.props.rightOpen && this.props.rightClosed)) {
        minWidthRight = this.state.widths.right[screenSize].minWidth;
        maxWidthRight = this.state.widths.right[screenSize].maxWidth;
        widthRight = maxWidthRight || minWidthRight;
      }
      result.minWidthRight = minWidthRight ? minWidthRight + this.state.widths.right[screenSize].minUnit : null;
      result.maxWidthRight = maxWidthRight ? maxWidthRight + this.state.widths.right[screenSize].maxUnit : null;
      result.widthRight =
        widthRight +
        (maxWidthRight ? this.state.widths.right[screenSize].maxUnit : this.state.widths.right[screenSize].minUnit);

      if (result.floatLeft) {
        left = result.minWidthLeft && result.maxWidthLeft ? result.minWidthLeft : 0;
      } else {
        left = result.widthLeft;
      }

      if (result.floatRight) {
        right = result.minWidthRight && result.maxWidthRight ? result.minWidthRight : 0;
      } else {
        right = result.widthRight;
      }
    }

    let excludeLeft =
      Math.abs(elevation.left - elevation.right) === 1 ||
      (Math.abs(elevation.left - elevation.right) > 1 && elevation.left < elevation.right);
    let excludeRight =
      Math.abs(elevation.left - elevation.right) === 1 ||
      (Math.abs(elevation.left - elevation.right) > 1 && elevation.right < elevation.left);
    result.widthContent =
      "Calc(100% - " + ((excludeLeft && left) || "0%") + " - " + ((excludeRight && right) || "0%") + ")";

    return result;
  },

  _isTopFixed() {
    return this.props.topFixed === true || this.props.topFixed === "always" || this.props.topFixed === "smart";
  },

  _isBottomFixed() {
    return this.props.bottomFixed === true || this.props.bottomFixed === "always" || this.props.bottomFixed === "smart";
  },

  _isLeftRelative() {
    return checkScreenSizeDependableProp(this.getScreenSize(), this.props.leftRelative);
  },

  _isRightRelative() {
    return checkScreenSizeDependableProp(this.getScreenSize(), this.props.rightRelative);
  },

  _isLeftResizable() {
    if (this.props.leftResizable === "open" || this.props.leftResizable === "closed") {
      return this.props.leftResizable;
    } else {
      return checkScreenSizeDependableProp(this.getScreenSize(), this.props.leftResizable);
    }
  },

  _isRightResizable() {
    if (this.props.rightResizable === "open" || this.props.rightResizable === "closed") {
      return this.props.rightResizable;
    } else {
      return checkScreenSizeDependableProp(this.getScreenSize(), this.props.rightResizable);
    }
  },

  _isLeftOpen() {
    return checkScreenSizeDependableProp(this.getScreenSize(), this.props.isLeftOpen);
  },

  _isRightOpen() {
    return checkScreenSizeDependableProp(this.getScreenSize(), this.props.isRightOpen);
  },

  _getPageColumn(component, name) {
    let result;
    if (component) {
      if (typeof component === "object") {
        let newProps = { parent: this, ref_: ref => (this[name] = ref) };
        if (!component.props.id) {
          newProps.id = this.getId() + name;
        }

        if (component.props && typeof component.props.ref_ === "function") {
          newProps.ref_ = ref => {
            component.props.ref_(ref);
            this[name] = ref;
          };
        }

        if (component.tag) {
          result = UU5.Common.Element.create(UU5.Common.Tools.checkTag(component), newProps);
        } else if (UU5.Common.Element.isValid(component)) {
          result = UU5.Common.Element.clone(component, newProps);
        }
      } else {
        result = component;
      }
    }

    return result;
  },

  _getTopProps() {
    let elevation = this._getElevation(this.props.type);
    let props = {
      className:
        this.getClassName("elevation" + elevation["top"]) + " " + this.getClassName("zIndex" + elevation["top"]),
      id: this.getId() + "-top",
      bottomId: this.getId() + "-bottom",
      leftFixed: this.props.leftFixed,
      rightFixed: this.props.rightFixed,
      overlayContent: this.props.overlayTop
    };

    if (this._isTopFixed()) {
      props.fixed = true;
      props.alwaysFixed = this.props.topFixed === "always";
      props.fixedHeight = this.props.topFixedHeight;
    }

    return props;
  },

  _getBottomProps() {
    let elevation = this._getElevation(this.props.type);
    let props = {
      className:
        this.getClassName("elevation" + elevation["bottom"]) + " " + this.getClassName("zIndex" + elevation["bottom"]),
      id: this.getId() + "-bottom",
      topId: this.getId() + "-top"
    };

    if (this._isBottomFixed()) {
      props.fixed = true;
      props.alwaysFixed = this.props.bottomFixed === "always";
      props.fixedHeight = this.props.bottomFixedHeight;
    }

    return props;
  },

  _getColumnProps(props, classNames, position, screenSize, block) {
    props = props || {};
    let newProps = UU5.Common.Tools.merge({ pureRender: true }, props);
    let topId = this.getId() + "-top";
    let bottomId = this.getId() + "-bottom";
    let contentId = this.getId() + "-content";

    if (typeof classNames === "string") {
      newProps.className = newProps.className || "";
      newProps.className += " " + classNames;
    } else if (Array.isArray(classNames) && classNames.length > 0) {
      newProps.className = newProps.className || "";
      classNames.forEach(className => {
        className && (newProps.className += " " + className);
      });
    }

    let elevation = this._getElevation(this.props.type);

    switch (position) {
      case LEFT:
        if (this._getWidth(screenSize).floatLeft) {
          newProps.className += " " + this.getClassName("columnFloat");
        }
        if (!block && (this.props.left || this.props.leftOpen || this.props.leftClosed)) {
          newProps.elevation = elevation[position];
        }
        newProps.controlled = false;
        newProps.fixed = this.props.leftFixed;
        newProps.topFixed = this._isTopFixed();
        newProps.topFixedHeight = this.props.topFixedHeight;
        newProps.topId = topId;
        newProps.bottomFixed = this._isBottomFixed();
        newProps.bottomFixedHeight = this.props.bottomFixedHeight;
        newProps.bottomId = bottomId;
        newProps.contentId = contentId;
        newProps.overlayTop = elevation.top > elevation.left;
        newProps.overlayBottom = elevation.bottom > elevation.left;
        newProps.topOverlaysContent = this.props.overlayTop;
        newProps.relative = this._isLeftRelative();
        newProps.onUpdate = this._onLeftColumnUpdate;
        newProps.resizable = this._isLeftResizable();
        newProps.onResize = this._onColumnResize;
        newProps.minResizableWidth = this.props.leftResizableMinWidth;
        newProps.maxResizableWidth = this.props.leftResizableMaxWidth;
        newProps.showToggleButton = this.props.showLeftToggleButton;
        newProps.ref_ = left => (this._pageLeft = left);
        break;
      case RIGHT:
        if (this._getWidth(screenSize).floatRight) {
          newProps.className += " " + this.getClassName("columnFloat");
        }
        if (!block && (this.props.right || this.props.rightOpen || this.props.rightClosed)) {
          newProps.elevation = elevation[position];
        }
        newProps.controlled = false;
        newProps.fixed = this.props.rightFixed;
        newProps.topFixed = this._isTopFixed();
        newProps.topFixedHeight = this.props.topFixedHeight;
        newProps.topId = topId;
        newProps.bottomFixed = this._isBottomFixed();
        newProps.bottomFixedHeight = this.props.bottomFixedHeight;
        newProps.bottomId = bottomId;
        newProps.contentId = contentId;
        newProps.overlayTop = elevation.top > elevation.right;
        newProps.overlayBottom = elevation.bottom > elevation.right;
        newProps.topOverlaysContent = this.props.overlayTop;
        newProps.relative = this._isRightRelative();
        newProps.onUpdate = this._onRightColumnUpdate;
        newProps.resizable = this._isRightResizable();
        newProps.onResize = this._onColumnResize;
        newProps.minResizableWidth = this.props.rightResizableMinWidth;
        newProps.maxResizableWidth = this.props.rightResizableMaxWidth;
        newProps.showToggleButton = this.props.showRightToggleButton;
        newProps.ref_ = right => (this._pageRight = right);
        break;
      case TOP:
        if (!this._isTopFixed() && !this.props.leftFixed && !this.props.rightFixed) {
          newProps.className += " " + this.getClassName("zIndex" + elevation[position]);
          newProps.id = topId;
        }
        break;
      case BOTTOM:
        if (!this._isBottomFixed()) {
          newProps.className +=
            " " +
            this.getClassName("elevation" + elevation[position]) +
            " " +
            this.getClassName("zIndex" + elevation[position]);
          newProps.id = bottomId;
        }
        break;
      case CONTENT:
        newProps.id = contentId;
        break;
    }

    newProps.parent = this;

    return newProps;
  },

  _getAlertBus() {
    let alertBus;
    if (this.props.alertBus && typeof this.props.alertBus === "object") {
      let props = UU5.Common.Tools.merge(this.props.alertBus.props, {
        pureRender: true,
        parent: this,
        className:
          this.getClassName("alertBus") +
          (this.props.alertBus.props && this.props.alertBus.props.className
            ? " " + this.props.alertBus.props.className
            : ""),
        ref_: alertBus => (this._alertBus = alertBus)
      });
      if (this.props.alertBus.tag) {
        alertBus = UU5.Common.Element.create(UU5.Common.Tools.checkTag(this.props.alertBus.tag), props);
      } else if (UU5.Common.Element.isValid(this.props.alertBus)) {
        alertBus = UU5.Common.Element.clone(this.props.alertBus, props);
      }
    }
    return alertBus;
  },

  _getPopover() {
    this._popoverId = this.getId() + "_popover";
    let props = {
      pureRender: true,
      parent: this,
      id: this._popoverId,
      ref_: this._initPopover,
      controlled: false,
      className: this.getClassName("popover")
    };

    return <UU5.Bricks.Popover {...props} />;
  },

  _initPopover(popover) {
    this._popover = popover;
    if (this._openMockPopover) {
      popover.open(this._popoverOpenParams.props, this._popoverOpenParams.setStateCallback);
    }
    // clean mock
    delete this._mockPopover;
    delete this._openMockPopover;
    delete this._popoverOpenParams;
  },

  _getMockPopover() {
    if (!this._mockPopover) {
      this._mockPopover = {
        open: (props, setStateCallback) => {
          this._popoverOpenParams = { props, setStateCallback };
          this._openMockPopover = true;
        },
        close: setStateCallback => {
          this._openMockPopover = false;
        },
        toggle: setStateCallback => {
          this._openMockPopover = !this._openMockPopover;
        },
        getId: () => {
          return this._popoverId;
        },
        isOpen: () => {
          return false;
        }
      };
    }
    return this._mockPopover;
  },

  _getModal() {
    let modal;
    if (this._hasModal()) {
      this._modalId = this.props.modal.props.id || this.getId() + "_modal";
      let props = UU5.Common.Tools.merge(this.props.modal.props, {
        pureRender: true,
        parent: this,
        className:
          this.getClassName("modal") +
          (this.props.modal.props && this.props.modal.props.className ? " " + this.props.modal.props.className : ""),
        ref_: this._initModal,
        id: this._modalId,
        controlled: false
      });
      if (this.props.modal.tag) {
        modal = UU5.Common.Element.create(UU5.Common.Tools.checkTag(this.props.modal.tag), props);
      } else if (UU5.Common.Element.isValid(this.props.modal)) {
        modal = UU5.Common.Element.clone(this.props.modal, props);
      }
    }
    return modal;
  },

  _hasModal() {
    return this.props.modal && typeof this.props.modal === "object";
  },

  _initModal(modal) {
    this._modal = modal;
    if (this._openMockModal) {
      modal.open(this._modalOpenParams.props, this._modalOpenParams.setStateCallback);
    }
    // clean mock
    delete this._mockModal;
    delete this._openMockModal;
    delete this._modalOpenParams;
  },

  _getMockModal() {
    if (!this._mockModal) {
      this._mockModal = {
        open: (props, setStateCallback) => {
          this._modalOpenParams = { props, setStateCallback };
          this._openMockModal = true;
        },
        close: setStateCallback => {
          this._openMockModal = false;
        },
        toggle: setStateCallback => {
          this._openMockModal = !this._openMockModal;
        },
        getId: () => {
          return this._modalId;
        },
        isOpen: () => {
          return false;
        }
      };
    }
    return this._mockModal;
  },

  _setLayerContent(layerContent, layer) {
    // When elem is not an array, it acts differently
    if (layerContent) {
      let content = Array.isArray(layerContent) ? layerContent : [layerContent];
      layer.setChildren(this.buildChildren({ content }));
    }
    return this;
  },

  _getAppLayer() {
    let props = this.props.userLayerWrapperProps || this.props.appLayerWrapperProps || {};
    let ref = props.ref_;
    props = UU5.Common.Tools.merge(props, {
      dynamic: true,
      controlled: false,
      parent: this,
      className: UU5.Common.Tools.joinClassNames(this.getClassName("appLayer"), props.className),
      ref_: appLayer => {
        this._appLayer = appLayer;
        typeof ref === "function" && ref(appLayer);
      },
      pureRender: true
    });
    return <Div {...props} />;
  },

  _getSystemLayer() {
    let props = this.props.systemLayerWrapperProps || {};
    let ref = props.ref_;
    props = UU5.Common.Tools.merge(props, {
      dynamic: true,
      controlled: false,
      parent: this,
      className: UU5.Common.Tools.joinClassNames(this.getClassName("systemLayer"), props.className),
      ref_: systemLayer => {
        this._systemLayer = systemLayer;
        typeof ref === "function" && ref(systemLayer);
      },
      pureRender: true
    });
    return <Div {...props} />;
  },

  _getTop() {
    let wrapperContent;
    if (this.props.top && typeof this.props.top === "object") {
      let props = UU5.Common.Tools.merge(this.props.top.props, {
        parent: this,
        ref_: top => (this._top = top)
      });
      if (this.props.top.tag) {
        wrapperContent = UU5.Common.Element.create(UU5.Common.Tools.checkTag(this.props.top.tag), props);
      } else if (UU5.Common.Element.isValid(this.props.top)) {
        wrapperContent = UU5.Common.Element.clone(this.props.top, props);
      }
    } else {
      wrapperContent = this.props.top;
    }

    let topContent;
    if (wrapperContent) {
      topContent = (
        <Row
          {...this._getColumnProps(
            this.props.topWrapperProps,
            !this._isTopFixed() ? this.getClassName("top") : null,
            TOP
          )}
        >
          <UpdateWrapper preventRender={this._preventContentRender} content={wrapperContent} />
        </Row>
      );
    }

    let result = wrapperContent ? <PageTop {...this._getTopProps()}>{topContent}</PageTop> : null;

    return result;
  },

  _getBottom() {
    let wrapperContent;
    if (this.props.bottom && typeof this.props.bottom === "object") {
      let props = UU5.Common.Tools.merge(this.props.bottom.props, {
        parent: this,
        ref_: bottom => (this._bottom = bottom)
      });
      if (this.props.bottom.tag) {
        wrapperContent = UU5.Common.Element.create(UU5.Common.Tools.checkTag(this.props.bottom.tag), props);
      } else if (UU5.Common.Element.isValid(this.props.bottom)) {
        wrapperContent = UU5.Common.Element.clone(this.props.bottom, props);
      }
    } else {
      wrapperContent = this.props.bottom;
    }

    let bottomContent;
    if (wrapperContent) {
      bottomContent = (
        <Row
          {...this._getColumnProps(
            this.props.bottomWrapperProps,
            !this._isBottomFixed() ? this.getClassName("bottom") : null,
            BOTTOM
          )}
        >
          <UpdateWrapper preventRender={this._preventContentRender} content={wrapperContent} />
        </Row>
      );
    }

    let result = wrapperContent ? <PageBottom {...this._getBottomProps()}>{bottomContent}</PageBottom> : null;

    return result;
  },

  _getLeftContent() {
    let left = this._getPageColumn(this.props.left, "_left");
    let leftOpen = this._getPageColumn(this.props.leftOpen, "_leftOpen");
    let leftClosed = this._getPageColumn(this.props.leftClosed, "_leftClosed");
    let leftOpenContent = leftOpen || left;
    let leftClosedContent = leftClosed || left;

    return {
      open: leftOpenContent,
      closed: leftClosedContent
    };
  },

  _getRightContent() {
    let right = this._getPageColumn(this.props.right, "_right");
    let rightOpen = this._getPageColumn(this.props.rightOpen, "_rightOpen");
    let rightClosed = this._getPageColumn(this.props.rightClosed, "_rightClosed");
    let rightOpenContent = rightOpen || right;
    let rightClosedContent = rightClosed || right;

    return {
      open: rightOpenContent,
      closed: rightClosedContent
    };
  },

  _onContentResize() {
    UU5.Environment.EventListener.triggerEvent("pageContentResize");
  },

  _onColumnResize(event, prevWidth, nextWidth, right) {
    let opt = { component: this, event, prevWidth, nextWidth, screenSize: this.getScreenSize() };
    if (right && typeof this.props.onRightResize === "function") {
      this.props.onRightResize(opt);
    } else if (typeof this.props.onLeftResize === "function") {
      this.props.onLeftResize(opt);
    } else if (right) {
      this.onRightResizeDefault(opt);
    } else {
      this.onLeftResizeDefault(opt);
    }
  },

  _getElevation(type) {
    let elevation;
    switch (type.toString()) {
      case "1":
        elevation = {
          content: 0,
          left: this.props.switchElevationLeftRight ? 1 : 2,
          right: this.props.switchElevationLeftRight ? 2 : 1,
          top: this.props.switchElevationTopBottom ? 3 : 4,
          bottom: this.props.switchElevationTopBottom ? 4 : 3
        };
        break;
      case "2":
        elevation = {
          content: 0,
          left: this.props.switchElevationLeftRight ? 2 : 3,
          right: this.props.switchElevationLeftRight ? 3 : 2,
          top: 4,
          bottom: 1
        };
        break;
      case "3":
        elevation = {
          content: 0,
          left: this.props.switchElevationLeftRight ? 3 : 4,
          right: this.props.switchElevationLeftRight ? 4 : 3,
          top: this.props.switchElevationTopBottom ? 1 : 2,
          bottom: this.props.switchElevationTopBottom ? 2 : 1
        };
        break;
      case "4":
        elevation = {
          content: 0,
          left: this.props.switchElevationLeftRight ? 2 : 3,
          right: this.props.switchElevationLeftRight ? 3 : 2,
          top: 1,
          bottom: 4
        };
        break;
      case "5":
        elevation = {
          content: 0,
          left: 3,
          right: 1,
          top: 4,
          bottom: 2
        };
        break;
      case "6":
        elevation = {
          content: 0,
          left: 1,
          right: 3,
          top: 4,
          bottom: 2
        };
        break;
      case "7":
        elevation = {
          content: 0,
          left: 3,
          right: 1,
          top: 2,
          bottom: 4
        };
        break;
      case "8":
        elevation = {
          content: 0,
          left: 1,
          right: 3,
          top: 2,
          bottom: 4
        };
        break;
      case "9":
        elevation = {
          content: 0,
          left: 4,
          right: 1,
          top: this.props.switchElevationTopBottom ? 2 : 3,
          bottom: this.props.switchElevationTopBottom ? 3 : 2
        };
        break;
      case "10":
        elevation = {
          content: 0,
          left: 4,
          right: 2,
          top: 3,
          bottom: 1
        };
        break;
      case "11":
        elevation = {
          content: 0,
          left: 4,
          right: 2,
          top: 1,
          bottom: 3
        };
        break;
      case "12":
        elevation = {
          content: 0,
          left: 1,
          right: 4,
          top: this.props.switchElevationTopBottom ? 2 : 3,
          bottom: this.props.switchElevationTopBottom ? 3 : 2
        };
        break;
      case "13":
        elevation = {
          content: 0,
          left: 2,
          right: 4,
          top: 3,
          bottom: 1
        };
        break;
      case "14":
        elevation = {
          content: 0,
          left: 2,
          right: 4,
          top: 1,
          bottom: 3
        };
        break;

      default:
        elevation = {
          content: 0
        };
        break;
    }
    return elevation;
  },

  _getFullPageClass(overflowHidden) {
    let result = [];
    result.push(this.getClassName("flexGrow"));
    overflowHidden && result.push(this.getClassName("overflowHidden"));
    return result.length ? result.join(" ") : null;
  },

  _getContentDiv() {
    return (
      <Div className={this.getClassName("contentBody")} pureRender>
        <UpdateWrapper preventRender={this._preventContentRender} content={this.props.content || this.props.children} />
      </Div>
    );
  },

  _getWrapper() {
    return this.props.leftSwipe || this.props.rightSwipe ? PageSwiper : Div;
  },

  _getType0() {
    return (
      <Div {...this._getPropsToPass()}>
        {this._getAppLayer()}
        {this._getSystemLayer()}

        {this._getAlertBus()}
        {this._getModal()}
        {this._getPopover()}

        <Div
          {...this._getColumnProps(this.props.contentWrapperProps, this.getClassName("content"), CONTENT)}
          ref_={content => (this._pageContent = content)}
        >
          {this._getContentDiv()}
        </Div>
      </Div>
    );
  },

  _getType1() {
    let screenSize = this.getScreenSize();
    let width = this._getWidth(screenSize);
    let Wrapper = this._getWrapper();

    return (
      <Wrapper {...this._getPropsToPass()}>
        {this._getAppLayer()}
        {this._getSystemLayer()}

        {this._getAlertBus()}
        {this._getModal()}
        {this._getPopover()}

        {this._getTop()}
        <Row display={"flex"} className={this._getFullPageClass(true) + " " + this.getClassName("IEBottomFix")}>
          <PageColumn
            {...this._getColumnProps(
              this.props.leftWrapperProps,
              this.getClassName("left"),
              LEFT,
              screenSize,
              !width.floatLeft
            )}
            width={width.widthLeft}
            minWidth={width.minWidthLeft}
            maxWidth={width.maxWidthLeft}
            openContent={this._getLeftContent().open}
            closedContent={this._getLeftContent().closed}
            block={!width.floatLeft}
            open={this._isLeftOpen()}
          />
          <Div
            {...this._getColumnProps(
              this.props.contentWrapperProps,
              [this.getClassName("content"), this.getClassName("flexBasis"), this.getClassName("flexGrow")],
              CONTENT
            )}
            ref_={content => (this._pageContent = content)}
          >
            {this._getContentDiv()}
          </Div>
          <PageColumn
            {...this._getColumnProps(
              this.props.rightWrapperProps,
              this.getClassName("right"),
              RIGHT,
              screenSize,
              !width.floatRight
            )}
            width={width.widthRight}
            minWidth={width.minWidthRight}
            maxWidth={width.maxWidthRight}
            openContent={this._getRightContent().open}
            closedContent={this._getRightContent().closed}
            block={!width.floatRight}
            right={true}
            open={this._isRightOpen() && !this._isLeftOpen()}
          />
          <ResizeObserver onResize={this._onContentResize} />
        </Row>
        {this._getBottom()}
      </Wrapper>
    );
  },

  _getType2() {
    let screenSize = this.getScreenSize();
    let width = this._getWidth(screenSize);
    let Wrapper = this._getWrapper();

    return (
      <Wrapper {...this._getPropsToPass()}>
        {this._getAppLayer()}
        {this._getSystemLayer()}

        {this._getAlertBus()}
        {this._getModal()}
        {this._getPopover()}

        {this._getTop()}
        <Row display={"flex"} className={this._getFullPageClass(true)}>
          <PageColumn
            {...this._getColumnProps(
              this.props.leftWrapperProps,
              this.getClassName("left"),
              LEFT,
              screenSize,
              !width.floatLeft
            )}
            width={width.widthLeft}
            minWidth={width.minWidthLeft}
            maxWidth={width.maxWidthLeft}
            openContent={this._getLeftContent().open}
            closedContent={this._getLeftContent().closed}
            block={!width.floatLeft}
            open={this._isLeftOpen()}
          />
          <Div
            className={this.getClassName("flex") + " " + this.getClassName("flexBasis")}
            ref_={content => (this._pageContent = content)}
          >
            <Row
              {...this._getColumnProps(
                this.props.contentWrapperProps,
                [this.getClassName("content"), this._getFullPageClass(), this.getClassName("IEBottomFix")],
                CONTENT
              )}
              width={width.widthContent}
            >
              {this._getContentDiv()}
              <ResizeObserver onResize={this._onContentResize} />
            </Row>
            {this._getBottom()}
          </Div>
          <PageColumn
            {...this._getColumnProps(
              this.props.rightWrapperProps,
              this.getClassName("right"),
              RIGHT,
              screenSize,
              !width.floatRight
            )}
            width={width.widthRight}
            minWidth={width.minWidthRight}
            maxWidth={width.maxWidthRight}
            openContent={this._getRightContent().open}
            closedContent={this._getRightContent().closed}
            block={!width.floatRight}
            right={true}
            open={this._isRightOpen() && !this._isLeftOpen()}
          />
        </Row>
      </Wrapper>
    );
  },

  _getType3() {
    let screenSize = this.getScreenSize();
    let width = this._getWidth(screenSize);
    let Wrapper = this._getWrapper();

    return (
      <Wrapper {...this._getPropsToPass()}>
        {this._getAppLayer()}
        {this._getSystemLayer()}

        {this._getAlertBus()}
        {this._getModal()}
        {this._getPopover()}

        <Row display={"flex"} className={this._getFullPageClass(true)}>
          <PageColumn
            {...this._getColumnProps(
              this.props.leftWrapperProps,
              this.getClassName("left"),
              LEFT,
              screenSize,
              !width.floatLeft
            )}
            width={width.widthLeft}
            minWidth={width.minWidthLeft}
            maxWidth={width.maxWidthLeft}
            openContent={this._getLeftContent().open}
            closedContent={this._getLeftContent().closed}
            block={!width.floatLeft}
            open={this._isLeftOpen()}
          />
          <Div
            className={this.getClassName("flex") + " " + this.getClassName("flexBasis")}
            ref_={content => (this._pageContent = content)}
          >
            {this._getTop()}
            <Row
              {...this._getColumnProps(
                this.props.contentWrapperProps,
                [this.getClassName("content"), this._getFullPageClass(), this.getClassName("IEBottomFix")],
                CONTENT
              )}
              width={width.widthContent}
              marginTop={this.state.contentMarginTop}
            >
              {this._getContentDiv()}
              <ResizeObserver onResize={this._onContentResize} />
            </Row>
            {this._getBottom()}
          </Div>
          <PageColumn
            {...this._getColumnProps(
              this.props.rightWrapperProps,
              this.getClassName("right"),
              RIGHT,
              screenSize,
              !width.floatRight
            )}
            width={width.widthRight}
            minWidth={width.minWidthRight}
            maxWidth={width.maxWidthRight}
            openContent={this._getRightContent().open}
            closedContent={this._getRightContent().closed}
            block={!width.floatRight}
            right={true}
            open={this._isRightOpen() && !this._isLeftOpen()}
          />
        </Row>
      </Wrapper>
    );
  },

  _getType4() {
    let screenSize = this.getScreenSize();
    let width = this._getWidth(screenSize);
    let Wrapper = this._getWrapper();

    return (
      <Wrapper {...this._getPropsToPass()}>
        {this._getAppLayer()}
        {this._getSystemLayer()}

        {this._getAlertBus()}
        {this._getModal()}
        {this._getPopover()}

        <Row display={"flex"} className={this._getFullPageClass(true) + " " + this.getClassName("IEBottomFix")}>
          <PageColumn
            {...this._getColumnProps(
              this.props.leftWrapperProps,
              this.getClassName("left"),
              LEFT,
              screenSize,
              !width.floatLeft
            )}
            width={width.widthLeft}
            minWidth={width.minWidthLeft}
            maxWidth={width.maxWidthLeft}
            openContent={this._getLeftContent().open}
            closedContent={this._getLeftContent().closed}
            block={!width.floatLeft}
            open={this._isLeftOpen()}
          />
          <Div
            ref_={content => (this._pageContent = content)}
            className={this.getClassName("flexBasis") + " " + this.getClassName("flexGrow")}
          >
            {this._getTop()}
            <Row
              {...this._getColumnProps(
                this.props.contentWrapperProps,
                [this.getClassName("content"), this.getClassName("flexBasis"), this.getClassName("flexGrow")],
                CONTENT
              )}
              width={width.widthContent}
            >
              {this._getContentDiv()}
            </Row>
          </Div>
          <PageColumn
            {...this._getColumnProps(
              this.props.rightWrapperProps,
              this.getClassName("right"),
              RIGHT,
              screenSize,
              !width.floatRight
            )}
            width={width.widthRight}
            minWidth={width.minWidthRight}
            maxWidth={width.maxWidthRight}
            openContent={this._getRightContent().open}
            closedContent={this._getRightContent().closed}
            block={!width.floatRight}
            right={true}
            open={this._isRightOpen() && !this._isLeftOpen()}
          />
          <ResizeObserver onResize={this._onContentResize} />
        </Row>
        {this._getBottom()}
      </Wrapper>
    );
  },

  _getType5() {
    let screenSize = this.getScreenSize();
    let width = this._getWidth(screenSize);
    let Wrapper = this._getWrapper();

    return (
      <Wrapper {...this._getPropsToPass()}>
        {this._getAppLayer()}
        {this._getSystemLayer()}

        {this._getAlertBus()}
        {this._getModal()}
        {this._getPopover()}

        {this._getTop()}

        <Row display={"flex"} className={this._getFullPageClass(true)}>
          <PageColumn
            {...this._getColumnProps(
              this.props.leftWrapperProps,
              this.getClassName("left"),
              LEFT,
              screenSize,
              !width.floatLeft
            )}
            width={width.widthLeft}
            minWidth={width.minWidthLeft}
            maxWidth={width.maxWidthLeft}
            openContent={this._getLeftContent().open}
            closedContent={this._getLeftContent().closed}
            block={!width.floatLeft}
            open={this._isLeftOpen()}
          />
          <Div
            className={this.getClassName("flex") + " " + this.getClassName("flexBasis")}
            ref_={content => (this._pageContent = content)}
          >
            <Row display={"flex"} className={this._getFullPageClass() + " " + this.getClassName("IEBottomFix")}>
              <Div
                {...this._getColumnProps(
                  this.props.contentWrapperProps,
                  [this.getClassName("content"), this._getFullPageClass(), this.getClassName("flexBasis")],
                  CONTENT
                )}
              >
                {this._getContentDiv()}
              </Div>
              <PageColumn
                {...this._getColumnProps(
                  this.props.rightWrapperProps,
                  this.getClassName("right"),
                  RIGHT,
                  screenSize,
                  !width.floatRight
                )}
                width={width.widthRight}
                minWidth={width.minWidthRight}
                maxWidth={width.maxWidthRight}
                openContent={this._getRightContent().open}
                closedContent={this._getRightContent().closed}
                block={!width.floatRight}
                right={true}
                open={this._isRightOpen() && !this._isLeftOpen()}
              />
              <ResizeObserver onResize={this._onContentResize} />
            </Row>
            {this._getBottom()}
          </Div>
        </Row>
      </Wrapper>
    );
  },

  _getType6() {
    let screenSize = this.getScreenSize();
    let width = this._getWidth(screenSize);
    let Wrapper = this._getWrapper();

    return (
      <Wrapper {...this._getPropsToPass()}>
        {this._getAppLayer()}
        {this._getSystemLayer()}

        {this._getTop()}

        <Row display="flex" className={this._getFullPageClass(true)}>
          <Div className={this.getClassName("flex") + " " + this.getClassName("flexBasis")}>
            <Row
              display="flex"
              style={{ position: "relative" }}
              className={this._getFullPageClass() + " " + this.getClassName("IEBottomFix")}
            >
              <PageColumn
                {...this._getColumnProps(
                  this.props.leftWrapperProps,
                  this.getClassName("left"),
                  LEFT,
                  screenSize,
                  !width.floatLeft
                )}
                width={width.widthLeft}
                minWidth={width.minWidthLeft}
                maxWidth={width.maxWidthLeft}
                openContent={this._getLeftContent().open}
                closedContent={this._getLeftContent().closed}
                block={!width.floatLeft}
                open={this._isLeftOpen()}
              />
              <Div
                {...this._getColumnProps(
                  this.props.contentWrapperProps,
                  [this.getClassName("content"), this.getClassName("flexBasis"), this.getClassName("flexGrow")],
                  CONTENT
                )}
                ref_={content => (this._pageContent = content)}
              >
                {this._getContentDiv()}
              </Div>
              <ResizeObserver onResize={this._onContentResize} />
            </Row>
            {this._getBottom()}
          </Div>
          <PageColumn
            {...this._getColumnProps(
              this.props.rightWrapperProps,
              this.getClassName("right"),
              RIGHT,
              screenSize,
              !width.floatRight
            )}
            width={width.widthRight}
            minWidth={width.minWidthRight}
            maxWidth={width.maxWidthRight}
            openContent={this._getRightContent().open}
            closedContent={this._getRightContent().closed}
            block={!width.floatRight}
            right={true}
            open={this._isRightOpen() && !this._isLeftOpen()}
          />
        </Row>

        {this._getAlertBus()}
        {this._getModal()}
        {this._getPopover()}
      </Wrapper>
    );
  },

  _getType7() {
    let screenSize = this.getScreenSize();
    let width = this._getWidth(screenSize);
    let Wrapper = this._getWrapper();

    return (
      <Wrapper {...this._getPropsToPass()}>
        {this._getAppLayer()}
        {this._getSystemLayer()}

        {this._getAlertBus()}
        {this._getModal()}
        {this._getPopover()}

        <Row display="flex" className={this._getFullPageClass(true) + " " + this.getClassName("IEBottomFix")}>
          <PageColumn
            {...this._getColumnProps(
              this.props.leftWrapperProps,
              this.getClassName("left"),
              LEFT,
              screenSize,
              !width.floatLeft
            )}
            width={width.widthLeft}
            minWidth={width.minWidthLeft}
            maxWidth={width.maxWidthLeft}
            openContent={this._getLeftContent().open}
            closedContent={this._getLeftContent().closed}
            block={!width.floatLeft}
            open={this._isLeftOpen()}
          />
          <Div
            className={this.getClassName("flex") + " " + this.getClassName("flexBasis")}
            ref_={content => (this._pageContent = content)}
          >
            {this._getTop()}
            <Row display="flex" className={this._getFullPageClass()}>
              <Div
                {...this._getColumnProps(
                  this.props.contentWrapperProps,
                  [this.getClassName("content"), this.getClassName("flexGrow"), this.getClassName("flexBasis")],
                  CONTENT
                )}
              >
                {this._getContentDiv()}
              </Div>
              <PageColumn
                {...this._getColumnProps(
                  this.props.rightWrapperProps,
                  this.getClassName("right"),
                  RIGHT,
                  screenSize,
                  !width.floatRight
                )}
                width={width.widthRight}
                minWidth={width.minWidthRight}
                maxWidth={width.maxWidthRight}
                openContent={this._getRightContent().open}
                closedContent={this._getRightContent().closed}
                block={!width.floatRight}
                right={true}
                open={this._isRightOpen() && !this._isLeftOpen()}
              />
              <ResizeObserver onResize={this._onContentResize} />
            </Row>
          </Div>
        </Row>
        {this._getBottom()}
      </Wrapper>
    );
  },

  _getType8() {
    let screenSize = this.getScreenSize();
    let width = this._getWidth(screenSize);
    let Wrapper = this._getWrapper();

    return (
      <Wrapper {...this._getPropsToPass()}>
        {this._getAppLayer()}
        {this._getSystemLayer()}

        {this._getAlertBus()}
        {this._getModal()}
        {this._getPopover()}

        <Row display={"flex"} className={this._getFullPageClass(true) + " " + this.getClassName("IEBottomFix")}>
          <Div className={this.getClassName("flex") + " " + this.getClassName("flexBasis")}>
            {this._getTop()}
            <Row display="flex" style={{ position: "relative" }} className={this._getFullPageClass()}>
              <PageColumn
                {...this._getColumnProps(
                  this.props.leftWrapperProps,
                  this.getClassName("left"),
                  LEFT,
                  screenSize,
                  !width.floatLeft
                )}
                width={width.widthLeft}
                minWidth={width.minWidthLeft}
                maxWidth={width.maxWidthLeft}
                openContent={this._getLeftContent().open}
                closedContent={this._getLeftContent().closed}
                block={!width.floatLeft}
                open={this._isLeftOpen()}
              />
              <Div
                {...this._getColumnProps(
                  this.props.contentWrapperProps,
                  [this.getClassName("content"), this.getClassName("flexBasis"), this.getClassName("flexGrow")],
                  CONTENT
                )}
                ref_={content => (this._pageContent = content)}
              >
                {this._getContentDiv()}
              </Div>
            </Row>
          </Div>
          <PageColumn
            {...this._getColumnProps(
              this.props.rightWrapperProps,
              this.getClassName("right"),
              RIGHT,
              screenSize,
              !width.floatRight
            )}
            width={width.widthRight}
            minWidth={width.minWidthRight}
            maxWidth={width.maxWidthRight}
            openContent={this._getRightContent().open}
            closedContent={this._getRightContent().closed}
            block={!width.floatRight}
            right={true}
            open={this._isRightOpen() && !this._isLeftOpen()}
          />
          <ResizeObserver onResize={this._onContentResize} />
        </Row>
        {this._getBottom()}
      </Wrapper>
    );
  },

  _getType9() {
    let screenSize = this.getScreenSize();
    let width = this._getWidth(screenSize);
    let Wrapper = this._getWrapper();

    return (
      <Wrapper {...this._getPropsToPass()}>
        {this._getAppLayer()}
        {this._getSystemLayer()}

        {this._getAlertBus()}
        {this._getModal()}
        {this._getPopover()}

        <Row display={"flex"} className={this._getFullPageClass(true)}>
          <PageColumn
            {...this._getColumnProps(
              this.props.leftWrapperProps,
              this.getClassName("left"),
              LEFT,
              screenSize,
              !width.floatLeft
            )}
            width={width.widthLeft}
            minWidth={width.minWidthLeft}
            maxWidth={width.maxWidthLeft}
            openContent={this._getLeftContent().open}
            closedContent={this._getLeftContent().closed}
            block={!width.floatLeft}
            open={this._isLeftOpen()}
          />
          <Div
            className={this.getClassName("flex") + " " + this.getClassName("flexBasis")}
            ref_={content => (this._pageContent = content)}
          >
            {this._getTop()}
            <Row display={"flex"} className={this._getFullPageClass() + " " + this.getClassName("IEBottomFix")}>
              <Div
                {...this._getColumnProps(
                  this.props.contentWrapperProps,
                  [this.getClassName("content"), this.getClassName("flexGrow"), this.getClassName("flexBasis")],
                  CONTENT
                )}
              >
                {this._getContentDiv()}
              </Div>
              <PageColumn
                {...this._getColumnProps(
                  this.props.rightWrapperProps,
                  this.getClassName("right"),
                  RIGHT,
                  screenSize,
                  !width.floatRight
                )}
                width={width.widthRight}
                minWidth={width.minWidthRight}
                maxWidth={width.maxWidthRight}
                openContent={this._getRightContent().open}
                closedContent={this._getRightContent().closed}
                block={!width.floatRight}
                right={true}
                open={this._isRightOpen() && !this._isLeftOpen()}
              />
            </Row>
            {this._getBottom()}
          </Div>
          <ResizeObserver onResize={this._onContentResize} />
        </Row>
      </Wrapper>
    );
  },

  _getType10() {
    let screenSize = this.getScreenSize();
    let width = this._getWidth(screenSize);
    let Wrapper = this._getWrapper();

    return (
      <Wrapper {...this._getPropsToPass()}>
        {this._getAppLayer()}
        {this._getSystemLayer()}

        {this._getAlertBus()}
        {this._getModal()}
        {this._getPopover()}

        <Row display={"flex"} className={this._getFullPageClass(true)}>
          <PageColumn
            {...this._getColumnProps(
              this.props.leftWrapperProps,
              this.getClassName("left"),
              LEFT,
              screenSize,
              !width.floatLeft
            )}
            width={width.widthLeft}
            minWidth={width.minWidthLeft}
            maxWidth={width.maxWidthLeft}
            openContent={this._getLeftContent().open}
            closedContent={this._getLeftContent().closed}
            block={!width.floatLeft}
            open={this._isLeftOpen()}
          />
          <Div
            className={this.getClassName("flex") + " " + this.getClassName("flexBasis")}
            ref_={content => (this._pageContent = content)}
          >
            {this._getTop()}
            <Row display={"flex"} className={this._getFullPageClass()}>
              <Div className={this.getClassName("flex") + " " + this.getClassName("flexBasis")}>
                <Row
                  {...this._getColumnProps(
                    this.props.contentWrapperProps,
                    [this.getClassName("content"), this._getFullPageClass(), this.getClassName("IEBottomFix")],
                    CONTENT
                  )}
                >
                  {this._getContentDiv()}
                  <ResizeObserver onResize={this._onContentResize} />
                </Row>
                {this._getBottom()}
              </Div>
              <PageColumn
                {...this._getColumnProps(
                  this.props.rightWrapperProps,
                  this.getClassName("right"),
                  RIGHT,
                  screenSize,
                  !width.floatRight
                )}
                width={width.widthRight}
                minWidth={width.minWidthRight}
                maxWidth={width.maxWidthRight}
                openContent={this._getRightContent().open}
                closedContent={this._getRightContent().closed}
                block={!width.floatRight}
                right={true}
                open={this._isRightOpen() && !this._isLeftOpen()}
              />
            </Row>
          </Div>
        </Row>
      </Wrapper>
    );
  },

  _getType11() {
    let screenSize = this.getScreenSize();
    let width = this._getWidth(screenSize);
    let Wrapper = this._getWrapper();

    return (
      <Wrapper {...this._getPropsToPass()}>
        {this._getAppLayer()}
        {this._getSystemLayer()}

        {this._getAlertBus()}
        {this._getModal()}
        {this._getPopover()}

        <Row display={"flex"} className={this._getFullPageClass(true)}>
          <PageColumn
            {...this._getColumnProps(
              this.props.leftWrapperProps,
              this.getClassName("left"),
              LEFT,
              screenSize,
              !width.floatLeft
            )}
            width={width.widthLeft}
            minWidth={width.minWidthLeft}
            maxWidth={width.maxWidthLeft}
            openContent={this._getLeftContent().open}
            closedContent={this._getLeftContent().closed}
            block={!width.floatLeft}
            open={this._isLeftOpen()}
          />
          <Div
            className={this.getClassName("flex") + " " + this.getClassName("flexBasis")}
            ref_={content => (this._pageContent = content)}
          >
            <Row display={"flex"} className={this._getFullPageClass() + " " + this.getClassName("IEBottomFix")}>
              <Div className={this.getClassName("flex") + " " + this.getClassName("flexBasis")}>
                {this._getTop()}
                <Row
                  {...this._getColumnProps(
                    this.props.contentWrapperProps,
                    [this.getClassName("content"), this._getFullPageClass()],
                    CONTENT
                  )}
                >
                  {this._getContentDiv()}
                </Row>
              </Div>
              <PageColumn
                {...this._getColumnProps(
                  this.props.rightWrapperProps,
                  this.getClassName("right"),
                  RIGHT,
                  screenSize,
                  !width.floatRight
                )}
                width={width.widthRight}
                minWidth={width.minWidthRight}
                maxWidth={width.maxWidthRight}
                openContent={this._getRightContent().open}
                closedContent={this._getRightContent().closed}
                block={!width.floatRight}
                right={true}
                open={this._isRightOpen() && !this._isLeftOpen()}
              />
              <ResizeObserver onResize={this._onContentResize} />
            </Row>
            {this._getBottom()}
          </Div>
        </Row>
      </Wrapper>
    );
  },

  _getType12() {
    let screenSize = this.getScreenSize();
    let width = this._getWidth(screenSize);
    let Wrapper = this._getWrapper();

    return (
      <Wrapper {...this._getPropsToPass()}>
        {this._getAppLayer()}
        {this._getSystemLayer()}

        {this._getAlertBus()}
        {this._getModal()}
        {this._getPopover()}

        <Row display={"flex"} className={this._getFullPageClass(true)}>
          <Div className={this.getClassName("flex") + " " + this.getClassName("flexBasis")}>
            {this._getTop()}
            <Row
              display={"flex"}
              style={{ position: "relative" }}
              className={this._getFullPageClass() + " " + this.getClassName("IEBottomFix")}
            >
              <PageColumn
                {...this._getColumnProps(
                  this.props.leftWrapperProps,
                  this.getClassName("left"),
                  LEFT,
                  screenSize,
                  !width.floatLeft
                )}
                width={width.widthLeft}
                minWidth={width.minWidthLeft}
                maxWidth={width.maxWidthLeft}
                openContent={this._getLeftContent().open}
                closedContent={this._getLeftContent().closed}
                block={!width.floatLeft}
                open={this._isLeftOpen()}
              />
              <Div
                {...this._getColumnProps(
                  this.props.contentWrapperProps,
                  [this.getClassName("content"), this._getFullPageClass(), this.getClassName("flexBasis")],
                  CONTENT
                )}
                ref_={content => (this._pageContent = content)}
              >
                {this._getContentDiv()}
              </Div>
              <ResizeObserver onResize={this._onContentResize} />
            </Row>
            {this._getBottom()}
          </Div>
          <PageColumn
            {...this._getColumnProps(
              this.props.rightWrapperProps,
              this.getClassName("right"),
              RIGHT,
              screenSize,
              !width.floatRight
            )}
            width={width.widthRight}
            minWidth={width.minWidthRight}
            maxWidth={width.maxWidthRight}
            openContent={this._getRightContent().open}
            closedContent={this._getRightContent().closed}
            block={!width.floatRight}
            right={true}
            open={this._isRightOpen() && !this._isLeftOpen()}
          />
        </Row>
      </Wrapper>
    );
  },

  _getType13() {
    let screenSize = this.getScreenSize();
    let width = this._getWidth(screenSize);
    let Wrapper = this._getWrapper();

    return (
      <Wrapper {...this._getPropsToPass()}>
        {this._getAppLayer()}
        {this._getSystemLayer()}

        {this._getAlertBus()}
        {this._getModal()}
        {this._getPopover()}

        <Row display={"flex"} className={this._getFullPageClass(true)}>
          <Div className={this.getClassName("flex") + " " + this.getClassName("flexBasis")}>
            {this._getTop()}
            <Row display={"flex"} style={{ position: "relative" }} className={this._getFullPageClass()}>
              <PageColumn
                {...this._getColumnProps(
                  this.props.leftWrapperProps,
                  this.getClassName("left"),
                  LEFT,
                  screenSize,
                  !width.floatLeft
                )}
                width={width.widthLeft}
                minWidth={width.minWidthLeft}
                maxWidth={width.maxWidthLeft}
                openContent={this._getLeftContent().open}
                closedContent={this._getLeftContent().closed}
                block={!width.floatLeft}
                open={this._isLeftOpen()}
              />
              <Div
                className={this.getClassName("flex") + " " + this.getClassName("flexBasis")}
                ref_={content => (this._pageContent = content)}
              >
                <Row
                  {...this._getColumnProps(
                    this.props.contentWrapperProps,
                    [this.getClassName("content"), this._getFullPageClass(), this.getClassName("IEBottomFix")],
                    CONTENT
                  )}
                >
                  {this._getContentDiv()}
                  <ResizeObserver onResize={this._onContentResize} />
                </Row>
                {this._getBottom()}
              </Div>
            </Row>
          </Div>
          <PageColumn
            {...this._getColumnProps(
              this.props.rightWrapperProps,
              this.getClassName("right"),
              RIGHT,
              screenSize,
              !width.floatRight
            )}
            width={width.widthRight}
            minWidth={width.minWidthRight}
            maxWidth={width.maxWidthRight}
            openContent={this._getRightContent().open}
            closedContent={this._getRightContent().closed}
            block={!width.floatRight}
            right={true}
            open={this._isRightOpen() && !this._isLeftOpen()}
          />
        </Row>
      </Wrapper>
    );
  },

  _getType14() {
    let screenSize = this.getScreenSize();
    let width = this._getWidth(screenSize);
    let Wrapper = this._getWrapper();

    return (
      <Wrapper {...this._getPropsToPass()}>
        {this._getAppLayer()}
        {this._getSystemLayer()}

        {this._getAlertBus()}
        {this._getModal()}
        {this._getPopover()}

        <Row display={"flex"} className={this._getFullPageClass(true)}>
          <Div className={this.getClassName("flex") + " " + this.getClassName("flexBasis")}>
            <Row
              display={"flex"}
              style={{ position: "relative" }}
              className={this._getFullPageClass() + " " + this.getClassName("IEBottomFix")}
            >
              <PageColumn
                {...this._getColumnProps(
                  this.props.leftWrapperProps,
                  this.getClassName("left"),
                  LEFT,
                  screenSize,
                  !width.floatLeft
                )}
                width={width.widthLeft}
                minWidth={width.minWidthLeft}
                maxWidth={width.maxWidthLeft}
                openContent={this._getLeftContent().open}
                closedContent={this._getLeftContent().closed}
                block={!width.floatLeft}
                open={this._isLeftOpen()}
              />
              <Div
                className={this.getClassName("flex") + " " + this.getClassName("flexBasis")}
                ref_={content => (this._pageContent = content)}
              >
                {this._getTop()}
                <Row
                  {...this._getColumnProps(
                    this.props.contentWrapperProps,
                    [this.getClassName("content"), this._getFullPageClass()],
                    CONTENT
                  )}
                >
                  {this._getContentDiv()}
                </Row>
              </Div>
              <ResizeObserver onResize={this._onContentResize} />
            </Row>
            {this._getBottom()}
          </Div>
          <PageColumn
            {...this._getColumnProps(
              this.props.rightWrapperProps,
              this.getClassName("right"),
              RIGHT,
              screenSize,
              !width.floatRight
            )}
            width={width.widthRight}
            minWidth={width.minWidthRight}
            maxWidth={width.maxWidthRight}
            openContent={this._getRightContent().open}
            closedContent={this._getRightContent().closed}
            block={!width.floatRight}
            right={true}
            open={this._isRightOpen() && !this._isLeftOpen()}
          />
        </Row>
      </Wrapper>
    );
  },

  _getPageByType() {
    let result;
    switch (this.props.type.toString()) {
      case "0":
        result = this._getType0();
        break;
      case "1":
        result = this._getType1();
        break;
      case "2":
        result = this._getType2();
        break;
      case "3":
        result = this._getType3();
        break;
      case "4":
        result = this._getType4();
        break;
      case "5":
        result = this._getType5();
        break;
      case "6":
        result = this._getType6();
        break;
      case "7":
        result = this._getType7();
        break;
      case "8":
        result = this._getType8();
        break;
      case "9":
        result = this._getType9();
        break;
      case "10":
        result = this._getType10();
        break;
      case "11":
        result = this._getType11();
        break;
      case "12":
        result = this._getType12();
        break;
      case "13":
        result = this._getType13();
        break;
      case "14":
        result = this._getType14();
        break;
    }

    if (this.props.useDnD) result = <UU5.Common.DnD.Provider>{result}</UU5.Common.DnD.Provider>;
    result = (
      <UU5.Bricks.Popover.Context.Provider value={this.state.popoverProviderValue}>
        {result}
      </UU5.Bricks.Popover.Context.Provider>
    );
    return result;
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    let result = this.getNestingLevel() ? this._getPageByType() : null;
    this._preventContentRender = false;
    return result;
  }
  //@@viewOff:render
});

Page.MenuButton = MenuButton;
export default Page;
