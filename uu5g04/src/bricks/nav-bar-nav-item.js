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

import Button from './button.js';

import './nav-bar-nav-item.less';

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
    tagName: ns.name("NavBar.Nav.Item"),
    classNames: {
      main: ns.css("nav-bar-nav-item")
    },
    defaults: {
      parentTagName: 'UU5.Bricks.NavBar.Nav'
    },
    errors: {
      invalidParent: 'Parent of this component is not NavBar.Nav.'
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    onClick: PropTypes.func,
    href: PropTypes.string,
    target: PropTypes.oneOf(['_blank', '_parent', '_top', '_self']),
    _size: PropTypes.string
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps: function () {
    return {
      onClick: null,
      href: undefined,
      target: "_self",
      _size: 'm'
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:standardComponentLifeCycle
  componentWillMount: function () {
    this.checkParentTagName(this.getDefault().parentTagName);

    let parent = this.getParent();

    if (parent) {
      while (parent.getOpt("parentWrapper")) {
        parent = parent.getParent();
      }
    }

    if (!(parent && parent.isNav)) {
      this.showError("invalidParent");
    }
  },

  //@@viewOff:standardComponentLifeCycle

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:overridingMethods
  expandChildProps_(child) {
    const newChildProps = { ...child.props };
    newChildProps.size = this.props._size;
    newChildProps.bgStyle = 'transparent';
    return newChildProps;
  },
  //@@viewOff:overridingMethods

  //@@viewOn:componentSpecificHelpers
  _onClickHandler: function () {
    if (this.isDisabled()) {
      return;
    }
    let parent = this.getParent();

    if (parent) {
      while (parent.getOpt("parentWrapper")) {
        parent = parent.getParent();
      }
    }

    var navBar = parent.getParent();
    navBar.close();
  },
  //@@viewOff:componentSpecificHelpers

  //@@viewOn:render
  render: function () {
    var mainAttrs = this.getMainAttrs();
    mainAttrs.onClick = this._onClickHandler;

    var children = this.getChildren();
    var firstChild = children instanceof Array ? children[0] : children;
    var child;

    if (firstChild) {
      if (firstChild.type && firstChild.type.tagName === 'UU5.Bricks.Dropdown') {
        child = children;
        mainAttrs.onClick = null;
      } else {
        child = (
          <Button
            onClick={this.props.onClick}
            href={this.props.href}
            target={this.props.target}
            parent={this}
            size={this.props._size}
            bgStyle="transparent"
            colorSchema={this.props.colorSchema}
          >
            {children}
          </Button>
        );
      }
    }

    return (
      <li {...mainAttrs}>
        {child}
        {this.getDisabledCover()}
      </li>
    );
  }
  //@@viewOff:render
});
