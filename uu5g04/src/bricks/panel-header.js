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

import './panel-header.less';

export default createReactClass({

  //@@viewOn:mixins
  mixins: [
    UU5.Common.BaseMixin,
    UU5.Common.PureRenderMixin,
    UU5.Common.ElementaryMixin,
    UU5.Common.ContentMixin,
    UU5.Common.ColorSchemaMixin
  ],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("Panel.Header"),
    classNames: {
      main: ns.css("panel-header"),
      click: ns.css("panel-header-click"),
      content: ns.css("panel-header-content"),
      after: ns.css("panel-header-icon-after"),
      right: ns.css("panel-header-icon-right"),
      left: ns.css("panel-header-icon-left"),
      openClickIcon: ns.css("panel-icon-open-click"),
      openClickHeader: ns.css("panel-header-open-click"),
      iconButton: ns.css("panel-header-button-icon"),
      icon: ns.css("panel-header-icon")
    },
    defaults: {
      parentTagName: 'UU5.Bricks.Panel'
    },
    errors: {
      invalidParent: 'Parent of this component is not Panel.'
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    _icon: PropTypes.string,
    _onClick: PropTypes.func,
    _disableHeaderClick: PropTypes.bool,
    iconAlign: PropTypes.oneOf(["right", "after", "left"]),
    openClick: PropTypes.oneOf(["header", "icon", "none"]),
    bgStyle: PropTypes.oneOf(['filled', 'outline', 'transparent', 'underline'])
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      _icon: null,
      _onClick: null,
      _disableHeaderClick: undefined,
      iconAlign: "right",
      openClick: "header",
      bgStyle: null
    };
  },
  //@@viewOff:getDefaultProps
  getInitialState() {
    if (this.props._disableHeaderClick === true || this.props._disableHeaderClick === false) {
      UU5.Common.Tools.warning("Props disableHeaderClick is deprecated. Use props openClick instead.");
    }
  },

  //@@viewOn:standardComponentLifeCycle
  componentWillMount() {
    let parent = this.getParent();

    if (parent) {
      while (parent.getOpt("parentWrapper")) {
        parent = parent.getParent();
      }
    }

    if (!(parent && parent.isPanel)) {
      this.showError("invalidParent");
    }
  },

  //@@viewOff:standardComponentLifeCycle

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:overridingMethods
  //@@viewOff:overridingMethods

  //@@viewOn:componentSpecificHelpers
  _onClickHandler(comp, e) {
    if (e && e.currentTarget && e.currentTarget.blur) e.currentTarget.blur();
    this.props._onClick(comp, e);
    return this;
  },

  _getBorderRadiusButton(){
    if(this.props.openClick === "icon"){
      if (this.props.style.borderRadius) {
        if ( this.props.iconAlign === "left"){
          let borderRadius;
          let border = this.props.style.borderRadius;
          let splitBorderLeft = border.split(" ");
          if (splitBorderLeft.length === 1) {
            return (borderRadius = splitBorderLeft[0] + " " + 0 + " " + 0 + " " + splitBorderLeft[0]);
          } else if (splitBorderLeft.length === 2) {
            return (borderRadius = splitBorderLeft[0] + " " + 0 + " " + 0 + " " + splitBorderLeft[1]);
          } else if (splitBorderLeft.length === 3) {
            return (borderRadius = splitBorderLeft[0] + " " + 0 + " " + 0 + " " + splitBorderLeft[2]);
          } else if (splitBorderLeft.length === 4) {
            return (borderRadius = splitBorderLeft[0] + " " + 0 + " " + 0 + " " + splitBorderLeft[3]);
          }
        }
        if ( this.props.iconAlign === "right"){
          let borderRadius;
          let border = this.props.style.borderRadius;
          let splitBorderRight = border.split(" ");
          if (splitBorderRight.length === 1) {
            return (borderRadius = 0 + " " + splitBorderRight[0] + " " + splitBorderRight[0]) + " " + 0;
          } else if (splitBorderRight.length === 2) {
            return (borderRadius = 0 + " " + splitBorderRight[1] + " " + splitBorderRight[0]) + " " + 0;
          } else if (splitBorderRight.length === 3 || splitBorderRight.length === 4) {
            return (borderRadius = 0 + " " + splitBorderRight[1] + " " + splitBorderRight[2]) + " " + 0;
          }
        }
      }
    }
  },

  _getIcon() {
    let icon;

    if (this.props._icon && this.props.openClick === "icon" && !this.props._disableHeaderClick) {
      icon = (
        <div className={this.getClassName().iconButton} >
          <UU5.Bricks.Button
            borderRadius={this._getBorderRadiusButton()}
            colorSchema={"custom"}
            onClick={this._onClickHandler}
          >
        <Icon className={this.getClassName().icon} icon={this.props._icon} />
        </UU5.Bricks.Button>
        </div>
      );
    } else if (this.props._icon) {
      icon = <Icon className={this.getClassName().icon} icon={this.props._icon} />;
    }

    return icon;
  },

  _buildMainAttrs() {
    let mainAttrs = this.getMainAttrs();
    if (!this.props._disableHeaderClick) {
      if (this.props._icon && this.props.openClick === "icon") {
        mainAttrs.className += " " + this.getClassName().openClickIcon + " " + this.getClassName().click;
      }

      if (this.props.openClick === "header" && !this.props._disableHeaderClick) {
        mainAttrs.onClick = this._onClickHandler;
        mainAttrs.className += " " + ClassNames.hover;
        if (this.props._icon) {
          mainAttrs.className += " " + this.getClassName().openClickHeader + " " + this.getClassName().click;
        }
      }
    }

    if (this.props.bgStyle) {
      mainAttrs.className += " " + ClassNames[this.props.bgStyle];
    }
    if(this.props._icon){
      mainAttrs.className += ' ' +
      (this.props.iconAlign === 'after' ? this.getClassName().after :
      this.props.iconAlign === "left" ? this.getClassName().left :
      this.props.iconAlign === 'right' ? this.getClassName().right :
      null);
    }
      return mainAttrs;
  },
  //@@viewOff:componentSpecificHelpers

  //@@viewOn:render
  render() {
    return (
      <div {...this._buildMainAttrs()}>
        <span className={this.getClassName("content")}>{this.getChildren()}</span>
        {this._getIcon()}
        {this.getDisabledCover()}
      </div>
    );
  }
  //@@viewOff:render
});
