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

import "./page-bottom.less";
//@@viewOff:imports

export const PageBottom = UU5.Common.VisualComponent.create({
  displayName: "PageBottom", // for backward compatibility (test snapshots)
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin, UU5.Common.PureRenderMixin, UU5.Common.ContentMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("PageBottom"),
    nestingLevelList: UU5.Environment.getNestingLevelList("bigBoxCollection", "box"),
    classNames: {
      main: ns.css("page-bottom"),
      fixed: ns.css("page-bottom-fixed"),
      ghost: ns.css("page-bottom-ghost"),
      onScrollShown: ns.css("page-bottom-shown"),
      onScrollHidden: ns.css("page-bottom-hidden"),
      animate: ns.css("page-bottom-animate"),
      noShadow: ns.css("page-bottom-no-shadow")
    },
    defaults: {
      hideOnScrollOffset: 64
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    fixed: UU5.PropTypes.bool,
    fixedHeight: UU5.PropTypes.number,
    topId: UU5.PropTypes.string,
    alwaysFixed: UU5.PropTypes.bool
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      fixed: false,
      fixedHeight: 0,
      topId: null,
      alwaysFixed: false
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  getInitialState() {
    return {
      initialPosition: !this.props.alwaysFixed,
      onScrollHidden: false,
      transform: 0
    };
  },

  componentWillMount() {
    this._lastScrollPosition = 0;
    this._lastScrollPositionDown = 0;
    this._lastScrollPositionUp = 0;
  },

  componentWillUnmount() {
    if (this.props.fixed) {
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
    this._pageTop = document.getElementById(this.props.topId);
    this._height = this._root ? this._root.getBoundingClientRect().height : 0;

    if (this.props.fixed) {
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

      let height = this.state.onScrollHidden ? this.props.fixedHeight || 0 : this._height;
      UU5.Environment.EventListener.triggerEvent("hidePageBottom", this.state.onScrollHidden, height);
      this.setState({ onScrollHidden: false, transform: 0 });
    }
  },

  componentDidUpdate(prevProps, prevState) {
    this._pageTop = document.getElementById(this.props.topId);

    let height = this.state.onScrollHidden
      ? 0
      : this.state.transform
      ? this._height - this.state.transform
      : this._height;
    if (prevState.onScrollHidden !== this.state.onScrollHidden || prevState.transform !== this.state.transform) {
      UU5.Environment.EventListener.triggerEvent("hidePageBottom", this.state.onScrollHidden, height);
    }

    if (prevState.initialPosition !== this.state.initialPosition) {
      UU5.Environment.EventListener.triggerEvent("fixPageBottom", !this.state.initialPosition, height);
    }

    this._height = this._root ? this._root.getBoundingClientRect().height : 0;
  },

  componentWillReceiveProps(nextProps) {
    this._pageTop = document.getElementById(nextProps.topId);
    this._onScroll(nextProps);
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  isInInitialPosition() {
    return this.state.initialPosition;
  },

  isFixed() {
    return this.props.fixed;
  },
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  _getTopVisibility() {
    let result = 0;
    if (this._pageTop) {
      let rect = this._pageTop.getBoundingClientRect();
      let top = rect.height + rect.top;
      if (top > 0) {
        result = top;
      }
    }

    return result;
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

    if (scrollPosition > this._lastScrollPosition) {
      scrollDirection = "down";
      this._lastScrollPositionDown = scrollPosition;
    } else if (scrollPosition < this._lastScrollPosition) {
      scrollDirection = "up";
      this._lastScrollPositionUp = scrollPosition;
    } else {
      return;
    }

    if (this.props.fixed && !this._scrollPrevented) {
      if (this.props.alwaysFixed) {
        this._standardScroll();
      } else {
        this._smartScroll(scrollDirection, scrollPosition);
      }
    }

    this._lastScrollPosition = scrollPosition;
    if (scrollDirection === "down") {
      this._lastScrollPositionDown = scrollPosition;
    } else if (scrollDirection === "up") {
      this._lastScrollPositionUp = scrollPosition;
    }

    return this;
  },

  _standardScroll() {
    this.setState({ initialPosition: false, onScrollHidden: false, transform: 0 });
  },

  _smartScroll(scrollDirection, scrollPosition) {
    let ghostRect = this._ghost && this._ghost.getBoundingClientRect();
    let rootRect = this._root && this._root.getBoundingClientRect();

    if (!this.isInInitialPosition()) {
      if (
        scrollDirection === "down" &&
        !this.state.onScrollHidden &&
        ghostRect.top > document.documentElement.clientHeight
      ) {
        this.setState({ onScrollHidden: true, animate: true, transform: this._height });
      } else if (scrollDirection === "down" && ghostRect.top <= document.documentElement.clientHeight) {
        this.setState({
          onScrollHidden: false,
          animate: false,
          transform: this._height + (ghostRect.top - document.documentElement.clientHeight),
          initialPosition: true
        });
      } else if (scrollDirection === "up" && this.state.onScrollHidden && this._lastScrollPositionDown) {
        if (this._lastScrollPositionDown - scrollPosition >= this.getDefault().hideOnScrollOffset) {
          this.setState({
            onScrollHidden: false,
            animate: true,
            transform: this.props.fixedHeight ? this._height - this.props.fixedHeight : null
          });
        }
      }
    } else {
      if (
        scrollDirection === "down" &&
        rootRect.bottom === document.documentElement.clientHeight - this.props.fixedHeight
      ) {
        this.setState({ initialPosition: false, transform: null, animate: false });
      } else if (this.props.fixedHeight) {
        if (scrollDirection === "down" && ghostRect.top > 0) {
          this.setState({
            transform: this._height + (ghostRect.top - document.documentElement.clientHeight),
            animate: false
          });
        } else if (
          scrollDirection === "up" &&
          ghostRect.top + this.props.fixedHeight < document.documentElement.clientHeight
        ) {
          this.setState({
            transform: this._height + (ghostRect.top - document.documentElement.clientHeight),
            animate: false
          });
        } else if (
          scrollDirection === "up" &&
          ghostRect.top + this.props.fixedHeight > document.documentElement.clientHeight
        ) {
          this.setState({ initialPosition: false, transform: this._height - this.props.fixedHeight, animate: true });
        }
      } else if (!this.props.fixedHeight) {
        if (scrollDirection === "down" && ghostRect.bottom === document.documentElement.clientHeight) {
          this.setState({
            transform: this._height + (ghostRect.top - document.documentElement.clientHeight),
            animate: false,
            initialPosition: true
          });
        } else if (scrollDirection === "down" && ghostRect.top > 0) {
          this.setState({
            transform: this._height + (ghostRect.top - document.documentElement.clientHeight),
            animate: false
          });
        } else if (scrollDirection === "up" && rootRect.top >= document.documentElement.clientHeight) {
          this.setState({
            transform: ghostRect.bottom - document.documentElement.clientHeight,
            initialPosition: false
          });
        } else if (scrollDirection === "up" && ghostRect.bottom >= document.documentElement.clientHeight) {
          this.setState({ transform: ghostRect.bottom - document.documentElement.clientHeight });
        }
      }
    }
  },

  _getGhostAttrs() {
    let ghostAttrs = {};

    ghostAttrs.className = this.getClassName("ghost");
    ghostAttrs.style = {};
    ghostAttrs.style.height = this._root ? this._root.getBoundingClientRect().height : null;
    ghostAttrs.ref = ghost => (this._ghost = ghost);

    return ghostAttrs;
  },

  _getMainAttrs() {
    let mainAttrs = this.getMainAttrs();
    mainAttrs.style = UU5.Common.Tools.merge({}, mainAttrs.style);

    if (this.state.onScrollHidden || this._isInInitialPosition()) {
      mainAttrs.className += " " + this.getClassName("noShadow");
    }

    mainAttrs.className += " " + this.getClassName("fixed");

    if (this.props.fixed && !this.state.onScrollHidden) {
      mainAttrs.className += " " + this.getClassName("onScrollShown");
    } else if (this.props.fixed && this.state.onScrollHidden) {
      mainAttrs.className += " " + this.getClassName("onScrollHidden");
    }

    if (this._ghost) {
      mainAttrs.style = UU5.Common.Tools.merge(mainAttrs.style, {
        width: this._ghost.getBoundingClientRect().width + "px",
        left: this._getOffsetLeft() + "px"
      });
    }

    if (this.state.animate) {
      mainAttrs.className += " " + this.getClassName("animate");
    }

    if (this.state.transform) {
      mainAttrs.style.transform = "translateY(" + this.state.transform + "px)";
      mainAttrs.style.WebkitTransform = "translateY(" + this.state.transform + "px)";
    }

    mainAttrs.ref = root => (this._root = root);

    return mainAttrs;
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    let result;

    if (this.props.fixed) {
      result = UU5.Common.Tools.wrapIfExists(
        UU5.Common.Fragment,
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

export default PageBottom;
