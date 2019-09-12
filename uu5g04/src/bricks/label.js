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
const ClassNames = UU5.Common.ClassNames;
import Icon from './icon.js';

import "./label.less";

export const Label = createReactClass({
  //@@viewOn:mixins
  mixins: [
    UU5.Common.BaseMixin,
    UU5.Common.PureRenderMixin,
    UU5.Common.ElementaryMixin,
    UU5.Common.ColorSchemaMixin,
    UU5.Common.ContentMixin,
    UU5.Common.NestingLevelMixin
  ],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("Label"),
    nestingLevel: "inline",
    classNames: {
      main: ns.css("label"),
      bgStyle: ns.css("label-"),
      left: ns.css("label-icon-left"),
      right: ns.css("label-icon-right"),
      labelClick: ns.css("label-click"),
      iconClick: ns.css("label-icon-click")
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    bgStyle: PropTypes.oneOf(['filled', 'outline']),
    borderRadius: PropTypes.string,
    elevation: PropTypes.oneOf(['-1', '0', '1', '2', '3', '4', '5', -1, 0, 1, 2, 3, 4, 5]),
    elevationHover: PropTypes.oneOf(['-1', '0', '1', '2', '3', '4', '5', -1, 0, 1, 2, 3, 4, 5]),
    icon: PropTypes.string,
    iconAlign: PropTypes.oneOf(["right", "left"]),
    iconOnClick: PropTypes.func,
    onClick: PropTypes.func
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      bgStyle: "filled",
      borderRadius: null,
      elevation: null,
      elevationHover: null,
      icon: null,
      iconAlign: "right",
      iconOnClick: null,
      onClick: null
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:standardComponentLifeCycle
  //@@viewOff:standardComponentLifeCycle

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:overridingMethods
  //@@viewOff:overridingMethods

  //@@viewOn:componentSpecificHelpers
  _getMainAttrs(){
    let mainAttrs = this.getMainAttrs();
    mainAttrs.className += " " + (this.props.iconAlign === "left" ? this.getClassName().left : this.getClassName().right);

    if (typeof this.props.onClick === "function") {
      mainAttrs.onClick = e => this.props.onClick(this, e);
    }

    if (this.props.onClick) {
      mainAttrs.className += " " + this.getClassName().labelClick;
    }

    if (this.props.bgStyle) {
      mainAttrs.className += " " + this.getClassName("bgStyle") + this.props.bgStyle;
    }

    if (this.props.elevation) {
      mainAttrs.className += " " + ClassNames.elevation + this.props.elevation;
    }

    if (this.props.elevationHover !== null) {
      mainAttrs.className += " " + ClassNames.elevationHover + this.props.elevationHover;
    }

    if (this.props.borderRadius) {
      mainAttrs.style = { ...mainAttrs.style, ...{ borderRadius: this.props.borderRadius } };
    }

    return mainAttrs;
  },

  _iconOnClick(e) {
    if (typeof this.props.iconOnClick === "function") {
      this.props.iconOnClick(this, e);
    }
  },
  //@@viewOff:componentSpecificHelpers

  //@@viewOn:render
  render() {
    return this.getNestingLevel() ? (
      <span {...this._getMainAttrs()}>
        {this.props.iconAlign === 'left' && <Icon id={this.getId() + "_icon"}
          icon={this.props.icon}
          mainAttrs={{onClick: this._iconOnClick}}
          className={this.props.iconOnClick ? this.getClassName().labelClick : null}
        />}
        {this.getChildren()}
        {this.props.iconAlign === 'right' && <Icon id={this.getId() + "_icon"}
          icon={this.props.icon}
          mainAttrs={{onClick: this._iconOnClick}}
          className={this.props.iconOnClick ? this.getClassName().labelClick : null}
        />}
        {this.getDisabledCover()}
      </span>
    ) : null;
  }
  //@@viewOff:render
});

export default Label;
