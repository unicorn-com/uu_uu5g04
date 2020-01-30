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

import "./heading.less";
//@@viewOff:imports

export const Heading = UU5.Common.VisualComponent.create({
  displayName: "Heading", // for backward compatibility (test snapshots)
  //@@viewOn:mixins
  mixins: [
    UU5.Common.BaseMixin,
    UU5.Common.PureRenderMixin,
    UU5.Common.ElementaryMixin,
    UU5.Common.ContentMixin,
    UU5.Common.NestingLevelMixin
  ],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("Heading"),
    nestingLevelList: UU5.Environment.getNestingLevelList("bigBoxCollection", "box"),
    classNames: {
      main: ns.css("heading"),
      fixed: ns.css("heading-fixed"),
      ghost: ns.css("heading-ghost"),
      hideOnScrollShown: ns.css("heading-auto-hide-shown"),
      hideOnScrollHidden: ns.css("heading-auto-hide-hidden")
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    fixed: UU5.PropTypes.bool,
    fixedOnScroll: UU5.PropTypes.bool,
    hideOnScroll: UU5.PropTypes.bool,
    hideOnScrollOffset: UU5.PropTypes.number,
    onScrollToFixed: UU5.PropTypes.func, // not called in interface, just on scroll
    onScrollToBlocked: UU5.PropTypes.func, // not called in interface, just on scroll
    spaceHolder: UU5.PropTypes.bool
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      fixed: false,
      fixedOnScroll: false,
      hideOnScroll: false,
      hideOnScrollOffset: 64,
      onScrollToFixed: null,
      onScrollToBlocked: null,
      spaceHolder: false
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  getInitialState() {
    return {
      fixed: this.props.fixed,
      hideOnScrollHidden: false
    };
  },

  componentWillMount() {
    this.lastScrollPosition = 0;
    this.scrollStart = 0;
    return this;
  },

  componentWillUnmount() {
    if (
      this.props.fixedOnScroll ||
      this.props.onScrollToFixed ||
      this.props.onScrollToBlocked ||
      this.props.hideOnScroll
    ) {
      UU5.Environment.EventListener.removeWindowEvent("scroll", this.getId());
      UU5.Environment.EventListener.removeWindowEvent("wheel", this.getId());
      UU5.Environment.EventListener.removeWindowEvent("DOMMouseScroll", this.getId());
      UU5.Environment.EventListener.removeWindowEvent("mousewheel", this.getId());
    }
  },

  componentDidMount() {
    if (
      this.props.fixedOnScroll ||
      this.props.onScrollToFixed ||
      this.props.onScrollToBlocked ||
      this.props.hideOnScroll
    ) {
      UU5.Environment.EventListener.addWindowEvent("scroll", this.getId(), e => this._onScroll(this.props, e));
      UU5.Environment.EventListener.addWindowEvent("wheel", this.getId(), e => this._onScroll(this.props, e));
      UU5.Environment.EventListener.addWindowEvent("DOMMouseScroll", this.getId(), e => this._onScroll(this.props, e));
      UU5.Environment.EventListener.addWindowEvent("mousewheel", this.getId(), e => this._onScroll(this.props, e));
    }

    this._height = this._root ? this._root.getBoundingClientRect().height : 0;

    if (this.isFixed()) {
      this.forceUpdate();
    }

    return this;
  },

  componentDidUpdate(prevProps, prevState) {
    if (!prevState.fixed && this.state.fixed && this._root) {
      this._root.classList.add("prevent-animation");
    } else if (this._root) {
      this._root.classList.remove("prevent-animation");
    }

    this._height = this._root ? this._root.getBoundingClientRect().height : 0;

    if (
      (this.props.fixed || (this.props.fixedOnScroll && this.state.fixed)) &&
      UU5.Environment._fixedOffset <= this._height
    ) {
      UU5.Environment._fixedOffset = this._height;
    }
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.controlled) {
      this._onScroll(nextProps);
    }
    return this;
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  getOffsetTop() {
    let scrollPosition = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop;
    let element = this._ghost || this._root;
    return element
      ? element.getBoundingClientRect().top + (this.props.hideOnScroll ? element.offsetHeight : 0) + scrollPosition
      : null;
  },

  setFixedValue(fixed, setStateCallback) {
    this.setState({ fixed: fixed }, setStateCallback);
    return this;
  },

  isFixed() {
    return this.state.fixed;
  },

  setFixed(setStateCallback) {
    this.setFixedValue(true, setStateCallback);
    return this;
  },

  setBlocked(setStateCallback) {
    this.setFixedValue(false, setStateCallback);
    return this;
  },
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  _getOffsetLeft() {
    return this._root ? this._root.getBoundingClientRect().left + document.documentElement.scrollLeft : null;
  },

  _onScroll(props) {
    let prop = {
      onScrollToFixed: props.onScrollToFixed || this.props.onScrollToFixed,
      onScrollToBlocked: props.onScrollToBlocked || this.props.onScrollToBlocked,
      fixedOnScroll: props.fixedOnScroll || this.props.fixedOnScroll
    };
    let scrollPosition = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop;
    let scrollStart = this.getOffsetTop();
    let scrollDirection;

    if (scrollPosition > this.lastScrollPosition) {
      scrollDirection = "down";
    } else if (scrollPosition < this.lastScrollPosition) {
      scrollDirection = "up";
    }

    let threshold;

    if (this.props.hideOnScroll) {
      if (this.isFixed()) {
        threshold = this._ghost && !this.props.fixed ? this._ghost.getBoundingClientRect().top : -1;
        if (scrollDirection === "down" && !this.state.hideOnScrollHidden && threshold < 0) {
          this._lastScrollPositionUp = null;
          this.setState({ hideOnScrollHidden: true });
        } else if (scrollDirection === "up" && this._ghost && threshold >= 0) {
          this.setState({ hideOnScrollHidden: false, fixed: false });
        } else if (scrollDirection === "up" && this.state.hideOnScrollHidden) {
          if (!this._lastScrollPositionUp) {
            this._lastScrollPositionUp = scrollPosition;
          } else if (
            this._lastScrollPositionUp - scrollPosition > this.props.hideOnScrollOffset ||
            (this._ghost && this._ghost.clientHeight >= scrollPosition)
          ) {
            this.setState({ hideOnScrollHidden: false });
          }
        }
      } else if (this.props.fixed || this.props.fixedOnScroll) {
        threshold = this._root && !this.props.fixed ? this._root.getBoundingClientRect().top + this._height : -1;
        if (scrollDirection === "down" && threshold < 0) {
          this._lastScrollPositionUp = null;
          this.setState({ hideOnScrollHidden: true, fixed: true });
        }
      }
    } else if (this.props.fixedOnScroll) {
      if (scrollPosition > scrollStart && this.lastScrollPosition <= scrollStart) {
        this.scrollStart = scrollStart;

        if (typeof prop.onScrollToFixed === "function") {
          prop.onScrollToFixed(this, scrollPosition, scrollStart);
        } else if (prop.fixedOnScroll) {
          this.setFixed();
        }
      } else if (scrollPosition <= this.scrollStart && this.lastScrollPosition > scrollStart) {
        this.lastScrollPosition = 0;
        this.scrollStart = 0;

        if (typeof prop.onScrollToBlocked === "function") {
          prop.onScrollToBlocked(this, scrollPosition, scrollStart);
        } else if (prop.fixedOnScroll) {
          this.setBlocked();
        }
      }

      if (this.isFixed()) {
        if (
          scrollDirection === "down" &&
          !this.state.hideOnScrollHidden &&
          this._root &&
          this._ghost.getBoundingClientRect().bottom < 0
        ) {
          this._lastScrollPositionUp = null;
          this.setState({ hideOnScrollHidden: true });
        } else if (scrollDirection === "up" && this.state.hideOnScrollHidden) {
          this.setState({ hideOnScrollHidden: false });
        }
      }
    }

    this.lastScrollPosition = scrollPosition;

    return this;
  },

  _getGhostAttrs() {
    let attrs = {};

    attrs.className = this.getClassName("ghost");
    attrs.style = {};
    attrs.style.height = this._root && this.props.spaceHolder ? this._root.getBoundingClientRect().height : null;
    attrs.ref = ghost => (this._ghost = ghost);

    return attrs;
  },

  _getMainAttrs() {
    let mainAttrs = this.getMainAttrs();

    mainAttrs.id = this.getId();
    if (this.state.fixed) {
      mainAttrs.className += " " + this.getClassName("fixed");

      if (this.props.hideOnScroll && !this.state.hideOnScrollHidden) {
        mainAttrs.className += " " + this.getClassName("hideOnScrollShown");
      } else if (this.props.hideOnScroll && this.state.hideOnScrollHidden) {
        mainAttrs.className += " " + this.getClassName("hideOnScrollHidden");
      }
    }

    mainAttrs.ref = root => {
      this._root = root;
    };

    return mainAttrs;
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    return this.getNestingLevel()
      ? UU5.Common.Tools.wrapIfExists(
          UU5.Common.Fragment,
          <div {...this._getMainAttrs()} key="main">
            {this.getChildren()}
            {this.getDisabledCover()}
          </div>,
          this.isFixed() ? <div {...this._getGhostAttrs()} key="ghost" /> : null
        )
      : null;
  }
  //@@viewOff:render
});

export default Heading;
