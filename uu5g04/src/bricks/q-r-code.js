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
import createReactClass from "create-react-class";
import PropTypes from "prop-types";
import * as UU5 from "uu5g04";
import ns from "./bricks-ns.js";
import Null from "./null.js";
import Css from "./internal/css.js";
//@@viewOff:imports

const QRCodeGenerator = React.lazy ? React.lazy(() => import("qrcode.react")) : Null;

export const QRCode = createReactClass({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("QRCode"),
    classNames: {
      main:
        ns.css("q-r-code") +
        " " +
        Css.css(`
        display: inline-block;
      `)
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    value: PropTypes.string.isRequired,
    size: PropTypes.number,
    correction: PropTypes.oneOf(["low", "medium", "quartile", "high"])
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      value: undefined,
      size: 128,
      correction: "low"
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
  _getCorrectionLevel() {
    switch (this.props.correction) {
      case "low":
        return "L";
      case "medium":
        return "M";
      case "quartile":
        return "Q";
      case "high":
        return "H";
      default:
        return "L";
    }
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    return (
      <span {...this.getMainAttrs()}>
        <React.Suspense fallback="">
          <QRCodeGenerator
            value={this.props.value}
            level={this._getCorrectionLevel()}
            size={this.props.size}
            renderAs="svg"
          />
        </React.Suspense>
      </span>
    );
  }
  //@@viewOff:render
});

export default QRCode;
