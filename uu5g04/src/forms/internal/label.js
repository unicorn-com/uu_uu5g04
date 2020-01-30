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
import ns from "../forms-ns.js";

import "./label.less";
//@@viewOff:imports

export default UU5.Common.VisualComponent.create({
  displayName: "label", // for backward compatibility (test snapshots)
  //@@viewOn:mixins
  mixins: [
    UU5.Common.BaseMixin,
    UU5.Common.PureRenderMixin,
    UU5.Common.ContentMixin,
    UU5.Common.LsiMixin,
    UU5.Common.ColorSchemaMixin
  ],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("Label"),
    classNames: {
      main: ns.css("label"),
      labelContent: ns.css("label-content"),
      required: ns.css("label-required"),
      tooltip: ns.css("label-tooltip"),
      tooltipWrapper: ns.css("label-tooltip-wrapper"),
      withWidth: ns.css("with-label-width")
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    for: UU5.PropTypes.string,
    required: UU5.PropTypes.bool,
    width: UU5.PropTypes.string,
    tooltipIcon: UU5.PropTypes.string
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      for: null,
      required: false,
      width: null,
      tooltipIcon: "mdi-information-outline"
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  shouldComponentUpdate_(newProps, newState) {
    let result = false;
    if (
      newProps.for != this.props.for ||
      newProps.content != this.props.content ||
      newProps.children != this.props.children
    ) {
      result = true;
    }
    return result;
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  _getLabelWidth() {
    return this.props.width === "auto" ? null : this.props.width;
  },

  _getTooltip() {
    let tooltip = this.getTooltip();
    let result;

    if (tooltip) {
      if (this.props.colorSchema) {
        result = (
          <UU5.Bricks.Text colorSchema={this.props.colorSchema} className={this.getClassName("tooltipWrapper")}>
            <UU5.Bricks.Icon tooltip={tooltip} icon={this.props.tooltipIcon} className={this.getClassName("tooltip")} />
          </UU5.Bricks.Text>
        );
      } else {
        result = (
          <UU5.Bricks.Icon tooltip={tooltip} icon={this.props.tooltipIcon} className={this.getClassName("tooltip")} />
        );
      }
    }

    return result;
  },

  _getMainAttrs() {
    let mainAttrs = this.getMainAttrs();
    let labelAttrs = {};
    this.props.for && (labelAttrs.htmlFor = this.props.for);

    if (this.props.colWidth) {
      mainAttrs.className += " " + this.props.colWidth;
    }

    if (this.props.required) {
      mainAttrs.className += " " + this.getClassName("required");
    }

    if (this.props.width) {
      mainAttrs.className += " " + this.getClassName("withWidth");
      mainAttrs.style = { width: this._getLabelWidth() };
    }

    return { mainAttrs, labelAttrs };
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    const { mainAttrs, labelAttrs } = this._getMainAttrs();
    return (
      <UU5.Bricks.Div {...mainAttrs}>
        <label {...labelAttrs}>
          {UU5.Common.Tools.wrapIfExists(
            UU5.Common.Fragment,
            <span className={this.getClassName("labelContent")}>{this.getChildren()}</span>,
            this._getTooltip()
          )}
        </label>
      </UU5.Bricks.Div>
    );
  }
  //@@viewOn:render
});
