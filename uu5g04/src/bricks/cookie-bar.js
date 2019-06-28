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

import {Div} from './factory.js';
import Span from './span.js';
import Link from './link.js';
import Button from './button.js';
import Icon from './icon.js';

import './cookie-bar.less';

export const CookieBar = createReactClass({

  //@@viewOn:mixins
  mixins: [
    UU5.Common.BaseMixin,
    UU5.Common.ElementaryMixin,
    UU5.Common.ContentMixin,
    UU5.Common.ColorSchemaMixin,
    UU5.Common.NestingLevelMixin,
    UU5.Common.PureRenderMixin
  ],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("CookieBar"),
    nestingLevelList: UU5.Environment.getNestingLevelList('bigBoxCollection', 'box'),
    classNames: {
      main: ns.css("cookie-bar uu5-common-bg"),
      top: ns.css("cookie-bar-top"),
      bottom: ns.css("cookie-bar-bottom"),
      button: ns.css("cookie-bar-button"),
      link: ns.css("cookie-bar-link")
    },
    defaults: {
      content: 'Cookies help us to provide, protect and improve our services. By viewing this site, you agree to their use.',
      expireDays: 10 * 365.25
    },
    opt: {
      nestingLevelRoot: true
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    infoText: PropTypes.any,
    infoHref: PropTypes.string,
    infoTarget: PropTypes.oneOf(['_blank', '_parent', '_top', '_self']),
    fixed: PropTypes.oneOf(['top', 'bottom']),
    onClose: PropTypes.func,
    expireDays: PropTypes.number,
    cookieKey: PropTypes.string,
    cookieValue: PropTypes.string
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      infoText: null,
      infoHref: null,
      infoTarget: '_blank',
      fixed: 'bottom',
      onClose: null,
      expireDays: null,
      cookieKey: 'uu5-cookies',
      cookieValue: 'yes'
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:standardComponentLifeCycle
  componentWillMount() {
    this.props.expireDays ? this._checkCookies() : this._checkLocalStorageItem();
  },

  componentWillReceiveProps(nextProps) {
    this.props.expireDays ? this._checkCookies() : this._checkLocalStorageItem();
  },
  //@@viewOff:standardComponentLifeCycle

  // Interface

  // Overriding Functions

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:overridingMethods
  //@@viewOff:overridingMethods

  //@@viewOn:componentSpecificHelpers
  _checkCookies() {
    if (UU5.Common.Tools.getCookie(this.props.cookieKey) === this.props.cookieValue && !this._isAgreed) {
      this._isAgreed = true;
      this.setState({hidden: true}, this.props.onClose);
    }
    return this;
  },

  _checkLocalStorageItem() {
    const item = localStorage.getItem(this.props.cookieKey);
    if (item === this.props.cookieValue) {
      this.setState({hidden: true}, this.props.onClose);
    }
    return this;
  },

  _setLocalStorageItem() {
    localStorage.setItem((this.props.cookieKey), this.props.cookieValue);
    this.hide(this.props.onClose);
  },

  _confirm() {
    UU5.Common.Tools.setCookie(this.props.cookieKey, this.props.cookieValue, this.props.expireDays || this.getDefault().expireDays);
    this.hide(this.props.onClose);
  },

  _getText() {
    let content = this.getContent();

    if (!content && !this.props.children) {
      content = this.getDefault().content;
    }

    return <Span content={content}>{this.props.children && React.Children.toArray(this.props.children)}</Span>;
  },

  _getButton() {
    return (
      <Button
        className={this.getClassName('button')}
        bgStyle="transparent"
        colorSchema={this.props.colorSchema !== "black" ? "custom" : null}
        size="s"
        onClick={this.props.expireDays ? this._confirm : this._setLocalStorageItem}
      >
        <Icon icon="mdi-close"/>
      </Button>
    );
  },

  _getLink() {
    var link = null;

    if (this.props.infoText) {
      // href -> linkHref || undefined -> if undefined, default prop of link is set - other way, null is set
      link = <Link
        content={this.props.infoText}
        href={this.props.infoHref || undefined}
        className={this.getClassName().link}
        target={this.props.infoTarget}
      />;
    }

    return link;
  },

  _getMainProps() {
    var mainProps = this.getMainPropsToPass(["UU5.Common.BaseMixin", "UU5.Common.ElementaryMixin"]);
    this.props.fixed && (mainProps.className += ' ' + this.getClassName(this.props.fixed));

    mainProps.nestingLevel = this.getNestingLevel();

    return mainProps;
  },
  //@@viewOff:componentSpecificHelpers

  //@@viewOn:render
  render() {
    return (
      <Div {...this._getMainProps()}>
        {this._getText()}
        {this._getLink()}
        {this._getButton()}
      </Div>
    );
  }
  //@@viewOff:render
});

export default CookieBar;