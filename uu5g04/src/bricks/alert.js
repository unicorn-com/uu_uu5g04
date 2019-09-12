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

import './alert.less';

export const Alert = createReactClass({

  //@@viewOn:mixins
  mixins: [
    UU5.Common.BaseMixin,
    UU5.Common.ElementaryMixin,
    UU5.Common.NestingLevelMixin,
    UU5.Common.ColorSchemaMixin,
    UU5.Common.SectionMixin,
    UU5.Common.PureRenderMixin
  ],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("Alert"),
    nestingLevelList: UU5.Environment.getNestingLevelList('bigBoxCollection', 'box'),
    classNames: {
      main: ns.css("alert"),
      withHeader: ns.css("alert-with-header"),
      withoutHeader: ns.css("alert-without-header"),
      withoutClose: ns.css("alert-without-close"),
      header: ns.css("alert-header"),
      headerWrapper: ns.css("alert-header-wrapper"),
      content: ns.css("alert-content"),
      position: ns.css("alert-"),
      block: ns.css("alert-block"),
      close: ns.css("alert-close")
    },
    defaults: {
      transitionDuration: 150,
      closeIcon: 'mdi-close'
    },
    opt: {
      nestingLevelWrapper: true
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    position: PropTypes.oneOf([
      'left',
      'center',
      'right'
    ]),
    closeTimer: PropTypes.number,
    closeDisabled: PropTypes.bool,
    block: PropTypes.bool,
    onClose: PropTypes.func,
    onCloseAfter: PropTypes.func,
    onCloseBefore: PropTypes.func
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps: function () {
    return {
      position: 'center',
      closeTimer: null,
      closeDisabled: false,
      block: false,
      onClose: null,
      onCloseAfter: null,
      onCloseBefore: null
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:standardComponentLifeCycle
  componentWillReceiveProps: function (nextProps) {
    // it is needed to compare by deepEqual function because pureRenderMixin uses this function in shouldCOmponentRender to compare equality of props.
    !UU5.Common.Tools.deepEqual(nextProps.content, this.props.content) && this._clearTimeout();
  },

  componentWillUnmount: function () {
    this._clearTimeout();
  },
  //@@viewOff:standardComponentLifeCycle

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:overridingMethods
  //@@viewOff:overridingMethods

  //@@viewOn:componentSpecificHelpers
  _clearTimeout: function () {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
    return this;
  },

  _hide: function () {
    var alert = this;
    this._clearTimeout();

    if (typeof this.props.onCloseBefore === 'function') {
      this.props.onCloseBefore(alert);
    }

    this._hideFunc();

    return this;
  },

  _hideFunc: function () {
    var alert = this;
    this.hide(
      (typeof this.props.onClose === 'function' || typeof this.props.onCloseAfter === 'function') ? function () {
          setTimeout(function () {
            (typeof alert.props.onCloseAfter === 'function') ?
              alert.props.onCloseAfter(alert) :
              alert.props.onClose(alert);
          }, this.getDefault().transitionDuration);
        } : null);
  },

  //@@viewOff:componentSpecificHelpers

  // Render
  _getMainAttrs: function () {
    var mainAttrs = this.getMainAttrs();
    mainAttrs.className += ' ' + this.getClassName().position + this.props.position;
    this.props.block && (mainAttrs.className += ' ' + this.getClassName().block);

    mainAttrs.style = mainAttrs.style || {};

    var time = this.getDefault().transitionDuration / 1000;
    ['WebkitTransitionDuration', 'MozTransitionDuration', 'MsTransitionDuration',
      'OTransitionDuration', 'transitionDuration'].forEach(function (style) {
      mainAttrs.style[style] = time + 's';
    });

    return mainAttrs;
  },

  _manageTimeout: function () {
    if (this.props.closeTimer) {
      if (this.isHidden()) {
        this._clearTimeout();
      } else if (!this.timeout) {
        this.timeout = setTimeout(this._hide, this.props.closeTimer);
      }
    }
  },

  _getChildren(header, content) {
    let result = [];

    if (header && content) {
      result.push(
        <div className={this.getClassName('headerWrapper')} key="header">
          <div className={this.getClassName('header')}> {this.getHeader()} </div>
          {!this.props.closeDisabled &&
          <Link className={this.getClassName().close} onClick={this._hide} parent={this} colorSchema="custom">
            <Icon icon={this.getDefault('closeIcon')} />
          </Link>}
        </div>
      );
    } else if (header && !content) {
      result.push(
        <div className={this.getClassName('headerWrapper')} key="content">
          <div className={this.getClassName("content")}>{header}</div>
          {!this.props.closeDisabled &&
          <Link className={this.getClassName().close} onClick={this._hide} parent={this} colorSchema="custom">
            <Icon icon={this.getDefault('closeIcon')} />
          </Link>}
        </div>
      );
    }

    if (content && header) {
      result.push(
        <div className={this.getClassName('content')} key="content">
          {content}
        </div>
      );
    } else if (content && !header) {
      result.push(
        <div className={this.getClassName('headerWrapper')} key="content">
          <div className={this.getClassName("content")}>{content}</div>
          {!this.props.closeDisabled &&
          <Link className={this.getClassName().close} onClick={this._hide} parent={this} colorSchema="custom">
            <Icon icon={this.getDefault('closeIcon')} />
          </Link>}
        </div>
      );
    }

    result.push(this.getDisabledCover());

    return result;
  },

  //@@viewOn:render
  render: function () {
    let mainAttrs = this._getMainAttrs();
    let header = this.getHeader();
    let content = this.getChildren();
    if (header && content) {
      mainAttrs.className += ' ' + this.getClassName('withHeader');
    } else {
      mainAttrs.className += ' ' + this.getClassName('withoutHeader');
    }

    if (this.props.closeDisabled) {
      mainAttrs.className += " " + this.getClassName("withoutClose");
    }

    this._manageTimeout();

    return (
      this.getNestingLevel()
        ? (
          <div {...mainAttrs}>
            {this._getChildren(header, content)}
          </div>
        ) : null
    );
  }
  //@@viewOff:render
});

export default Alert;
