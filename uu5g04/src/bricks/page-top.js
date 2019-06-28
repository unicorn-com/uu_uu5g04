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
import createReactClass from "create-react-class";
import PropTypes from "prop-types";
import * as UU5 from "uu5g04";
import ns from "./bricks-ns.js";

import "./page-top.less";

export const PageTop = createReactClass({
  //@@viewOn:mixins
  mixins: [
    UU5.Common.BaseMixin,
    UU5.Common.PureRenderMixin,
    UU5.Common.ContentMixin,
    UU5.Common.CcrWriterMixin
  ],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("PageTop"),
    nestingLevelList: UU5.Environment.getNestingLevelList("bigBoxCollection", "box"),
    classNames: {
      main: ns.css("page-top"),
      fixed: ns.css("page-top-fixed"),
      ghost: ns.css("page-top-ghost"),
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
    fixed: PropTypes.bool,
    fixedHeight: PropTypes.number,
    bottomId: PropTypes.string,
    leftFixed: PropTypes.bool,
    rightFixed: PropTypes.bool,
    alwaysFixed: PropTypes.bool
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
      alwaysFixed: false
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:standardComponentLifeCycle
  getInitialState() {
    return {
      initialPosition: !this.props.alwaysFixed,
      onScrollHidden: false,
      transform: 0,
      animate: false
    };
  },

  componentWillMount() {
    this._lastScrollPosition = 0;
    this._lastScrollPositionDown = 0;
    this._lastScrollPositionUp = 0;
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
    if (this.props.alwaysFixed && this._ghost && this._root) {
      this._ghost.style.height = this._computeHeightForGhost(false);
      this._initialGhostHeight = this._ghost.style.height;
    }
    if (this.props.fixed || this._simulateRelativePosition()) {
      UU5.Environment.EventListener.addWindowEvent("scroll", this.getId(), e => this._onScroll(this.props, e));
      UU5.Environment.EventListener.addWindowEvent("wheel", this.getId(), e => this._onScroll(this.props, e));
      UU5.Environment.EventListener.addWindowEvent("DOMMouseScroll", this.getId(), e => this._onScroll(this.props, e));
      UU5.Environment.EventListener.addWindowEvent("mousewheel", this.getId(), e => this._onScroll(this.props, e));
      // This is necessary because the width has to be changed
      UU5.Environment.EventListener.addWindowEvent("resize", this.getId(), () => this.forceUpdate());

      UU5.Environment.EventListener.registerEvent("preventScrollTrigger", this.getId(), (prevent) => this._scrollPrevented = prevent);
      UU5.Environment.EventListener.registerEvent("pageContentResize", this.getId(), () => this.forceUpdate());
      UU5.Environment.EventListener.registerEvent("pageColumnChanged", this.getId(), () => this.forceUpdate());

      this._height = this._root ? this._root.getBoundingClientRect().height : 0;

      if (this._isInInitialPosition()) {
        this.forceUpdate();
      }
    }
  },

  componentDidUpdate(prevProps, prevState) {
    let height = this.state.onScrollHidden ? 0 : this.state.transform ? this._height - this.state.transform : this._height;
    if (prevState.onScrollHidden !== this.state.onScrollHidden || prevState.transform !== this.state.transform) {
      UU5.Environment.EventListener.triggerEvent("hidePageTop", this.state.onScrollHidden, height);
    }

    if (prevState.initialPosition !== this.state.initialPosition) {
      UU5.Environment.EventListener.triggerEvent("fixPageTop", !this.state.initialPosition, height);
    }

    this._height = this._root ? this._root.getBoundingClientRect().height : 0;
  },

  componentWillReceiveProps(nextProps) {
    this._onScroll(nextProps);
  },
  //@@viewOff:standardComponentLifeCycle

  //@@viewOn:interface
  getFixState() {
    // NOTE Used from Plus4U5.App.Button.
    return {
      fixed: !this.state.initialPosition,
      hidden: this.state.onScrollHidden,
      height: this.state.onScrollHidden ? 0 : this.state.transform ? this._height - this.state.transform : this._height
    };
  },
  //@@viewOff:interface

  //@@viewOn:overridingMethods
  //@@viewOff:overridingMethods

  //@@viewOn:componentSpecificHelpers
  _computeHeightForGhost(useInitial) {
    let value;
    if (useInitial && this._initialGhostHeight != null) {
      value = this._initialGhostHeight;
    } else if (this._root) {
      value = this._root.getBoundingClientRect().height + "px";
    }
    return value != null ? value : "";
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

    if (UU5.Common.Tools.isMobileIOS() && UU5.Common.Tools.isSafari() && (Math.abs(scrollPosition - this._lastScrollPosition)) <= 10) {
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
      if (this.props.fixed) {
        if (this.props.alwaysFixed) {
          this._standardScroll();
        } else {
          this._smartScroll(scrollDirection, scrollPosition, ghostRect);
        }
      } else if (this._simulateRelativePosition()) {
        if (scrollDirection === "down" && ghostRect.bottom >= 0) {
          this.setState({ transform: -ghostRect.top });
        } else if (scrollDirection === "down" && ghostRect.bottom < 0 && this.state.transform < this._height) {
          this.setState({ transform: this._height });
        } else if (scrollDirection === "up" && ghostRect.bottom >= 0 && this.state.transform <= this._height) {
          this.setState({ transform: -ghostRect.top });
        } else if (this.state.transform > this._height) {
          this.setState({ transform: -this._height });
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
        this.setState({ onScrollHidden: false, initialPosition: true, transform:  this._height - ghostRect.bottom, animate: false });
      } else if (scrollDirection === "up" && this.props.fixedHeight && ghostRect.bottom - this.props.fixedHeight >= 0) {
        this.setState({ onScrollHidden: false, initialPosition: true, transform:  this._height - ghostRect.bottom, animate: false });
      } else if (scrollDirection === "up" && this.state.onScrollHidden && this._lastScrollPositionDown) {
        if (
          this._lastScrollPositionDown - scrollPosition >= this.getDefault().hideOnScrollOffset ||
          (this._ghost.clientHeight >= scrollPosition)
        ) {
          this.setState({ onScrollHidden: false, animate: true, transform: this.props.fixedHeight ? this._height - this.props.fixedHeight : null });
        }
      }
    } else {
      let threshold = this._root ? ghostRect.top + this._height: -1;
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
    ghostAttrs.style = {};
    ghostAttrs.style.height = this._computeHeightForGhost(this.props.alwaysFixed); // use initial height when using "always fixed" because passing height back to ghost doesn't work well when Top transitions are used (which is typical when the app uses always fixed top)
    ghostAttrs.ref = ghost => (this._ghost = ghost);

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
  //@@viewOff:componentSpecificHelpers

  //@@viewOn:render
  render() {
    let result;

    if (this.props.fixed || this._simulateRelativePosition()) {
      result = UU5.Common.Tools.wrapIfExists(
        React.Fragment,
        <div {...this._getMainAttrs()} key="main">
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
