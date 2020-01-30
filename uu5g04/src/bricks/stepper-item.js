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
import { withStepperContext } from "./stepper-context.js";

import "./stepper-item.less";
//@@viewOff:imports

const StepperItemBase = UU5.Common.VisualComponent.create({
  displayName: "StepperItem", // for backward compatibility (test snapshots)
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin, UU5.Common.ColorSchemaMixin, UU5.Common.ElementaryMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("Stepper.Item"),
    classNames: {
      main: ns.css("stepper-item"),
      stepperItemButton: ns.css("stepper-item-button"),
      buttonText: ns.css("stepper-item-button-text")
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    size: UU5.PropTypes.oneOf(["s", "m", "l", "xl"]),
    onClick: UU5.PropTypes.func,
    borderRadius: UU5.PropTypes.string,
    bgStyle: UU5.PropTypes.oneOf(["filled", "outline", "transparent", "underline"]),
    elevation: UU5.PropTypes.oneOf(["-1", "0", "1", "2", "3", "4", "5", -1, 0, 1, 2, 3, 4, 5]),
    topVisitedStep: UU5.PropTypes.number,
    currentStep: UU5.PropTypes.number,
    index: UU5.PropTypes.number
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      size: "m",
      onClick: null,
      borderRadius: null,
      bgStyle: "transparent",
      elevation: null,
      topVisitedStep: 0,
      currentStep: 0,
      index: 0
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  _handleClick(button, e) {
    button.findDOMNode().blur();
    if (typeof this.props.onClick === "function") {
      this.props.onClick({ component: this, event: e, value: this.props.index });
    }
  },

  _renderIcon() {
    // filled number and border (active step)
    if (this.props.currentStep === this.props.index && this.props.currentStep >= this.props.topVisitedStep) {
      return (
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <mask id={this.getId() + "-svgMaskFilled"}>
            <rect fill="white" x="0" y="0" width="100%" height="100%" />
            <text
              fill="black"
              x="50%"
              y="50%"
              dominantBaseline="middle"
              textAnchor="middle"
              dy={UU5.Common.Tools.isEdge() || UU5.Common.Tools.isIE() ? "0.3em" : "0.05em"}
              fontSize="14"
              fontWeight="bold"
            >
              {this.props.index + 1}
            </text>
          </mask>

          <circle
            cx="50%"
            cy="50%"
            r="40%"
            fill="currentColor"
            strokeWidth="2"
            mask={
              (navigator.userAgent.match("Safari") && !navigator.userAgent.match("Chrome/")
                ? `url(${location.href.replace(/#.*/, "")}`
                : `url(`) + `#${this.getId() + "-svgMaskFilled"})`
            }
          />
        </svg>
      );
    }
    //transparent check with filled background (completed check)
    else if (this.props.topVisitedStep > this.props.index && this.props.currentStep !== this.props.index) {
      return (
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50%" cy="50%" r="40%" stroke="currentColor" strokeWidth="2" fill="transparent" />
          <path fill="currentColor" d="M11,16.5L6.5,12L7.91,10.59L11,13.67L16.59,8.09L18,9.5L11,16.5Z" />
        </svg>
      );
    }

    // filled check and border (active check)
    else if (this.props.currentStep === this.props.index && this.props.index < this.props.topVisitedStep) {
      return (
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <mask id={this.getId() + "-svgMask"}>
            <rect fill="white" x="0" y="0" width="100%" height="100%" />
            <path fill="black" d="M11,16.5L6.5,12L7.91,10.59L11,13.67L16.59,8.09L18,9.5L11,16.5Z" />
          </mask>
          <circle
            cx="50%"
            cy="50%"
            r="40%"
            fill="currentColor"
            strokeWidth="2"
            mask={
              (navigator.userAgent.match("Safari") && !navigator.userAgent.match("Chrome/")
                ? `url(${location.href.replace(/#.*/, "")}`
                : `url(`) + `#${this.getId() + "-svgMask"})`
            }
          />
        </svg>
      );
    } else {
      return (
        // transparent text with border (not active steps)
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50%" cy="50%" r="40%" stroke="currentColor" strokeWidth="2" fill="transparent" />
          <text
            fill="currentColor"
            x="50%"
            y="50%"
            dominantBaseline="middle"
            textAnchor="middle"
            dy={UU5.Common.Tools.isEdge() || UU5.Common.Tools.isIE() ? "0.3em" : "0.05em"}
            fontSize="14"
            fontWeight="bold"
          >
            {this.props.index + 1}
          </text>
        </svg>
      );
    }
  },
  _getMainPropsToPass() {
    const mainProps = this.getMainPropsToPass();
    mainProps.className += " " + this.getClassName().stepperItemButton;
    return mainProps;
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    return (
      <UU5.Bricks.Button
        baseline={true}
        {...this._getMainPropsToPass()}
        colorSchema={this.props.colorSchema}
        bgStyle={this.props.itemProps.bgStyle || this.props.bgStyle}
        borderRadius={this.props.borderRadius || this.props.itemProps.borderRadius}
        elevation={this.props.elevation || this.props.itemProps.elevation}
        onClick={this._handleClick}
        size={this.props.size}
      >
        {this._renderIcon()}

        {this.props.children ? <span className={this.getClassName().buttonText}>{this.props.children}</span> : null}
      </UU5.Bricks.Button>
    );
  }
  //@@viewOff:render
});

export const StepperItem = withStepperContext(StepperItemBase);
export default StepperItem;
