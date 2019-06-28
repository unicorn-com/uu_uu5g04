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
import ClassNames from '../core/common/class-names.js';

import './button.less';

export const Button = createReactClass({

  //@@viewOn:mixins
  mixins: [
    UU5.Common.BaseMixin,
    UU5.Common.ElementaryMixin,
    UU5.Common.NestingLevelMixin,
    UU5.Common.ColorSchemaMixin,
    UU5.Common.ContentMixin,
    UU5.Common.PureRenderMixin,
    UU5.Common.EditableMixin
  ],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("Button"),
    nestingLevel: 'smallBox',
    classNames: {
      main: ns.css("button"),
      bgStyle: ns.css("button-"),
      text: ns.css("button-text"),
      block: ns.css("button-block"),
      active: 'active',
      size: ns.css("button-"),
      baseline: ns.css("button-baseline")
    },
    defaults: {
      content: 'Button',
      regexpHash: /^#/,
      httpRegexp: /^(\/|[a-z0-9\-+.]+:)/
    },
    editableComponent: "UU5.BricksEditable.Button"
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    size: PropTypes.oneOf(['s', 'm', 'l', 'xl']),
    displayBlock: PropTypes.bool,
    pressed: PropTypes.bool,
    bgStyle: PropTypes.oneOf(['filled', 'outline', 'transparent', 'underline', 'link']),
    onClick: PropTypes.func,
    href: PropTypes.string,
    target: PropTypes.oneOf(['_blank', '_parent', '_top', '_self']),
    smoothScroll: PropTypes.number,
    offset: PropTypes.number,
    borderRadius: PropTypes.string,
    elevation: PropTypes.oneOf(['-1', '0', '1', '2', '3', '4', '5', -1, 0, 1, 2, 3, 4, 5]),
    elevationHover: PropTypes.oneOf(['-1', '0', '1', '2', '3', '4', '5', -1, 0, 1, 2, 3, 4, 5]),
    baseline: PropTypes.bool
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      size: 'm',
      displayBlock: false,
      pressed: false,
      bgStyle: 'filled',
      onClick: null,
      href: null,
      target: '_self',
      smoothScroll: 1000,
      offset: 0,
      borderRadius: null,
      elevation: null,
      elevationHover: null,
      baseline: false
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:standardComponentLifeCycle
  getInitialState() {
    return {
      pressed: this.props.pressed
    };
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.controlled) {
      this.setState({ pressed: nextProps.pressed });
    }
  },

  componentWillMount() {
    if (this.props.bgStyle === "inverted") {
      UU5.Common.Tools.warning('Value "inverted" of property "bgStyle" is deprecated! Use "outline" instead.');
    }
  },
  //@@viewOff:standardComponentLifeCycle

  //@@viewOn:interface
  setActive(pressed, setStateCallback) {
    this.setState({ pressed: pressed }, setStateCallback);
    return this;
  },

  press(setStateCallback) {
    return this.setActive(true, setStateCallback);
  },

  pressUp(setStateCallback) {
    return this.setActive(false, setStateCallback);
  },

  togglePressed(setStateCallback) {
    this.setState(state => ({ pressed: !state.pressed }), setStateCallback);
    return this;
  },

  isPressed() {
    return this.state.pressed;
  },

  focus() {
    this._button && this._button.focus();
  },
  //@@viewOff:interface

  //@@viewOn:overridingMethods
  //@@viewOff:overridingMethods

  //@@viewOn:componentSpecificHelpers
  _onClickHandler(e) {
    this.props.onClick && this.props.onClick(this, e);
    return this;
  },

  _onClickLinkHandler(e, middleClick) {
    let isRouterLink = this._isRoute() && UU5.Environment.getRouter();
    if (e.button === 0 || middleClick) {
      e.preventDefault();
      if (isRouterLink) {
        let [base, ...fragmentParts] = this.props.href.split("#");
        let [path, ...queryParts] = base.split("?");
        let fragment = fragmentParts.join("#");
        let query = queryParts.join("?");
        let params = query ? UU5.Common.Url.decodeQuery("?" + query) : null;

        e.preventDefault();
        if (this.props.target === "_blank") {
          this._openRouteNewTab();
        } else {
          let useCase = path || UU5.Common.Url.parse(location.href).useCase || "";
          UU5.Environment.setRoute(useCase, params, fragment);
        }
      }

      if (typeof this.props.onClick === 'function') {
        this.props.onClick(this, e);
      } else if (typeof this.props.href === 'string' && !isRouterLink) {
        if (e.ctrlKey || (UU5.Common.Tools.isMac() && e.metaKey) || e.button === 1) {
          window.open(this.props.href, '_blank');
        } else {
          if (this._isFragmentLink()) {
            this._onClickFragment(e);
          } else {
            window.open(this.props.href, this.props.target);
          }
        }
      }
    }

    return this;
  },

  _onWheelClickHandler(e) {
    if (e.button === 1) {
      e.stopPropagation();
      this._onClickLinkHandler(e, true);
    }
    return this;
  },

  _onClickFragment(e) {
    e.preventDefault();
    //let basePath = location.href.replace(/#.*/, "");

    let id = this.props.href.replace('#', '');
    let foundElement = document.getElementById(id);

    if (!foundElement) {
      id = id.replace('-inner', '');
      foundElement = document.getElementById(id);
    }

    //let path = basePath + "#" + id;
    //history.pushState(null, document.title, path);
    UU5.Common.Tools.scrollToTarget(id, this.props.smoothScroll, this.props.offset);
    return this;
  },

  _isFragmentLink() {
    return this.props.href && this.props.href.length > 1 && this.props.href.lastIndexOf("#", 0) === 0;
  },

  _openRouteNewTab() {
    window.open(this._getRouteUrl(), "_blank");
  },

  _containsHash(url) {
    return this.getDefault("regexpHash").test(url);
  },

  _isRoute() {
    return (
      this.props.href && !this.getDefault("httpRegexp").test(this.props.href) && !this._containsHash(this.props.href)
    );
  },

  _getRouteUrl() {
    let { href } = this.props;
    let basePath = UU5.Environment.getAppBasePath();
    let usedHref = href.charAt(0) === "?" ? (UU5.Common.Url.parse(location.href).useCase || "") + href : href;
    return basePath ? basePath.replace(/\/*$/, "/") + usedHref.replace(/^\/+/, "") : usedHref;
  },
  //@@viewOff:componentSpecificHelpers

  // Render
  _buildMainAttrs() {
    let mainAttrs = this.getMainAttrs();

    mainAttrs.className += ' ' + this.getClassName('size') + this.props.size +
      ' ' + this.getClassName().bgStyle + (this.props.bgStyle || 'filled') +
      (this.props.displayBlock ? ' ' + this.getClassName('block') : '') +
      (this.isPressed() ? ' ' + this.getClassName('active') : '') +
      (this.props.baseline ? ' ' + this.getClassName('baseline') : '');

    if (this.props.elevation) {
      mainAttrs.className += " " + ClassNames.elevation + this.props.elevation;
    }

    if (this.props.elevationHover !== null) {
      mainAttrs.className += " " + ClassNames.elevationHover + this.props.elevationHover;
    }

    if (this.props.borderRadius) {
      mainAttrs.style = { ...mainAttrs.style, ...{ borderRadius: this.props.borderRadius } };
    }

    if (this.isDisabled()) {
      mainAttrs.disabled = true
    } else {
      if (typeof this.props.onClick === 'function') {
        mainAttrs.onClick = this._onClickHandler;
      } else if (typeof this.props.href === 'string') {
        mainAttrs.href = this._containsHash(this.props.href) ?
          location.href.split('#')[0] + this.props.href :
          this.props.href;

        mainAttrs.onClick = this._onClickLinkHandler;
        mainAttrs.onMouseUp = this._onWheelClickHandler;
      }
    }

    mainAttrs.type = "button";

    return mainAttrs;
  },

  _getChildren() {
    let children = this.getChildren() || this.getDefault().content;
    let newChildren = [];
    children = Array.isArray(children) ? children : [children];
    children.forEach((child, i) => {
      let childType = typeof child;
      let isTextCorrector =
        childType === "object" && child && child.type && child.type.displayName === "UU5.Common.TextCorrectorContextConsumer";
      if (isTextCorrector) {
        childType = typeof child.props.text;
      }
      if (childType === "string") {
        let childLength;
        if (isTextCorrector) {
          let text = child.props.text;
          let replacedText = text.replace(/\n/g, "");
          if (text.length !== replacedText.length) {
            // clone child with new text prop
            child = React.cloneElement(child, { text: replacedText });
          }
          childLength = replacedText.length;
        } else {
          child = child.replace(/\n/g, "");
          childLength = child.length;
        }
        if (childLength) {
          newChildren.push(<span key={i} className={this.getClassName().text}>{child}</span>);
        }
      } else if (childType === "number") {
        newChildren.push(<span key={i} className={this.getClassName().text}>{child}</span>);
      } else {
        newChildren.push(child);
      }
    });

    return newChildren.length > 0 ? newChildren : children;
  },

  //@@viewOn:render
  render() {
    let component;
    component = (
      <button {...this._buildMainAttrs()} ref={(button) => this._button = button}>
        {this._getChildren()}
      </button>
    );

    return this.getNestingLevel() ? component : null;
  }
  //@@viewOff:render
});

export default Button;
