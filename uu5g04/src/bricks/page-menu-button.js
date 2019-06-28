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

import React from "react";
import createReactClass from 'create-react-class';
import PropTypes from "prop-types";
import * as UU5 from "uu5g04";
import ns from "./bricks-ns.js";

import Button from './button.js';

import './page-menu-button.less';

export const MenuButton = createReactClass({

  //@@viewOn:mixins
  mixins: [
    UU5.Common.BaseMixin,
    UU5.Common.ElementaryMixin,
    UU5.Common.ContentMixin,
    UU5.Common.ColorSchemaMixin,
    UU5.Common.NestingLevelMixin,
    UU5.Common.CcrReaderMixin
  ],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("Page.MenuButton"),
    nestingLevel: 'smallBox',
    classNames: {
      main: ns.css("page-menu-button"),
      left: ns.css("page-menu-button-left"),
      right: ns.css("page-menu-button-right")
    },
    opt: {
      nestingLevelWrapper: true
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    menu: PropTypes.oneOf(['left', 'right']),
    onClick: PropTypes.func,
    pageKey: PropTypes.string,
    size: PropTypes.string,
    displayBlock: PropTypes.bool,
    pressed: PropTypes.bool,
    bgStyle: PropTypes.oneOf(['filled', 'outline', 'transparent', 'underline', 'link']),
    borderRadius: PropTypes.string,
    elevation: PropTypes.oneOf(['-1', '0', '1', '2', '3', '4', '5', -1, 0, 1, 2, 3, 4, 5]),
    elevationHover: PropTypes.oneOf(['-1', '0', '1', '2', '3', '4', '5', -1, 0, 1, 2, 3, 4, 5])
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      menu: 'left',
      onClick: null,
      pageKey: null,
      size: 'm',
      displayBlock: false,
      pressed: false,
      bgStyle: "filled",
      borderRadius: null,
      elevation: null,
      elevationHover: null
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:standardComponentLifeCycle
  componentDidMount() {
    UU5.Environment.EventListener.registerEvent('pageColumn', this.getId(), this._setVisibility);
  },
  //@@viewOff:standardComponentLifeCycle

  //@@viewOn:interface
  onClickDefault(component, e) {
    let page = this._getPage();
    if (page) {
      switch (this.props.menu) {
        case 'left':
          page.toggleLeft();
          break;
        case 'right':
          page.toggleRight();
          break;
      }
    }
    
    return this;
  },
  //@@viewOff:interface

  //@@viewOn:overridingMethods
  //@@viewOff:overridingMethods

  //@@viewOn:componentSpecificHelpers
  _getPage() {
    return this.getCcrComponentByKey(this.props.pageKey || UU5.Environment.CCRKEY_PAGE);
  },

  _onClick(button, e) {
    if (typeof this.props.onClick === 'function') {
      this.props.onClick(this, e);
    } else {
      this.onClickDefault(this, e)
    }
    return this;
  },

  _isFloat() {
    let float = false;
    let page = this._getPage();

    if (page) {
      switch (this.props.menu) {
        case 'left':
          float = page.isLeftFloat();
          break;
        case 'right':
          float = page.isRightFloat();
          break;
        default:
          float = false;
      }
    }
    return float;
  },

  _getPropsToPass() {
    let props = this.getMainPropsToPass();
    props.className = props.className + ' ' + this.getClassName(this.props.menu);
    props.size = this.props.size;
    props.displayBlock = this.props.displayBlock;
    props.pressed = this.props.pressed;
    props.bgStyle = this.props.bgStyle;
    props.borderRadius = this.props.borderRadius;
    props.elevation = this.props.elevation;
    props.elevationHover = this.props.elevationHover;
    return props;
  },

  _getChild() {
    let child = null;
    let content = this.props.content || this.getChildren() || <UU5.Bricks.Icon icon="mdi-menu" />;
    if (this._isFloat()) {
      child = <Button
        {...this._getPropsToPass()}
        onClick={this._onClick}
        content={content}
      />
    }
    return child;
  },

  _setVisibility(menu, visible) {
    menu === this.props.menu && this.setAsyncState({ hidden: !visible });
    return this;
  },
  //@@viewOff:componentSpecificHelpers

  //@@viewOn:render
  render() {
    return (
      this.getNestingLevel()
        ? this._getChild()
        : null
    )
  },
  //@@viewOff:render

});

export default MenuButton;
