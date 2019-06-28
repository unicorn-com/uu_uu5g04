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

import React from 'react';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import * as UU5 from "uu5g04";
import ns from "./bricks-ns.js";

import ResizeObserver from "./resize-observer.js";

import './scroll-area.less';

export const ScrollArea = createReactClass({

  //@@viewOn:mixins
  mixins: [
    UU5.Common.BaseMixin,
    UU5.Common.ContentMixin
  ],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("ScrollArea"),
    classNames: {
      main: ns.css("scroll-area"),
      contentWrapper: ns.css("scroll-area-content-wrapper"),
      reservedSpace: ns.css("scroll-area-reserved-space"),
      hideOnBlur: ns.css("scroll-area-hide-on-blur"),
      customScrollbar: ns.css("scroll-area-custom-scrollbar"),
      inactive: ns.css("scroll-area-inactive")
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    customScrollbar: PropTypes.bool,
    reserveSpace: PropTypes.bool,
    hideOnBlur: PropTypes.bool,
    onDisplayBar: PropTypes.func,
    onHideBar: PropTypes.func,
    initialScrollTop: PropTypes.number
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

  //@@viewOn:standardComponentLifeCycle
  getInitialState() {
    return {
      hasScrollbar: false
    };
  },

  componentDidMount() {
    this._domNode = this.findDOMNode();
    this._measureScrollbar();

    if (this._domNode) {
      UU5.Environment.EventListener.addEvent(this._domNode, 'wheel', this.getId(), this._onWheel);
    }
  },

  componentWillUnmount() {
    if (this._domNode) {
      UU5.Environment.EventListener.removeEvent(this._domNode, 'wheel', this.getId());
    }
  },

  componentDidUpdate() {
    this._domNode = this.findDOMNode();
    this._measureScrollbar();
  },
  //@@viewOff:standardComponentLifeCycle

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
  //@@viewOff:interface

  //@@viewOn:overridingMethods
  //@@viewOff:overridingMethods

  //@@viewOn:componentSpecificHelpers
  _onWheel(e) {
    if (this.state.hasScrollbar) {
      if (e.deltaY > 0 && (this._domNode.offsetHeight + this._domNode.scrollTop) >= this._domNode.scrollHeight) {
        e.preventDefault();
      } else if (e.deltaY < 0 && this._domNode.scrollTop <= 0) {
        e.preventDefault();
      }
    }
  },

  _measureScrollbar() {
    let hasScrollbar = this._domNode && this._domNode.scrollHeight > Math.ceil(this._domNode.getBoundingClientRect().height);

    if (this.state.hasScrollbar && !hasScrollbar) {
      this.setState({ hasScrollbar: false });
    } else if (!this.state.hasScrollbar && hasScrollbar) {
      this.setState({ hasScrollbar: true });
    }
    return this;
  },

  _getScrollAreaWrapper() {
    let attrs = this.getMainAttrs();
    let width = "100%";

    if (this._useCustomScrollbar()) {
      let scrollbarWidth = UU5.Common.Tools.isChrome() ? 8 : UU5.Environment.getScrollBarWidth();
      if (this.state.hasScrollbar && !this.props.reserveSpace) {
        width = "calc(100%" + " + " + scrollbarWidth + "px)";
      } else if (this.state.hasScrollbar && this.props.reserveSpace) {
        width = "calc(100%" + " - " + scrollbarWidth + "px)";
      }

      if (this.props.customScrollbar) {
        attrs.className += " " + this.getClassName("customScrollbar");
      }

      if (this.props.reserveSpace) {
        attrs.className += " " + this.getClassName("reservedSpace");
      }

      if (this.props.hideOnBlur) {
        attrs.className += " " + this.getClassName("hideOnBlur");
      }

      if (this.props.hideOnBlur && typeof this.props.onDisplayBar === "function") {
        attrs.onMouseEnter = this.props.onDisplayBar;
      }

      if (this.props.hideOnBlur && typeof this.props.onHideBar === "function") {
        attrs.onMouseLeave = this.props.onHideBar;
      }
    } else {
      attrs.className += " " + this.getClassName("inactive");
    }

    return (
      <div {...attrs}>
        <span style={{ width }} className={this.getClassName("contentWrapper")}>
          {this.getChildren()}
          <ResizeObserver onResize={this._measureScrollbar} />
        </span>
        <ResizeObserver onResize={this._measureScrollbar} />
      </div>
    );
  },

  _useCustomScrollbar() {
    return !UU5.Common.Tools.isMobileOrTablet && !UU5.Common.Tools.isMobileIOS();
  },
  //@@viewOff:componentSpecificHelpers

  //@@viewOn:render
  render() {
    return this._getScrollAreaWrapper();
  }
  //@@viewOff:render
});

export default ScrollArea;
