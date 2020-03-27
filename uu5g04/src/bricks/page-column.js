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

import Button from "../bricks/button.js";
import Icon from "./icon.js";
import Column from "../bricks/column.js";
import Backdrop from "../bricks/backdrop.js";
import UpdateWrapper from "./update-wrapper.js";
import ScrollArea from "./scroll-area.js";
import Css from "./internal/css.js";

import "./page-column.less";
//@@viewOff:imports

function isResizable(props, state) {
  if (typeof props.resizable === "boolean") {
    return props.resizable;
  } else if (props.resizable === "open" && state.open) {
    return true;
  } else if (props.resizable === "closed" && !state.open) {
    return true;
  } else {
    return false;
  }
}

export const PageColumn = UU5.Common.VisualComponent.create({
  displayName: "PageColumn", // for backward compatibility (test snapshots)
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin, UU5.Common.PureRenderMixin, UU5.Common.ElementaryMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("Page.Column"),
    classNames: {
      main: ns.css("page-column"),
      backdrop: ns.css("page-column-backdrop"),
      wrapper: ns.css("page-column-wrapper"),
      float: ns.css("page-column-float"),
      buttonWrapper: ns.css("page-column-button-wrapper"),
      buttonOpen: ns.css("page-column-button-open"),
      buttonClose: ns.css("page-column-button-close"),
      open: ns.css("page-column-open"),
      elevation: "uu5-elevation-",
      zIndex: ns.css("page-z-index-"),
      fixed: ns.css("page-column-fixed"),
      topFixed: ns.css("page-column-top-fixed"),
      bottomFixed: ns.css("page-column-bottom-fixed"),
      ghost: ns.css("page-column-ghost"),
      animateTop: ns.css("page-column-animate-top"),
      animateBottom: ns.css("page-column-animate-bottom"),
      draggable: ns.css("page-column-draggable"),
      resizing: ns.css("page-column-resizing"),
      relative: (props, state) => {
        return Css.css`
          && {
            box-shadow: none;
            border-${props.right ? "left" : "right"}: 1px solid rgba(33, 33, 33, 0.12)
          }`;
      }
    },
    errors: {
      invalidParent: "Parent of this component is not Page."
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    width: UU5.PropTypes.oneOfType([UU5.PropTypes.string, UU5.PropTypes.number]),
    right: UU5.PropTypes.bool,
    button: UU5.PropTypes.bool,
    open: UU5.PropTypes.bool,
    block: UU5.PropTypes.bool,
    openContent: UU5.PropTypes.any,
    closedContent: UU5.PropTypes.any,
    elevation: UU5.PropTypes.number,
    topId: UU5.PropTypes.string,
    fixed: UU5.PropTypes.bool,
    topFixed: UU5.PropTypes.bool,
    topFixedHeight: UU5.PropTypes.number,
    bottomFixed: UU5.PropTypes.bool,
    bottomFixedHeight: UU5.PropTypes.number,
    overlayTop: UU5.PropTypes.bool,
    overlayBottom: UU5.PropTypes.bool,
    relative: UU5.PropTypes.bool,
    resizable: UU5.PropTypes.oneOfType([UU5.PropTypes.bool, UU5.PropTypes.oneOf(["open", "closed"])]),
    minResizableWidth: UU5.PropTypes.oneOfType([UU5.PropTypes.string, UU5.PropTypes.number]),
    maxResizableWidth: UU5.PropTypes.oneOfType([UU5.PropTypes.string, UU5.PropTypes.number]),
    onUpdate: UU5.PropTypes.func,
    onResize: UU5.PropTypes.func,
    showToggleButton: UU5.PropTypes.bool
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      width: null,
      minWidth: null,
      maxWidth: null,
      right: false,
      button: false,
      open: false,
      block: false,
      openContent: null,
      closedContent: null,
      elevation: 0,
      topId: null,
      bottomId: null,
      contentId: null,
      fixed: false,
      topFixed: false,
      topFixedHeight: 0,
      bottomFixed: false,
      bottomFixedHeight: 0,
      overlayTop: false,
      overlayBottom: false,
      relative: false,
      resizable: false,
      minResizableWidth: undefined,
      maxResizableWidth: undefined,
      onUpdate: null,
      onResize: null,
      topOverlaysContent: false,
      showToggleButton: false
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  getInitialState() {
    let width = this._getWidth(this.props, undefined, this.props.open);
    let ghostWidth = this._getGhostWidth(this.props, this.props.open, width);
    this._prevWidth = width;

    return {
      style: { marginTop: null, marginBottom: null },
      open: this.props.open,
      topHidden: false,
      bottomHidden: false,
      topFixed: this.props.topOverlaysContent,
      bottomFixed: this.props.bottomFixed,
      topHeight: null,
      bottomHeight: null,
      animateTop: false,
      animateBottom: false,
      width,
      ghostWidth,
      resizing: false
    };
  },

  componentWillReceiveProps(nextProps) {
    let isOpen = nextProps.open !== this.props.open ? nextProps.open : this.isOpen();
    let width = this._getWidth(nextProps);
    let ghostWidth = this._getGhostWidth(nextProps, isOpen, width);
    if (nextProps.controlled) {
      this._prevWidth = width;
      this.setState({ open: nextProps.block || nextProps.open, width, ghostWidth });
    } else if (
      nextProps.minWidth !== this.props.minWidth ||
      nextProps.maxWidth !== this.props.maxWidth ||
      nextProps.width !== this.props.width
    ) {
      this.setState({ width, ghostWidth });
    }

    UU5.Environment.EventListener.triggerEvent(
      "pageColumn",
      this.props.right ? "right" : "left",
      nextProps.minWidth || nextProps.maxWidth
    );
  },

  componentWillMount() {
    if (!this.getParentByType("isPage")) {
      this.showError("invalidParent");
    }
  },

  componentDidMount() {
    if (this._hasContent()) this._getPageElements(this.props);

    if (this.props.fixed) {
      if (this._hasContent()) this._adjustFixedPosition();
      this._registerStandardEvents();
      UU5.Environment.EventListener.registerEvent("hidePageTop", this.getId(), this._onHidePageTop);
      UU5.Environment.EventListener.registerEvent("fixPageTop", this.getId(), this._onFixPageTop);
      UU5.Environment.EventListener.registerEvent("changePageTopHeight", this.getId(), this._onChangePageTopHeight);

      UU5.Environment.EventListener.registerEvent("hidePageBottom", this.getId(), this._onHidePageBottom);
      UU5.Environment.EventListener.registerEvent("fixPageBottom", this.getId(), this._onFixPageBottom);
      UU5.Environment.EventListener.registerEvent(
        "changePageBottomHeight",
        this.getId(),
        this._onChangePageBottomHeight
      );
    }
  },

  componentWillUnmount() {
    if (this.props.fixed) {
      this._unregisterStandardEvents();
      UU5.Environment.EventListener.unregisterEvent("hidePageTop", this.getId());
      UU5.Environment.EventListener.unregisterEvent("fixPageTop", this.getId());
      UU5.Environment.EventListener.unregisterEvent("changePageTopHeight", this.getId());

      UU5.Environment.EventListener.unregisterEvent("hidePageBottom", this.getId());
      UU5.Environment.EventListener.unregisterEvent("fixPageBottom", this.getId());
      UU5.Environment.EventListener.unregisterEvent("changePageBottomHeight", this.getId());
    }

    if (this._rafId) {
      cancelAnimationFrame(this._rafId);
    }
  },

  componentDidUpdate(prevProps, prevState) {
    if (this._hasContent()) {
      this._getPageElements(this.props);

      this._adjustFixedPosition();
      if (prevState.open !== this.state.open) {
        // TODO REMOVE
        let animationLength = 300;
        let start = null;
        let bottomVisibility = this._getBottomVisibility();
        let animationStep = timestamp => {
          if (!start) {
            start = timestamp;
            UU5.Environment.EventListener.triggerEvent("preventScrollTrigger", true);
          }
          let newBottomVisibility = this._getBottomVisibility();
          if (bottomVisibility !== newBottomVisibility) {
            bottomVisibility = newBottomVisibility;
            this._preventContentRender = true;
            if (this.props.fixed) {
              this._adjustFixedPosition();
            }
          }
          let progress = timestamp - start;
          if (progress < animationLength) {
            UU5.Environment.EventListener.triggerEvent("pageColumnChanged");
            this._rafId = window.requestAnimationFrame(animationStep);
          }
        };

        this._rafId = window.requestAnimationFrame(animationStep);
      }
    }
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  isFloat() {
    return this.props.minWidth || this.props.maxWidth;
  },

  open(setStateCallback) {
    if (!this.props.block) {
      setStateCallback = this.props.parent._swiper
        ? () => this.props.parent._swiper[this.props.right ? "openRightMenu" : "openLeftMenu"](setStateCallback)
        : setStateCallback;
      this.setState(
        {
          open: true,
          width: this._getWidth(this.props, null, true),
          ghostWidth: this._getGhostWidth(this.props, true)
        },
        setStateCallback
      );
    } else if (typeof setStateCallback === "function") {
      setStateCallback();
    }

    return this;
  },

  close(setStateCallback) {
    if (!this.props.block) {
      setStateCallback = this.props.parent._swiper
        ? () => this.props.parent._swiper[this.props.right ? "closeRightMenu" : "closeLeftMenu"](setStateCallback)
        : setStateCallback;
      this.setState(
        {
          open: false,
          width: this._getWidth(this.props, null, false),
          ghostWidth: this._getGhostWidth(this.props, false)
        },
        setStateCallback
      );
    } else if (typeof setStateCallback === "function") {
      setStateCallback();
    }

    return this;
  },

  toggle(setStateCallback) {
    !this.props.block && (this.state.open ? this.close(setStateCallback) : this.open(setStateCallback));
    return this;
  },

  isOpen() {
    return !(this.props.width == "0%" && this.props.minWidth == "0%") && this.state.open;
  },
  //@@viewOff:interface

  //@@viewOn:overriding
  shouldComponentUpdate_(nextProps, nextState) {
    let shouldUpdate = this.shouldComponentUpdateDefault(nextProps, nextState);

    if (!shouldUpdate) {
      this._preventContentRender = false;
    }

    return shouldUpdate;
  },
  //@@viewOff:overriding

  //@@viewOn:private
  _registerStandardEvents() {
    UU5.Environment.EventListener.addWindowEvent("scroll", this.getId(), this._onEvent);
    UU5.Environment.EventListener.addWindowEvent("wheel", this.getId(), this._onEvent);
    UU5.Environment.EventListener.addWindowEvent("DOMMouseScroll", this.getId(), this._onEvent);
    UU5.Environment.EventListener.addWindowEvent("mousewheel", this.getId(), this._onEvent);
    UU5.Environment.EventListener.addWindowEvent("resize", this.getId(), this._onEvent);
  },

  _unregisterStandardEvents() {
    UU5.Environment.EventListener.removeWindowEvent("scroll", this.getId());
    UU5.Environment.EventListener.removeWindowEvent("wheel", this.getId());
    UU5.Environment.EventListener.removeWindowEvent("DOMMouseScroll", this.getId());
    UU5.Environment.EventListener.removeWindowEvent("mousewheel", this.getId());
    UU5.Environment.EventListener.removeWindowEvent("resize", this.getId());
  },

  _unregisterDragEvents() {
    UU5.Environment.EventListener.removeWindowEvent("mouseup", this.getId());
    UU5.Environment.EventListener.removeWindowEvent("mousemove", this.getId());
    UU5.Environment.EventListener.removeWindowEvent("touchend", this.getId());
    UU5.Environment.EventListener.removeWindowEvent("touchmove", this.getId());
  },

  _onUpdate() {
    if (typeof this.props.onUpdate === "function" && (this.props.relative || this.props.fixed)) {
      let width = this.isOpen() ? this.props.maxWidth || this.props.width : this.props.minWidth;
      this.props.onUpdate(width);
    }
  },

  _onHidePageTop(hidden, height) {
    this.setState({ topHidden: hidden, topHeight: hidden ? 0 : height });
  },

  _onFixPageTop(fixed, height) {
    this.setState(state => {
      return { topFixed: fixed, topHeight: height, animateTop: state.animate && fixed ? true : false };
    });
  },

  _onChangePageTopHeight(height) {
    this.setState({ topHeight: height });
  },

  _onHidePageBottom(hidden, height) {
    this.setState({ bottomHidden: hidden, bottomHeight: height });
  },

  _onFixPageBottom(fixed, height) {
    this.setState(state => {
      return { bottomFixed: fixed, bottomHeight: height, animateBottom: state.animate && fixed ? true : false };
    });
  },

  _onChangePageBottomHeight(height) {
    this.setState({ bottomHeight: height });
  },

  _onPressToggleButton() {
    this.toggle();
  },

  _getToggleButton() {
    let result = null;

    if (this.props.showToggleButton) {
      let icon;

      if (this.isOpen()) icon = this.props.right ? "mdi-chevron-right" : "mdi-chevron-left";
      else icon = this.props.right ? "mdi-chevron-left" : "mdi-chevron-right";

      let transformXFirst = "0vw";
      let transformXSecond = (this.props.right ? `-` : `+`) + (this.isOpen() ? `50%` : `100%`);

      if (!this.isOpen()) {
        let hasClosedWidth = !!(this.props.minWidth && this.props.maxWidth);
        if (!hasClosedWidth) {
          transformXFirst = this.props.right ? this.state.width : `-${this.state.width}`;
        }
      }
      let showOnHover = this.isOpen() && !UU5.Common.Tools.isMobileOrTablet && !UU5.Common.Tools.isMobileIOS();

      let buttonStyle = Css.css`
        && {
          position: absolute;
          top: 50%;
          ${this.props.right ? "left: 0" : "right: 0"};
          transform: translateY(-50%) translateX(${transformXFirst}) translateX(${transformXSecond});
          visibility: ${showOnHover ? "hidden" : "visible"};
          transition: transform 0.3s linear;
          width: 24px;
          height: 24px;
          // border: solid 1px rgba(33,33,33,0.12);
          border-radius: 4px;
        }
        ${showOnHover &&
          `
          .uu5-bricks-page-column-wrapper:hover &,
          &:hover {
            visibility: visible;
          }
        `}
      `;

      buttonStyle += " " + this.getClassName("zIndex") + this.props.elevation;

      result = (
        <UU5.Bricks.Button
          key="toggle-button"
          onClick={this._onPressToggleButton}
          content={<UU5.Bricks.Icon icon={icon} />}
          className={buttonStyle}
          colorSchema="primary"
          bgStyle="filled"
          size="s"
        />
      );
    }

    return result;
  },

  _getPageElements(props) {
    this._pageTop = document.getElementById(props.topId);
    this._pageBottom = document.getElementById(props.bottomId);
    this._pageContent = document.getElementById(props.contentId);
    this._domNode =
      this._columnRef === undefined || this._columnRef instanceof HTMLElement
        ? this._columnRef
        : this._columnRef.findDOMNode();
    return this;
  },

  _hasContent() {
    return this.props.openContent && this.props.closedContent;
  },

  _shouldChangeWidth(props = this.props) {
    return parseInt(props.minWidth);
  },

  _adjustFixedPosition() {
    let offsetTop = 0;
    let offsetBottom = 0;
    let newState = { style: {} };

    if (this.props.fixed) {
      (!this.state.topHidden || this.props.topFixedHeight) && (offsetTop = this._getTopVisibility());
      (!this.state.bottomHidden || this.props.bottomFixedHeight) && (offsetBottom = this._getBottomVisibility());

      if (typeof offsetTop === "number" && this.props.overlayTop) {
        newState.style.marginTop = offsetTop + "px";
      } else offsetTop = 0;

      if (typeof offsetBottom === "number" && this.props.overlayBottom) {
        newState.style.marginBottom = offsetBottom + "px";
      } else offsetBottom = 0;
    }

    let oldState = { ...this.state };

    this.setState(
      state => {
        if (UU5.Common.Tools.deepEqual(newState.style, state.style)) {
          this._preventContentRender = false;
          return undefined;
        } else {
          return { ...newState };
        }
      },
      () => this._applyAnimations(newState.style, oldState)
    );

    return this;
  },

  _applyAnimations(newStyle) {
    let newMarginTop = parseInt(newStyle.marginTop || 0);
    let newMarginBottom = parseInt(newStyle.marginBottom || 0);
    let newState = {};

    if ((newMarginTop <= this.props.topFixedHeight || this.state.topHidden) && this.state.topFixed) {
      newState.animateTop = true;
    }

    if ((newMarginBottom <= this.props.bottomFixedHeight || this.state.bottomHidden) && this.state.bottomFixed) {
      newState.animateBottom = true;
    }

    if (newState.hasOwnProperty("animateTop") || newState.hasOwnProperty("animateBottom")) {
      this.setState({ ...newState });
    }
  },

  _getTopVisibility() {
    let result = 0;
    if (this._pageTop) {
      let rect = this._pageTop.getBoundingClientRect();
      let autoDetect = rect.height + rect.top;
      let top = this.state.topFixed ? this.state.topHeight || autoDetect : autoDetect;
      if (top > 0) {
        result = top;
      }
    }

    return result;
  },

  _getBottomVisibility() {
    let result = 0;
    if (this._pageBottom) {
      let rect = this._pageBottom.getBoundingClientRect();
      let autoDetect = window.innerHeight - rect.top;
      let top = this.state.bottomFixed ? this.state.bottomHeight || autoDetect : autoDetect;
      if (top > 0) {
        result = top;
      }
    }
    return result;
  },

  _onEvent() {
    if (this._hasContent()) {
      this._adjustFixedPosition();
      this._preventContentRender = true;
    }

    return this;
  },

  _onDragMouseDown(e) {
    e.preventDefault();
    e.stopPropagation();

    this._prevWidth =
      (this._columnRef === undefined || this._columnRef instanceof HTMLElement
        ? this._columnRef
        : this._columnRef.findDOMNode()
      ).getBoundingClientRect().width + "px";

    UU5.Environment.EventListener.addWindowEvent("mouseup", this.getId(), this._onDragMouseUp);
    UU5.Environment.EventListener.addWindowEvent("mousemove", this.getId(), this._onDrag);

    UU5.Environment.EventListener.addWindowEvent("touchend", this.getId(), this._onDragMouseUp);
    UU5.Environment.EventListener.addWindowEvent("touchmove", this.getId(), this._onDrag);

    this._resized = false;
    this._preventContentRender = true;
    this.setState({ resizing: true });
    UU5.Environment.EventListener.triggerEvent("preventScrollTrigger", true);
  },

  _onDragMouseUp(e) {
    e.preventDefault();
    e.stopPropagation();
    this._unregisterDragEvents();

    this._preventContentRender = true;
    if (this._resized) {
      this.setState({ resizing: false }, () =>
        this.props.onResize(e, this._prevWidth, this.state.width, this.props.right)
      );
      this._resized = false;
    } else {
      this.setState({ resizing: false });
    }
    UU5.Environment.EventListener.triggerEvent("preventScrollTrigger", false);
  },

  _onDrag(e) {
    e.preventDefault();
    e.stopPropagation();
    let pos = e.touches !== undefined ? e.touches[0].clientX : e.clientX;
    let newWidth = pos;

    if (this.props.right) {
      let docWidth = document.documentElement.getBoundingClientRect().width;
      newWidth = docWidth - newWidth;
    }

    // those 5 pixels are because of changing the cursor to the "resize" one, which is wider and the mouse position is counted from the left side of the cursor.
    newWidth += 5;

    if (
      (!this.props.maxResizableWidth || newWidth <= parseFloat(this.props.maxResizableWidth)) &&
      (!this.props.minResizableWidth || newWidth >= parseFloat(this.props.minResizableWidth))
    ) {
      let ghostWidth = this._getGhostWidth(this.props, this.isOpen(), newWidth);

      this._resized = true;
      this._preventContentRender = true;
      this.setState({ width: newWidth + "px", ghostWidth }, () =>
        UU5.Environment.EventListener.triggerEvent("pageColumnChanged")
      );
    }
  },

  _getDynamicStyles(isWrapper, isGhost) {
    let visibilityTransitions = "0.3s linear visibility",
      transformTransitions = "0.3s linear transform",
      widthTransitions = "",
      marginTransitions = "",
      heightTransitions = "",
      visibility = "",
      transform = "";

    if (isGhost) {
      if (this.state.resizing) {
        widthTransitions = "0s linear width, 0s linear max-width";
      } else {
        widthTransitions = "0.3s linear width, 0.3s linear max-width";
      }
    } else {
      if (isWrapper) {
        if (this.state.bottomFixed && this.state.animateBottom) {
          marginTransitions = (marginTransitions ? marginTransitions + ", " : "") + "0.3s ease margin-bottom";
          if (this.props.fixed) {
            heightTransitions = "0.3s ease height";
          }
        }

        if (!this.props.minWidth && !this.state.open) {
          visibility = "hidden";
        } else {
          visibility = "visible";
        }
      } else {
        if (!this.props.minWidth && !this.state.open) {
          transform = this.props.right ? "translateX(100%)" : "translateX(-100%)";
        } else {
          transform = "none";
        }
      }

      if (isWrapper || this.props.block) {
        if (this.state.topFixed && this.props.fixed && this.state.animateTop) {
          marginTransitions = "0.3s ease margin-top";
          heightTransitions = "0.3s ease height";
        }

        if (this.state.bottomFixed && this.props.fixed && this.state.animateBottom) {
          marginTransitions = marginTransitions
            ? marginTransitions + ", 0.3s ease margin-bottom"
            : "0.3s ease margin-bottom";
          heightTransitions = "0.3s ease height";
        }
      }

      if (this.state.resizing) {
        widthTransitions = "0s linear width, 0s linear max-width";
      } else {
        widthTransitions = "0.3s linear width, 0.3s linear max-width";
      }
    }

    let buildTransitionRule = (...args) => {
      let resultRule = "";

      let separate = false;
      args.forEach(rule => {
        if (rule) {
          resultRule += (separate ? ", " : "") + rule;
          separate = true;
        }
      });

      return resultRule;
    };

    let styles = `
      & {
        transition: ${buildTransitionRule(
          transformTransitions,
          visibilityTransitions,
          widthTransitions,
          marginTransitions,
          heightTransitions
        )};
        transform: ${transform};
      }

      & {
        visibility: ${visibility};
      }
    `;

    return Css.css`${styles}`;
  },

  _getWidth(props = this.props, width, open) {
    // If column width is set to percentage value, it is not possible to set the same width on the ghost element
    // because the column (since its fixed) always has its width calculated towards the width of the whole document.
    // Therefore we change % to vw
    if (!width) {
      if (!props.block && (props.minWidth || props.maxWidth)) {
        // its openable

        if ((typeof open === "boolean" && open) || (typeof open !== "boolean" && this.state && this.state.open)) {
          // it's opened
          width = props.maxWidth || "0px";
        } else {
          // it's closed
          width = props.minWidth || "0px";
        }
      } else {
        width = props.minWidth || props.width || "0px";
      }
    }

    if (width) {
      if (typeof width === "string") {
        if (this.props.fixed || this.props.relative) {
          let number = parseInt(width);
          let unit = width.replace(/[0-9]/g, "");
          width = number + (unit === "%" ? "vw" : unit);
        }
      } else {
        width = width + "px";
      }
    }

    return width;
  },

  _getGhostWidth(props = this.props, isOpen, newWidth) {
    if (typeof isOpen === "boolean") {
      // isOpen = isOpen;
    } else {
      isOpen = props.open;
    }

    let width;

    if (props.relative) {
      if (props.minWidth && props.maxWidth) {
        if (isOpen) {
          width = newWidth || props.maxWidth;
        } else {
          width = newWidth || props.minWidth;
        }
      } else {
        if (isOpen) {
          width = newWidth || props.maxWidth;
        } else {
          width = "0px";
        }
      }
    } else {
      if (props.minWidth && props.maxWidth) {
        if (this.props.relative) {
          if (isOpen) {
            width = newWidth || props.maxWidth;
          } else {
            width = newWidth || props.minWidth;
          }
        } else {
          if (isOpen) {
            width = props.minWidth;
          } else {
            width = newWidth || props.minWidth;
          }
        }
      } else {
        width = "0px";
      }
    }

    return this._getWidth(this.props, width);
  },

  _getWrapperProps() {
    let attrs = {};
    let className = this.getClassName("wrapper");
    let style = UU5.Common.Tools.merge(this.state.style, { width: this.state.width });

    style = UU5.Common.Tools.merge(style, { right: this.props.right ? 0 : "auto" });

    if (!this.props.block && this.state.open) {
      className += " " + this.getClassName("open");
    }

    if (this.props.elevation) {
      className += " " + this.getClassName("zIndex") + this.props.elevation;
    }

    if (this.props.fixed) {
      className += " " + this.getClassName("fixed");
    }

    className += " " + this._getDynamicStyles(true);

    /* These classes are added only because of backward compatibility */

    if (this.state.topFixed) {
      className += " " + this.getClassName("topFixed");
    }

    if (this.state.bottomFixed) {
      className += " " + this.getClassName("bottomFixed");
    }

    if (this.state.animateTop) {
      className += " " + this.getClassName("animateTop");
    }

    if (this.state.animateBottom) {
      className += " " + this.getClassName("animateBottom");
    }

    if (this.state.resizing) {
      className += " " + this.getClassName("resizing");
    }

    /******************************************************************/

    attrs.onTransitionEnd = () => {
      UU5.Environment.EventListener.triggerEvent("preventScrollTrigger", false);
      UU5.Environment.EventListener.triggerEvent("pageColumnChanged");
    };
    attrs.className = className;
    attrs.style = style;

    return attrs;
  },

  _getMainProps(getStyles) {
    let props = this.getMainPropsToPass();
    props.style = props.style || {};
    if (getStyles) {
      props.style = UU5.Common.Tools.merge(props.style || {}, this.state.style, { width: this.state.width });
    } else {
      props.style && (props.style.marginTop = null);
      if (this.props.fixed) {
        props.style.width = this.state.width;
      }
    }

    props.id = this.getId();
    props.pureRender = true;

    if (!this.props.block && this.state.open) {
      props.className += " " + this.getClassName().open + " " + this.getClassName("elevation") + this.props.elevation;
    }

    if (this.props.elevation) {
      props.className += " " + this.getClassName("zIndex") + this.props.elevation;
    }

    if (!this.props.block) {
      props.className += " " + this.getClassName().float;
    }

    if (this.props.relative) {
      props.className += " " + this.getClassName("relative");
    }

    props.mainAttrs = {
      onTransitionEnd: () => {
        UU5.Environment.EventListener.triggerEvent("preventScrollTrigger", false);
        UU5.Environment.EventListener.triggerEvent("pageColumnChanged");
      }
    };

    if (this.props.block && this.props.fixed) {
      props.className += " " + this.getClassName("fixed");
    }

    props.className += " " + this._getDynamicStyles(false);

    /* These classes are added only because of backward compatibility */

    if (getStyles && this.state.topFixed) {
      props.className += " " + this.getClassName("topFixed");
    }

    if (getStyles && this.state.bottomFixed) {
      props.className += " " + this.getClassName("bottomFixed");
    }

    if (getStyles && this.state.animateTop) {
      props.className += " " + this.getClassName("animateTop");
    }

    if (getStyles && this.state.animateBottom) {
      props.className += " " + this.getClassName("animateBottom");
    }

    if (getStyles && this.state.resizing) {
      props.className += " " + this.getClassName("resizing");
    }

    /******************************************************************/

    return props;
  },

  _getWrapperGhostProps() {
    let className = this.getClassName("wrapper") + " " + this.getClassName("ghost");

    if (this.state.resizing) {
      className += " " + this.getClassName("resizing");
    }

    className += " " + this._getDynamicStyles(false, true);

    let maxWidth = this.state.ghostWidth;

    return {
      className,
      style: { width: this.state.ghostWidth, maxWidth, right: this.props.right ? 0 : "auto" }
    };
  },

  _getMainGhostProps(getStyles) {
    let props = this.getMainPropsToPass();
    let maxWidth = this.state.width;

    let style = getStyles
      ? UU5.Common.Tools.merge(props.style || {}, this.state.style, {
          width: this.state.width,
          maxWidth
        })
      : {};

    // bottom and top margins destroys column layout. Ghoust is needed only to reflect width of the column, not height
    if (getStyles) {
      delete style.marginTop;
      delete style.marginBottom;
    }

    props.id = this.getId();
    props.pureRender = true;

    if (!this.props.block && this.state.open) {
      props.className += " " + this.getClassName().open;
    }

    if (!this.props.block) {
      props.className += " " + this.getClassName().float;
    }

    /* These classes are added only because of backward compatibility */

    if (this.state.resizing) {
      props.className += " " + this.getClassName("resizing");
    }

    /******************************************************************/

    props.className += " " + this.getClassName("ghost");
    props.style = style;

    return props;
  },

  _getBackdropProps() {
    let backdropId = this.getId() + "-backdrop";
    let style = { zIndex: this.props.elevation };

    if (this.props.right && this.props.fixed) {
      style.left = "calc(-100vw + " + this.state.width + ")";
    }

    return {
      className: this.getClassName("backdrop"),
      hidden: !this.isOpen(),
      id: backdropId,
      style: style,
      onClick: (backdrop, event) => {
        event.target.id === backdropId && this.close();
      }
    };
  },

  _getDragElement() {
    return isResizable(this.props, this.state) ? (
      <div
        onMouseDown={this._onDragMouseDown}
        onTouchStart={this._onDragMouseDown}
        className={this.getClassName("draggable")}
      />
    ) : null;
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    let left = (
      <div>
        <Button content={<Icon icon="mdi-close" />} onClick={this.close} className={this.getClassName().buttonClose} />
        <Button content={<Icon icon="mdi-menu" />} onClick={this.open} className={this.getClassName().buttonOpen} />
      </div>
    );
    let right = (
      <div>
        <Button content={<Icon icon="mdi-menu" />} onClick={this.open} className={this.getClassName().buttonOpen} />
        <Button content={<Icon icon="mdi-close" />} onClick={this.close} className={this.getClassName().buttonClose} />
      </div>
    );

    let content, result;
    if (this._hasContent()) {
      content = this.props.block || this.state.open ? this.props.openContent : this.props.closedContent;
      switch (typeof content) {
        case "number":
          // content = content;
          break;
        case "string":
          if (UU5.Common.UU5String.isValid(content)) {
            content = UU5.Common.UU5String.toChildren(content);
          }
          break;
        default:
          content = UU5.Common.Element.clone(content, { open: this.state.open, block: this.props.block });
      }
    }

    let AreaWrapper = !this.props.block || this.props.fixed ? ScrollArea : UU5.Common.Fragment;
    if (content) {
      if (!this.props.block) {
        result = UU5.Common.Tools.wrapIfExists(
          UU5.Common.Fragment,
          <div {...this._getWrapperProps()} ref={comp => (this._columnRef = comp)}>
            {!this.props.relative ? <Backdrop {...this._getBackdropProps()} /> : null}
            <Column {...this._getMainProps()}>
              {UU5.Common.Tools.wrapIfExists(
                AreaWrapper,
                <UpdateWrapper preventRender={this._preventContentRender}>
                  {content}
                  <div className={this.getClassName().buttonWrapper}>
                    {this.props.button && (this.props.right ? right : left)}
                  </div>
                </UpdateWrapper>
              )}
              {this._getDragElement()}
            </Column>
            {this._getToggleButton()}
          </div>,
          <div {...this._getWrapperGhostProps()} ref={element => (this._ghost = element)}>
            <Column {...this._getMainGhostProps()} />
          </div>
        );
      } else {
        result = UU5.Common.Tools.wrapIfExists(
          UU5.Common.Fragment,
          <Column {...this._getMainProps(true)} ref={comp => (this._columnRef = comp)}>
            {UU5.Common.Tools.wrapIfExists(
              AreaWrapper,
              <UpdateWrapper preventRender={this._preventContentRender}>
                {content}
                <div className={this.getClassName().buttonWrapper}>
                  {this.props.button && (this.props.right ? right : left)}
                </div>
              </UpdateWrapper>
            )}
            {this._getDragElement()}
          </Column>,
          this.props.fixed ? <Column {...this._getMainGhostProps(true)} ref_={comp => (this._ghost = comp)} /> : null
        );
      }
    } else {
      result = null;
    }

    this._preventContentRender = false;

    return result;
  }
  //@@viewOff:render
});

export default PageColumn;
