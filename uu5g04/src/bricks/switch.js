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

import "./switch.less";
//@@viewOff:imports

export const Switch = UU5.Common.VisualComponent.create({
  displayName: "Switch", // for backward compatibility (test snapshots)
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin, UU5.Common.PureRenderMixin, UU5.Common.ElementaryMixin, UU5.Common.ColorSchemaMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("Switch"),
    classNames: {
      main: ns.css("switch"),
      off: ns.css("switch-off"),
      on: ns.css("switch-on"),
      icon: ns.css("switch-icon"),
      loading: ns.css("switch-loading"),
      loadingIcon: "uu5-forms-input-loading-icon",
      originalColorSchema: "original-color-schema-"
    },
    defaults: {
      offIcon: "mdi-close",
      onIcon: "mdi-check"
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    switchedOn: UU5.PropTypes.bool,
    size: UU5.PropTypes.oneOf(["s", "m", "l", "xl"]),
    offIcon: UU5.PropTypes.string,
    onIcon: UU5.PropTypes.string,
    onChange: UU5.PropTypes.func,
    loading: UU5.PropTypes.bool,
    colorSchemaOff: UU5.PropTypes.string
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      switchedOn: false,
      size: "m",
      offIcon: this.defaults.offIcon,
      onIcon: this.defaults.onIcon,
      onChange: null,
      loading: false,
      colorSchemaOff: "grey"
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  getInitialState() {
    return {
      switchedOn: this.props.switchedOn
    };
  },
  //@@viewOff:reactLifeCycle
  componentWillReceiveProps(nextProps) {
    if (nextProps.controlled) {
      this.setState({ switchedOn: nextProps.switchedOn });
    }
  },
  //@@viewOn:interface
  setSwitched(switchedOn, setStateCallback) {
    this.setState({ switchedOn: switchedOn }, setStateCallback);
    return this;
  },

  switchOn(setStateCallback) {
    return this.setSwitched(true, setStateCallback);
  },

  switchOff(setStateCallback) {
    return this.setSwitched(false, setStateCallback);
  },

  toggle(setStateCallback) {
    this.setState(state => ({ switchedOn: !state.switchedOn }), setStateCallback);
    return this;
  },

  isSwitchedOn() {
    return this.state.switchedOn;
  },

  onChangeDefault(opt) {
    this.toggle();
    return this;
  },

  focus() {
    this._buttonSwitch && this._buttonSwitch.focus();
  },
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  _getMainPropsToPass() {
    let props = this.getMainPropsToPass();
    props.onClick = e => {
      this._onChange(e);
    };
    props.className += " " + (this.state.switchedOn ? this.getClassName("on") : this.getClassName("off"));

    if (this.props.loading) {
      props.className += " " + this.getClassName("loading");
    }

    if (!this.isSwitchedOn()) {
      props.className = props.className.replace(/color-schema-[a-z-]+ ?/, "");
      props.className += " " + this.getClassName("originalColorSchema") + this.props.colorSchema;
    }

    return props;
  },

  _onChange(component, e) {
    let opt = { switchedOn: !this.state.switchedOn, event: e, component: this };
    if (!this.isDisabled()) {
      e.stopPropagation();
      if (typeof this.props.onChange === "function") {
        this.props.onChange(opt);
      } else if (typeof this.props.onClick === "function") {
        UU5.Common.Tools.warning(
          "Property 'onClick' of the UU5.Bricks.Switch component is deprecated! Use 'onChange' instead."
        );
        this.props.onClick(this, e);
      } else {
        this.onChangeDefault(opt);
      }
    }

    return this;
  },

  _getFill() {
    let xPos = this.isSwitchedOn() ? "200" : "100";
    let holeId = this.getId() + "-hole";
    return (
      <svg
        style={{ width: "100%", height: "100%", position: "absolute", left: "0px", top: "0px" }}
        viewBox="0 0 300 200"
      >
        <defs>
          <mask id={holeId}>
            <rect width="100%" height="100%" fill="white" />
            <circle r="80" cx={xPos} cy="100" fill="black" />
          </mask>
        </defs>

        <path
          d="M100,0 A70,70 0 0,0 100,200 H200 A70,70 0 0,0 200,0 H100"
          id="shape"
          cx="200"
          cy="100"
          mask={
            (navigator.userAgent.match("Safari") && !navigator.userAgent.match("Chrome/")
              ? `url(${location.href.replace(/#.*/, "")}`
              : `url(`) + `${"#" + holeId})`
          }
        />
      </svg>
    );
  },

  _getButtonContent() {
    let content;

    if (this.props.loading) {
      content = (
        <span className={this.getClassName().loadingIcon}>
          <svg width="24" height="24" viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg">
            <defs key="defs">
              <linearGradient key="gradient1" id={"gradient1_" + this.getId()} x1="0" y1="0" x2="1" y2="1">
                <stop key="stop1" offset="0%" stopColor="rgba(0, 0, 0, 0)" />
                <stop key="stop2" offset="100%" stopColor="rgba(0, 0, 0, 0.33)" />
              </linearGradient>
              <linearGradient key="gradient2" id={"gradient2_" + this.getId()} x1="1" y1="0" x2="0" y2="1">
                <stop key="stop1" offset="0%" stopColor="rgba(0, 0, 0, 0.33)" />
                <stop key="stop2" offset="100%" stopColor="rgba(0, 0, 0, 0.66)" />
              </linearGradient>
              <linearGradient key="gradient3" id={"gradient3_" + this.getId()} x1="1" y1="1" x2="0" y2="0">
                <stop key="stop1" offset="0%" stopColor="rgba(0, 0, 0, 0.66)" />
                <stop key="stop2" offset="100%" stopColor="rgba(0, 0, 0, 1)" />
              </linearGradient>
            </defs>
            <path
              key="path1"
              d="M50 10 a40 40 0 0 1 40 40"
              fill="none"
              stroke={
                (navigator.userAgent.match("Safari") && !navigator.userAgent.match("Chrome/")
                  ? `url(${location.href.replace(/#.*/, "")}`
                  : `url(`) + `${"#gradient1_" + this.getId()})`
              }
              strokeWidth="20"
            />
            <path
              key="path2"
              d="M90 50 a40 40 0 0 1 -40 40"
              fill="none"
              stroke={
                (navigator.userAgent.match("Safari") && !navigator.userAgent.match("Chrome/")
                  ? `url(${location.href.replace(/#.*/, "")}`
                  : `url(`) + `${"#gradient2_" + this.getId()})`
              }
              strokeWidth="20"
            />
            <path
              key="path3"
              d="M50 90 a40 40 0 0 1 -40 -40"
              fill="none"
              stroke={
                (navigator.userAgent.match("Safari") && !navigator.userAgent.match("Chrome/")
                  ? `url(${location.href.replace(/#.*/, "")}`
                  : `url(`) + `${"#gradient3_" + this.getId()})`
              }
              strokeWidth="20"
            />
          </svg>
        </span>
      );
    } else {
      content = UU5.Common.Tools.wrapIfExists(
        UU5.Common.Fragment,
        this._getFill(),
        <UU5.Bricks.Icon
          icon={
            this.state.switchedOn
              ? this.props.onIcon || this.getDefault().onIcon
              : this.props.offIcon || this.getDefault().offIcon
          }
          className={this.getClassName("icon")}
        />
      );
    }

    return content;
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    return (
      <UU5.Bricks.Button
        {...this._getMainPropsToPass()}
        ref_={buttonSwitch => (this._buttonSwitch = buttonSwitch)}
        size={this.props.size}
        onClick={this._onChange}
        colorSchema={this.isSwitchedOn() ? this.props.colorSchema : this.props.colorSchemaOff}
        content={this._getButtonContent()}
      />
    );
  }
  //@@viewOn:render
});

export default Switch;
