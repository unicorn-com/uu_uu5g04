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
import ResizeObserver from "./resize-observer.js";
import Css from "./internal/css.js";

import "./page-top.less";
//@@viewOff:imports

export const PageTop = UU5.Common.VisualComponent.create({
  displayName: "PageTop", // for backward compatibility (test snapshots)
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin, UU5.Common.PureRenderMixin, UU5.Common.ContentMixin, UU5.Common.CcrWriterMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("PageTop"),
    nestingLevelList: UU5.Environment.getNestingLevelList("bigBoxCollection", "box"),
    classNames: {
      main: ns.css("page-top"),
      fixed: ns.css("page-top-fixed"),
      ghost: props => {
        let className = ns.css("page-top-ghost");

        if (props.overlayContent) {
          className +=
            " " +
            Css.css(`
            z-index: -1;
            height: 0px;
          `);
        }

        return className;
      },
      onScrollShown: ns.css("page-top-shown"),
      onScrollHidden: ns.css("page-top-hidden"),
      animate: ns.css("page-top-animate"),
      noShadow: ns.css("page-top-no-shadow")
    },
    defaults: {
      hideOnScrollOffset: 64
    },
    opt: {
      ccrKey: "UU5.Bricks.Page.Top"
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    fixed: UU5.PropTypes.bool,
    fixedHeight: UU5.PropTypes.number,
    bottomId: UU5.PropTypes.string,
    leftFixed: UU5.PropTypes.bool,
    rightFixed: UU5.PropTypes.bool,
    alwaysFixed: UU5.PropTypes.bool,
    overlayContent: UU5.PropTypes.bool
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      fixed: false,
      fixedHeight: 0,
      bottomId: null,
      leftFixed: false,
      rightFixed: false,
      alwaysFixed: false,
      overlayContent: false
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  getInitialState() {
    this._lastScrollPosition = 0;
    this._lastScrollPositionDown = 0;
    this._lastScrollPositionUp = 0;

    return {
      initialPosition: !this.props.alwaysFixed && !this.props.overlayContent,
      onScrollHidden: false,
      transform: 0,
      animate: false,
      ghostHeight: undefined
    };
  },

  componentWillUnmount() {
    if (this.props.fixed || this._simulateRelativePosition()) {
      UU5.Environment.EventListener.removeWindowEvent("scroll", this.getId());
      UU5.Environment.EventListener.removeWindowEvent("wheel", this.getId());
      UU5.Environment.EventListener.removeWindowEvent("DOMMouseScroll", this.getId());
      UU5.Environment.EventListener.removeWindowEvent("mousewheel", this.getId());
      UU5.Environment.EventListener.removeWindowEvent("resize", this.getId());

      UU5.Environment.EventListener.unregisterEvent("preventScrollTrigger", this.getId());
      UU5.Environment.EventListener.unregisterEvent("pageContentResize", this.getId());
      UU5.Environment.EventListener.unregisterEvent("pageColumnChanged", this.getId());
    }
  },

  componentDidMount() {
    let ghostHeight;
    if (this.props.alwaysFixed && this._root) {
      ghostHeight = this._computeHeightForGhost(false);
      this.setState({ ghostHeight });
      this._initialGhostHeight = ghostHeight;
    } else {
      ghostHeight = this._computeHeightForGhost();
      this.setState({ ghostHeight });
    }

    UU5.Environment.EventListener.triggerEvent("changePageTopHeight", ghostHeight);

    if (this.props.fixed || this._simulateRelativePosition()) {
      UU5.Environment.EventListener.addWindowEvent("scroll", this.getId(), e => this._onScroll(this.props, e));
      UU5.Environment.EventListener.addWindowEvent("wheel", this.getId(), e => this._onScroll(this.props, e));
      UU5.Environment.EventListener.addWindowEvent("DOMMouseScroll", this.getId(), e => this._onScroll(this.props, e));
      UU5.Environment.EventListener.addWindowEvent("mousewheel", this.getId(), e => this._onScroll(this.props, e));
      // This is necessary because the width has to be changed
      UU5.Environment.EventListener.addWindowEvent("resize", this.getId(), () => this.forceUpdate());

      UU5.Environment.EventListener.registerEvent(
        "preventScrollTrigger",
        this.getId(),
        prevent => (this._scrollPrevented = prevent)
      );
      UU5.Environment.EventListener.registerEvent("pageContentResize", this.getId(), () => this.forceUpdate());
      UU5.Environment.EventListener.registerEvent("pageColumnChanged", this.getId(), () => this.forceUpdate());

      if (this._isInInitialPosition()) {
        this.forceUpdate();
      }
    }
  },

  componentDidUpdate(prevProps, prevState) {
    let height = this.state.onScrollHidden
      ? 0
      : this.state.transform
      ? this.state.ghostHeight - this.state.transform
      : this.state.ghostHeight;
    if (prevState.onScrollHidden !== this.state.onScrollHidden || prevState.transform !== this.state.transform) {
      UU5.Environment.EventListener.triggerEvent("hidePageTop", this.state.onScrollHidden, height);
    }

    if (prevState.initialPosition !== this.state.initialPosition) {
      UU5.Environment.EventListener.triggerEvent("fixPageTop", !this.state.initialPosition, height);
    }
  },

  componentWillReceiveProps(nextProps) {
    this._onScroll(nextProps);
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  getFixState() {
    // NOTE Used from Plus4U5.App.Button.
    return {
      fixed: !this.state.initialPosition,
      hidden: this.state.onScrollHidden,
      height: this.state.onScrollHidden
        ? 0
        : this.state.transform
        ? this.state.ghostHeight - this.state.transform
        : this.state.ghostHeight
    };
  },
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  _computeHeightForGhost(useInitial = this.props.alwaysFixed) {
    let value;
    if (useInitial && this._initialGhostHeight != null) {
      value = this._initialGhostHeight;
    } else if (this._root) {
      value = this._root.getBoundingClientRect().height;
    }
    return value != null ? value : "";
  },

  _setGhostHeight() {
    this.setState({ ghostHeight: this._computeHeightForGhost() }, () => {
      UU5.Environment.EventListener.triggerEvent("changePageTopHeight", this.state.ghostHeight);
    });
  },

  _simulateRelativePosition() {
    return !this.props.fixed && (this.props.leftFixed || this.props.rightFixed);
  },

  _isInInitialPosition() {
    return this.state.initialPosition;
  },

  _getOffsetLeft() {
    return this._ghost ? this._ghost.getBoundingClientRect().left + document.documentElement.scrollLeft : null;
  },

  _onScroll() {
    let scrollPosition = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop;
    let scrollDirection;

    if (
      UU5.Common.Tools.isMobileIOS() &&
      UU5.Common.Tools.isSafari() &&
      Math.abs(scrollPosition - this._lastScrollPosition) <= 10
    ) {
      // Restrict scroll to amount to atleast 10px on iOS because of its address bar which messes up
      // the scroll direction detection when hidding and showing up
      return;
    }

    if (scrollPosition > this._lastScrollPosition) {
      scrollDirection = "down";
      this._lastScrollPositionDown = scrollPosition;
    } else if (scrollPosition < this._lastScrollPosition) {
      scrollDirection = "up";
      this._lastScrollPositionUp = scrollPosition;
    } else {
      return;
    }

    if (!this._scrollPrevented) {
      let ghostRect = this._ghost && this._ghost.getBoundingClientRect();
      if (this.props.overlayContent) {
        ghostRect = {
          left: ghostRect.left,
          right: ghostRect.right,
          top: -1,
          bottom: -1,
          width: ghostRect.width,
          height: 0
        };
      }

      if (this.props.fixed) {
        if (this.props.alwaysFixed) {
          this._standardScroll();
        } else {
          this._smartScroll(scrollDirection, scrollPosition, ghostRect);
        }
      } else if (this._simulateRelativePosition()) {
        if (scrollDirection === "down" && ghostRect.bottom >= 0) {
          this.setState({ transform: -ghostRect.top });
        } else if (
          scrollDirection === "down" &&
          ghostRect.bottom < 0 &&
          this.state.transform < this.state.ghostHeight
        ) {
          this.setState({ transform: this.state.ghostHeight });
        } else if (
          scrollDirection === "up" &&
          ghostRect.bottom >= 0 &&
          this.state.transform <= this.state.ghostHeight
        ) {
          this.setState({ transform: -ghostRect.top });
        } else if (this.state.transform > this.state.ghostHeight) {
          this.setState({ transform: -this.state.ghostHeight });
        }
      }
    }

    this._lastScrollPosition = scrollPosition;
    if (scrollDirection === "down") {
      this._lastScrollPositionDown = scrollPosition;
    } else if (scrollDirection === "up") {
      this._lastScrollPositionUp = scrollPosition;
    }
  },

  _standardScroll() {
    this.setState({ initialPosition: false, onScrollHidden: false, transform: 0 });
  },

  _smartScroll(scrollDirection, scrollPosition, ghostRect) {
    if (!this._isInInitialPosition()) {
      if (scrollDirection === "down" && !this.state.onScrollHidden && ghostRect.bottom < 0) {
        this.setState({ onScrollHidden: true, animate: true, transform: null });
      } else if (scrollDirection === "up" && !this.props.fixedHeight && ghostRect.top === 0) {
        this.setState({
          onScrollHidden: false,
          initialPosition: true,
          transform: this.state.ghostHeight - ghostRect.bottom,
          animate: false
        });
      } else if (scrollDirection === "up" && this.props.fixedHeight && ghostRect.bottom - this.props.fixedHeight >= 0) {
        this.setState({
          onScrollHidden: false,
          initialPosition: true,
          transform: this.state.ghostHeight - ghostRect.bottom,
          animate: false
        });
      } else if (scrollDirection === "up" && this.state.onScrollHidden && this._lastScrollPositionDown) {
        if (
          this._lastScrollPositionDown - scrollPosition >= this.getDefault().hideOnScrollOffset ||
          this.state.ghostHeight >= scrollPosition
        ) {
          this.setState({
            onScrollHidden: false,
            animate: true,
            transform: this.props.fixedHeight ? this.state.ghostHeight - this.props.fixedHeight : null
          });
        }
      }
    } else {
      let threshold = this._root ? ghostRect.top + this.state.ghostHeight : -1;
      if (scrollDirection === "down" && threshold < 0) {
        this.setState({ onScrollHidden: true, initialPosition: false, transform: null, animate: false });
      } else if (scrollDirection === "down" && threshold >= 0) {
        this.setState({ onScrollHidden: false, transform: -ghostRect.top, animate: false });
      } else if (scrollDirection === "up") {
        this.setState({ onScrollHidden: false, transform: -ghostRect.top, animate: false });
      }
    }
  },

  _getGhostAttrs() {
    let ghostAttrs = {};

    ghostAttrs.className = this.getClassName("ghost");
    ghostAttrs.ref = ghost => (this._ghost = ghost);
    ghostAttrs.style = {};

    if (!this.props.overlayContent) {
      ghostAttrs.style.height = this.state.ghostHeight + "px";
    }

    return ghostAttrs;
  },

  _getMainAttrs() {
    let mainAttrs = this.getMainAttrs();
    mainAttrs.className += " " + this.getClassName("fixed");

    if (this._simulateRelativePosition() || this.state.onScrollHidden || this._isInInitialPosition()) {
      mainAttrs.className += " " + this.getClassName("noShadow");
    }

    if (!this.state.onScrollHidden) {
      mainAttrs.className += " " + this.getClassName("onScrollShown");
    } else if (this.state.onScrollHidden) {
      mainAttrs.className += " " + this.getClassName("onScrollHidden");
    }

    if (this._ghost) {
      mainAttrs.style = UU5.Common.Tools.merge({}, mainAttrs.style);
      mainAttrs.style = UU5.Common.Tools.merge(mainAttrs.style, {
        width: this._ghost.getBoundingClientRect().width + "px",
        left: this._getOffsetLeft() + "px"
      });
    }

    if (this.state.animate) {
      mainAttrs.className += " " + this.getClassName("animate");
    }

    if (this.state.transform && (!this.state.onScrollHidden || this.state.initialPosition)) {
      mainAttrs.style.transform = "translateY(-" + this.state.transform + "px)";
      mainAttrs.style.WebkitTransform = "translateY(-" + this.state.transform + "px)";
    }

    mainAttrs.ref = root => (this._root = root);

    return mainAttrs;
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    let result;

    if (this.props.fixed || this._simulateRelativePosition()) {
      result = UU5.Common.Tools.wrapIfExists(
        UU5.Common.Fragment,
        <div {...this._getMainAttrs()} key="main">
          <ResizeObserver onResize={this._setGhostHeight} />
          {this.getChildren()}
        </div>,
        <div {...this._getGhostAttrs()} key="ghost" />
      );
    } else {
      result = this.getChildren();
    }

    return result;
  }
  //@@viewOff:render
});

export default PageTop;
