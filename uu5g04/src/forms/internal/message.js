/**
 * Copyright (C) 2021 Unicorn a.s.
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public
 * License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later
 * version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License at
 * <https://gnu.org/licenses/> for more details.
 *
 * You may obtain additional information at <https://unicorn.com> or contact Unicorn a.s. at address: V Kapslovne 2767/2,
 * Praha 3, Czech Republic or at the email: info@unicorn.com.
 */

//@@viewOn:imports
import * as UU5 from "uu5g04";
import "uu5g04-bricks";
import ns from "../forms-ns.js";
import Css from "./css.js";

import "./message.less";
//@@viewOff:imports

const finalStyle = `position: static; visibility: visible; bottom: auto;`;
let animationKeyframes = Css.keyframes`100% {${finalStyle}}`;

export default UU5.Common.VisualComponent.create({
  displayName: "message", // for backward compatibility (test snapshots)
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin, UU5.Common.PureRenderMixin, UU5.Common.ContentMixin, UU5.Common.ColorSchemaMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("Message"),
    classNames: {
      main: () => {
        let result = ns.css("message");
        let animate = true;

        if (navigator.userAgent.match("Safari") && !navigator.userAgent.match("Chrome/")) {
          // Change of position by animation isnt supported in Safari <14
          let version = parseFloat(navigator.userAgent.toLowerCase().split("version/")[1] || 14);
          if (version < 14) animate = false;
        }

        if (animate) {
          // postpone displaying for scenario: Modal with empty focused required Input, click on Cancel button,
          // i.e. mousedown -> blur shows "required" message & Cancel button gets moved down -> mouseup is
          // outside of Cancel -> nothing happens
          result +=
            " " +
            Css.css`
            animation: ${animationKeyframes} 200ms step-end both;
          `;
        } else {
          result += " " + Css.css`${finalStyle}`;
        }

        return result;
      },
    },
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  shouldComponentUpdate_(newProps, newState) {
    let result = false;
    if (newProps.content !== this.props.content || newProps.colorSchema !== this.props.colorSchema) {
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
  _getLabel(label) {
    if (label && typeof label === "object" && !label.type) {
      return <UU5.Bricks.Lsi lsi={label} />;
    } else {
      return label;
    }
  },
  _getMainPropsToPass() {
    let props = this.getMainPropsToPass();
    this.props.colorSchema && (props.className += " uu5-common-text");
    props.content = this._getLabel(props.content || this.getChildren());
    return props;
  },
  //@@viewOff:private

  //@@viewOn:render
  render: function () {
    let Component = this.props.inline ? UU5.Bricks.Span : UU5.Bricks.Div;
    return <Component {...this._getMainPropsToPass()} />;
  },
  //@@viewOn:render
});
