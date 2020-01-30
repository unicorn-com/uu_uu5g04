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

import Button from "./button.js";
import Icon from "./icon.js";

import "./button-to-top.less";
//@@viewOff:imports

export const ButtonToTop = UU5.Common.VisualComponent.create({
  displayName: "ButtonToTop", // for backward compatibility (test snapshots)
  //@@viewOn:mixins
  mixins: [
    UU5.Common.BaseMixin,
    UU5.Common.ElementaryMixin,
    UU5.Common.ColorSchemaMixin,
    UU5.Common.NestingLevelMixin,
    UU5.Common.PureRenderMixin
  ],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("ButtonToTop"),
    nestingLevel: "smallBox",
    classNames: {
      main: ns.css("button-to-top"),
      stickyButton: ns.css("button-to-top-sticky")
    },
    opt: {
      nestingLevelWrapper: true
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    icon: UU5.PropTypes.string,
    offset: UU5.PropTypes.number,
    scrollDuration: UU5.PropTypes.number,
    size: UU5.PropTypes.oneOf(["s", "m", "l", "xl"]),
    bgStyle: UU5.PropTypes.oneOf(["filled", "outline", "transparent"]),
    borderRadius: UU5.PropTypes.string,
    elevation: UU5.PropTypes.oneOf(["-1", "0", "1", "2", "3", "4", "5", -1, 0, 1, 2, 3, 4, 5]),
    elevationHover: UU5.PropTypes.oneOf(["-1", "0", "1", "2", "3", "4", "5", -1, 0, 1, 2, 3, 4, 5])
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      icon: "mdi-chevron-up",
      offset: 150,
      scrollDuration: 800,
      size: "m",
      bgStyle: "outline",
      borderRadius: null,
      elevation: null,
      elevationHover: null
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  getInitialState() {
    return {
      visible: false
    };
  },

  componentDidMount() {
    this._scrollElement = document.getElementById(UU5.Environment.scrollElementId);
    if (this._scrollElement) {
      UU5.Environment.EventListener.addEvent(this._scrollElement, "scroll", this.getId(), this._onScroll);
    } else {
      UU5.Environment.EventListener.addWindowEvent("scroll", this.getId(), this._onScroll);
    }

    if (UU5.Common.Tools.isIE() || this._isSafari()) {
      this._updateInterval = setInterval(this._scrollCalculate, 1000);
    }

    if (this._scrollElement && (UU5.Common.Tools.isIE() || this._isSafari())) {
      let position = getComputedStyle(this._scrollElement).position;
      if (position === "static") {
        this._scrollElement.style.position = "relative";
      }
    }

    this.setState({
      isInside: this._scrollElement ? this._scrollElement.contains(this.findDOMNode()) : false
    });
  },

  componentWillUnmount() {
    if (this._scrollElement) {
      UU5.Environment.EventListener.removeEvent(this._scrollElement, "scroll", this.getId(), this._onScroll);
    } else {
      UU5.Environment.EventListener.removeWindowEvent("scroll", this.getId());
    }
    clearInterval(this._updateInterval);
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  _scrollCalculate(scrollElement = this._scrollElement || document.scrollingElement || document.documentElement) {
    let offset = scrollElement.scrollTop;
    if (!this._visible) {
      if (offset >= this.props.offset) {
        this._visible = true;
        this.setState({ visible: true });
      }
    } else if (offset < this.props.offset) {
      this._visible = false;
      this.setState({ visible: false });
    }
    if (this._scrollElement && (UU5.Common.Tools.isIE() || this._isSafari())) {
      if (this.state.isInside) {
        let offsetY =
          this._scrollElement.scrollTop +
          this._scrollElement.getBoundingClientRect().height -
          (this.props.size === "s" ? 32 : this.props.size === "m" ? 40 : this.props.size === "l" ? 48 : 56);
        this.setState({
          offsetY: offsetY
        });
      }
    }
  },

  _onScroll(e) {
    this._scrollCalculate();
  },

  _scroll() {
    UU5.Common.Tools.scrollToTarget(
      UU5.Environment.scrollElementId || null,
      this.props.scrollDuration,
      0,
      this._scrollElement
    );
  },

  _isSafari() {
    // Replace Tools.isSafari() with this function when ready
    return navigator.userAgent.match("Safari") && !navigator.userAgent.match("Chrome/");
  },
  //@@viewOff:private

  // Render
  _buildMainAttrs() {
    let mainProps = this.getMainPropsToPass();
    mainProps.hidden = !this.state.visible;
    mainProps.colorSchema = this.props.colorSchema;
    mainProps.nestingLevel = this.getNestingLevel();
    mainProps.size = this.props.size;
    mainProps.bgStyle = this.props.bgStyle;
    mainProps.elevation = this.props.elevation;
    mainProps.elevationHover = this.props.elevationHover;
    mainProps.borderRadius = this.props.borderRadius;

    if (UU5.Environment.scrollElementId && this.state.isInside && (!UU5.Common.Tools.isIE() || !this._isSafari())) {
      mainProps.className += " " + this.getClassName().stickyButton;
    }

    if (!mainProps.style) {
      mainProps.style = {};
    }

    if (this.state.offsetY != null && this.state.isInside) {
      mainProps.style.position = "absolute";
      mainProps.style.top = this.state.offsetY;
      mainProps.style.bottom = "auto";
    }

    return mainProps;
  },

  //@@viewOn:render
  render() {
    return (
      <Button {...this._buildMainAttrs()} onClick={this._scroll}>
        <Icon icon={this.props.icon} />
      </Button>
    );
  }
  //@@viewOff:render
});

export default ButtonToTop;
