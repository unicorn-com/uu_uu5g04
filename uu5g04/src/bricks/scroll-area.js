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

import Css from "./internal/css.js";
import ResizeObserver from "./resize-observer.js";
//@@viewOff:imports

function canUseCustomScrollbar() {
  return !UU5.Common.Tools.isMobileOrTablet && !UU5.Common.Tools.isMobileIOS();
}

function getScrollBarWidth() {
  return UU5.Common.Tools.isChrome() ? 8 : UU5.Environment.getScrollBarWidth();
}

export const ScrollArea = UU5.Common.VisualComponent.create({
  displayName: "ScrollArea", // for backward compatibility (test snapshots)
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin, UU5.Common.ContentMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("ScrollArea"),
    classNames: {
      main: (props, state) => {
        let styles = [
          `
          overflow: hidden;
          position: relative;
          height: 100%;

          & > .uu5-bricks-scroll-area-content-wrapper {
            width: 100%;
          }
          `
        ];

        if (canUseCustomScrollbar()) {
          if (props.customScrollbar) {
            styles.push(`
              &::-webkit-scrollbar {
                width: 8px;
              }

              &::-webkit-scrollbar-track {
                background: transparent;
              }

              &::-webkit-scrollbar-thumb {
                background: #BDBDBD;
                border-radius: 4px;
              }

              &::-webkit-scrollbar-thumb:hover {
                background: #555;
              }
            `);
          }

          if (props.hideOnBlur) {
            styles.push(`

              &:hover {
                overflow-y: auto;
              }
            `);
          } else {
            styles.push("overflow-y: auto;");
          }
        } else {
          styles.push(`
            overflow-y: auto;
            overscroll-behavior: contain;
          `);
        }

        if (state.hasScrollbar && !props.reserveSpace) {
          const scrollbarWidth = getScrollBarWidth();
          styles.push(`
            &:hover > .uu5-bricks-scroll-area-content-wrapper {
              width: calc(100% + ${scrollbarWidth}px)
            }
          `);
        } else if (state.hasScrollbar && props.reserveSpace) {
          const scrollbarWidth = getScrollBarWidth();

          if (props.hideOnBlur) {
            styles.push(`
              &:not(:hover) > .uu5-bricks-scroll-area-content-wrapper {
                width: calc(100% - ${scrollbarWidth}px)
              }
            `);
          } else {
            styles.push(`
              & > .uu5-bricks-scroll-area-content-wrapper {
                width: calc(100% - ${scrollbarWidth}px);
              }
            `);
          }
        } else {
          styles.push(`
            & > .uu5-bricks-scroll-area-content-wrapper {
              width: 100%
            }
          `);
        }

        return `${ns.css("scroll-area")} ${Css.css(styles.join(" "))}`;
      },
      contentWrapper: (props, state) => {
        let styles = [
          `
          overflow: visible;
          display: inline-block;
          position: relative;
          `
        ];

        return `${ns.css("scroll-area-content-wrapper")} ${Css.css(styles.join(" "))}`;
      }
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    customScrollbar: UU5.PropTypes.bool,
    reserveSpace: UU5.PropTypes.bool,
    hideOnBlur: UU5.PropTypes.bool,
    onDisplayBar: UU5.PropTypes.func,
    onHideBar: UU5.PropTypes.func,
    initialScrollTop: UU5.PropTypes.number
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      customScrollbar: true,
      reserveSpace: false,
      hideOnBlur: true,
      onDisplayBar: null,
      onHideBar: null,
      initialScrollTop: null
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  getInitialState() {
    this._updateCount = 0;

    return {
      hasScrollbar: false
    };
  },

  componentDidMount() {
    this._domNode = UU5.Common.DOM.findNode(this);
    this._measureScrollbar();

    if (this._domNode) {
      UU5.Environment.EventListener.addEvent(this._domNode, "wheel", this.getId(), this._onWheel);
    }
  },

  componentWillUnmount() {
    if (this._domNode) {
      UU5.Environment.EventListener.removeEvent(this._domNode, "wheel", this.getId());
    }
  },

  componentDidUpdate() {
    // Here is fix to prevent triggering _measureScrollbar too many times in one stack and causing an exception being thrown.
    // Bug was discovered when scrolling in a certain way in BookKit with a certain content in it's menu (can't always be simulated)
    // and is also caused by the BookKit's usage of % value in padding of component BookKitLogo
    this._updateCount++;
    this._domNode = UU5.Common.DOM.findNode(this);

    if (this._resetCountTimer) {
      clearTimeout(this._resetCountTimer);
    }

    this._resetCountTimer = setTimeout(() => {
      this._updateCount = 0;
    }, 0);

    if (this._updateCount <= 10 || !this.state.hasScrollbar) {
      this._measureScrollbar();
    }
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  getScrollTop() {
    return this._domNode && document.body.contains(this._domNode) ? this._domNode.scrollTop : null;
  },

  setScrollTop(scrollTop) {
    if (this._domNode && this._domNode.scrollTop !== scrollTop) {
      this._domNode.scrollTop = scrollTop || 0;
    }

    return this;
  },

  hasScrollbar() {
    return this._hasScrollbar();
  },
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  _onWheel(e) {
    if (this.state.hasScrollbar) {
      if (e.deltaY > 0 && this._domNode.offsetHeight + this._domNode.scrollTop >= this._domNode.scrollHeight) {
        e.preventDefault();
      } else if (e.deltaY < 0 && this._domNode.scrollTop <= 0) {
        e.preventDefault();
      } else {
        e.stopPropagation();
      }
    }
  },

  _measureScrollbar() {
    let hasScrollbar = this._hasScrollbar();

    if (this.state.hasScrollbar && !hasScrollbar) {
      this.setState({ hasScrollbar: false });
    } else if (!this.state.hasScrollbar && hasScrollbar) {
      this.setState({ hasScrollbar: true });
    }
  },

  _hasScrollbar() {
    return this._domNode && this._domNode.scrollHeight > Math.ceil(this._domNode.getBoundingClientRect().height);
  },

  _onResize() {
    this._updateCount = 0;
    this._measureScrollbar();
  },

  _getScrollAreaWrapper() {
    let attrs = this.getMainAttrs();

    if (canUseCustomScrollbar()) {
      if (this.props.hideOnBlur && typeof this.props.onDisplayBar === "function") {
        attrs.onMouseEnter = this.props.onDisplayBar;
      }

      if (this.props.hideOnBlur && typeof this.props.onHideBar === "function") {
        attrs.onMouseLeave = this.props.onHideBar;
      }
    }

    return (
      <div {...attrs}>
        <span className={this.getClassName("contentWrapper")}>
          {this.getChildren()}
          <ResizeObserver onResize={this._onResize} />
        </span>
        <ResizeObserver onResize={this._onResize} />
      </div>
    );
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    return this._getScrollAreaWrapper();
  }
  //@@viewOff:render
});

export default ScrollArea;
