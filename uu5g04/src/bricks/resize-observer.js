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
import React from "react";
import * as UU5 from "uu5g04";
import ns from "./bricks-ns.js";

import "./resize-observer.less";
//@@viewOff:imports

let ResizeObserver;
if (window.ResizeObserver) {
  ResizeObserver = class extends React.Component {
    static propTypes = {
      onResize: UU5.PropTypes.func.isRequired,
      onInitialSize: UU5.PropTypes.func
    };
    static defaultProps = {
      onResize: undefined,
      onInitialSize: undefined
    };
    constructor(props) {
      super(props);
      this._setDomNodeRef = this._setDomNodeRef.bind(this);
    }
    componentDidMount() {
      if (this._parentNode) {
        this._observer = new window.ResizeObserver(entries => {
          let rect = entries[entries.length - 1].contentRect;
          if (rect) this.props.onResize({ width: rect.width, height: rect.height });
        });
        this._observer.observe(this._parentNode);
        if (typeof this.props.onInitialSize === "function") {
          let { width, height } = this._parentNode.getBoundingClientRect();
          this.props.onInitialSize({ width, height });
        }
      }
    }
    componentWillUnmount() {
      if (this._observer) {
        if (this._parentNode) this._observer.unobserve(this._parentNode);
        this._observer.disconnect();
      }
    }
    _setDomNodeRef(domNode) {
      this._domNode = domNode;
      this._parentNode = domNode ? domNode.parentNode : null;
    }
    render() {
      return <span ref={this._setDomNodeRef} style={{ display: "none" }} />;
    }
  };
} else {
  ResizeObserver = UU5.Common.VisualComponent.create({
    displayName: "ResizeObserver", // for backward compatibility (test snapshots)
    //@@viewOn:mixins
    mixins: [UU5.Common.BaseMixin],
    //@@viewOff:mixins

    //@@viewOn:statics
    statics: {
      tagName: ns.name("ResizeObserver"),
      classNames: {
        main: ns.css("resize-observer"),
        expand: ns.css("resize-observer-expand"),
        expandInner: ns.css("resize-observer-expand-inner"),
        shrink: ns.css("resize-observer-shrink"),
        shrinkInner: ns.css("resize-observer-shrink-inner")
      },
      warnings: {
        parentNotRelative: 'Parent element of a ResizeObserver component is missing position="relative" style.'
      }
    },
    //@@viewOff:statics

    //@@viewOn:propTypes
    propTypes: {
      onResize: UU5.PropTypes.func.isRequired,
      onInitialSize: UU5.PropTypes.func
    },
    //@@viewOff:propTypes

    //@@viewOn:getDefaultProps
    getDefaultProps() {
      return {
        onResize: undefined,
        onInitialSize: undefined
      };
    },
    //@@viewOff:getDefaultProps

    //@@viewOn:reactLifeCycle
    componentDidMount() {
      this._attachResizeEvent();
      this._reset();
    },

    componentWillUnmount() {
      this._rafId && cancelAnimationFrame(this._rafId);
    },

    componentDidUpdate() {
      this._reset();
    },
    //@@viewOff:reactLifeCycle

    //@@viewOn:interface
    //@@viewOff:interface

    //@@viewOn:overriding
    //@@viewOff:overriding

    //@@viewOn:private
    _attachResizeEvent() {
      if (!this._rootElement) return;

      let position = window.getComputedStyle(this._rootElement.parentNode).getPropertyValue("position");
      if ("absolute" !== position && "relative" !== position && "fixed" !== position) {
        this.showWarning("parentNotRelative");
      }

      let size = this._getElementSize(this._rootElement);
      this._lastWidth = size.width;
      this._lastHeight = size.height;

      this._expandElement.addEventListener("scroll", this._onScroll);
      this._shrinkElement.addEventListener("scroll", this._onScroll);

      if (typeof this.props.onInitialSize === "function") {
        this.props.onInitialSize({ width: size.width, height: size.height });
      }
    },

    _onResized(newWidth, newHeight) {
      this._rafId = 0;

      if (!this._dirty) return;

      this._lastWidth = newWidth;
      this._lastHeight = newHeight;

      typeof this.props.onResize === "function" && this.props.onResize({ width: newWidth, height: newHeight });
    },

    _onScroll() {
      if (this._rootElement) {
        let size = this._getElementSize(this._rootElement);
        let newWidth = size.width;
        let newHeight = size.height;
        this._dirty = newWidth != this._lastWidth || newHeight != this._lastHeight;

        if (this._dirty && !this._rafId) {
          this._rafId = requestAnimationFrame(() => this._onResized(newWidth, newHeight));
        }

        this._reset();
      }
    },

    _reset() {
      //set display to block, necessary otherwise hidden elements won't ever work
      let invisible = this._rootElement.parentNode.offsetWidth === 0 && this._rootElement.parentNode.offsetHeight === 0;
      let saveDisplay;

      if (invisible) {
        saveDisplay = this._rootElement.parentNode.style.display;
        this._rootElement.parentNode.style.display = "block";
      }

      this._expandElement.scrollLeft = 100000;
      this._expandElement.scrollTop = 100000;

      this._shrinkElement.scrollLeft = 100000;
      this._shrinkElement.scrollTop = 100000;

      if (invisible) {
        this._rootElement.parentNode.style.display = saveDisplay;
      }
    },

    _getElementSize(element) {
      if (!element.getBoundingClientRect) {
        return {
          width: element.offsetWidth,
          height: element.offsetHeight
        };
      }

      let rect = element.getBoundingClientRect();

      return {
        width: Math.round(rect.width),
        height: Math.round(rect.height)
      };
    },
    //@@viewOff:private

    //@@viewOn:render
    render() {
      return (
        <div {...this.getMainAttrs()} ref={element => (this._rootElement = element)}>
          <div ref={element => (this._expandElement = element)} className={this.getClassName("expand")}>
            <div className={this.getClassName("expandInner")} />
          </div>
          <div ref={element => (this._shrinkElement = element)} className={this.getClassName("shrink")}>
            <div className={this.getClassName("shrinkInner")} />
          </div>
        </div>
      );
    }
    //@@viewOff:render
  });
}
export { ResizeObserver };
export default ResizeObserver;
