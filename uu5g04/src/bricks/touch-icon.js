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

import Link from './link.js';
import Icon from './icon.js';

import './touch-icon.less';

export const TouchIcon = createReactClass({

  //@@viewOn:mixins
  mixins: [
    UU5.Common.BaseMixin,
    UU5.Common.PureRenderMixin,
    UU5.Common.ElementaryMixin,
    UU5.Common.NestingLevelMixin,
    UU5.Common.ContentMixin,
    UU5.Common.ColorSchemaMixin,
    UU5.Common.EditableMixin
  ],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("TouchIcon"),
    nestingLevel: 'smallBox',
    classNames: {
      main: ns.css("touch-icon"),
      body: ns.css("touch-icon-body"),
      label: ns.css("touch-icon-label"),
      icon: ns.css("touch-icon-icon"),
      bgStyle: ns.css("touch-icon-")
    },
    editableComponent: "UU5.BricksEditable.TouchIcon"
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    icon: PropTypes.string,
    href: PropTypes.string,
    target: PropTypes.oneOf(['_blank', '_parent', '_top', '_self']),
    onClick: PropTypes.func,
    onCtrlClick: PropTypes.func,
    onWheelClick: PropTypes.func,
    borderRadius: PropTypes.string,
    bgStyle: PropTypes.oneOf(['filled', 'transparent'])
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      icon: 'mdi-file',
      href: null,
      target: '_self',
      onClick: null,
      onCtrlClick: null,
      onWheelClick: null,
      borderRadius: null,
      bgStyle: "filled"
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
  _getMainAttrs() {
    let mainAttrs = this.getMainPropsToPass();

    mainAttrs.className += ' ' + this.getClassName().bgStyle + this.props.bgStyle;
    mainAttrs.content = null;
    mainAttrs.onClick = this.props.onClick;
    mainAttrs.onCtrlClick = this.props.onCtrlClick;
    mainAttrs.onWheelClick = this.props.onWheelClick;
    mainAttrs.href = this.props.href;
    mainAttrs.target = this.props.target;

    return mainAttrs;
  },

  _getBodyAttrs() {
    let attrs = {};

    attrs.className = this.getClassName().body;

    if (this.props.borderRadius) {
      attrs.style = { borderRadius: this.props.borderRadius };
    }

    return attrs;
  },
  //@@viewOff:componentSpecificHelpers

  //@@viewOn:render
  render() {
    return (
      this.getNestingLevel()
        ? (
          <Link {...this._getMainAttrs()}>
            <div {...this._getBodyAttrs()}>
              <Icon icon={this.props.icon} className={this.getClassName().icon} />
            </div>
            <div className={this.getClassName().label}>
              {this.getChildren()}
            </div>
          </Link>
        ) : null
    );
  }
  //@@viewOff:render
});

export default TouchIcon;
