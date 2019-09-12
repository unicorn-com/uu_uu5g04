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
import ns from "./common-ns.js";
import PropTypes from 'prop-types';
import Environment from '../environment/environment.js';
import BaseMixin from './base-mixin.js';
import ElementaryMixin from './elementary-mixin.js';
import NestingLevelMixin from './nesting-level-mixin.js';
import ContentMixin from './content-mixin.js';
import Div from './div.js';
import PureRenderMixin from "./pure-render-mixin.js";
import ColorSchemaMixin from "./color-schema-mixin.js";
import ClassNames from './class-names.js';

import './error.less';

export const Error = createReactClass({

  //@@viewOn:mixins
  mixins: [
    BaseMixin,
    ElementaryMixin,
    NestingLevelMixin,
    ContentMixin,
    PureRenderMixin,
    ColorSchemaMixin
  ],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("Error"),
    nestingLevelList: Environment.getNestingLevelList('smallBox', 'inline'),
    classNames: {
      main: ns.css("error"),
      silent: ns.css("error-silent"),
      nestingLevelSmallBox: ns.css("error-small-box"),
      nestingLevelInline: ns.css("error-inline"),
      icon: ns.css("error-icon"),
      mainWrapper: ns.css("error-main-wrapper"),
      iconWrapper: ns.css("error-icon-wrapper"),
      content: ns.css("error-content"),
      preWrapper: ns.css("error-pre-wrapper"),
      pre: ns.css("error-pre"),
      errorDetails: ns.css("error-details"),
      errorDetailsButton: ns.css("error-details-button"),
      errorDetailsBody: ns.css("error-details-body"),
      errorDetailsOpen: ns.css("error-details-open"),
      errorInfo: ns.css("error-info"),
      copyButton: ns.css("error-copy-info-button")
    },
    defaults: {
      content: 'Error'
    },
    opt: {
      nestingLevelWrapper: true
    },
    lsi: () => (Environment.Lsi.Common.error)
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    errorData: PropTypes.object,
    errorDataSpace: PropTypes.number, // TODO: set deprecated
    error: PropTypes.shape({
      stack: PropTypes.string,
      name: PropTypes.string,
      message: PropTypes.string
    }),
    silent: PropTypes.bool,
    inline: PropTypes.bool,
    moreInfo: PropTypes.bool,
    errorInfo: PropTypes.any, // any - contact info link (ex. link to helpdesk)
    bgStyle: PropTypes.oneOf(['filled', 'outline', 'transparent', 'underline']),
    borderRadius: PropTypes.string,
    elevation: PropTypes.oneOf(["-1", "0", "1", "2", "3", "4", "5", -1, 0, 1, 2, 3, 4, 5])
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      errorData: null,
      errorDataSpace: null, // TODO: set deprecated
      error: null,
      silent: false,
      inline: false,
      moreInfo: false,
      errorInfo: null,
      bgStyle: "filled",
      borderRadius: undefined,
      elevation: undefined
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:standardComponentLifeCycle
  getInitialState() {
    return {
      errorDetails: false
    };
  },

  componentDidMount() {
    if (this._errorElement) {
      this._errorElement.style.maxHeight = this.state.errorDetails ? ((this._errorElement.scrollHeight + 1) + "px") : "0px";
    }
  },

  componentDidUpdate() {
    if (this._errorElement) {
      this._errorElement.style.maxHeight = this.state.errorDetails ? ((this._errorElement.scrollHeight + 1) + "px") : "0px";
    }
  },
  //@@viewOff:standardComponentLifeCycle

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:overridingMethods
  //@@viewOff:overridingMethods

  //@@viewOn:componentSpecificHelpers
  _getMainAttrs() {
    let attrs = this.getMainAttrs();

    switch (this.props.inline ? "inline" : this.getNestingLevel()) {
      case 'inline':
        attrs.className += ' ' + this.getClassName('nestingLevelInline');
        break;
      default:
        attrs.className += ' ' + this.getClassName('nestingLevelSmallBox');
    }

    if (this.props.silent) {
      attrs.className += ' ' + this.getClassName('silent');
    }

    if (this.state.errorDetails) {
      attrs.className += " " + this.getClassName("errorDetailsOpen");
    }

    if (this.props.borderRadius) {
      attrs.style = { ...attrs.style, ...{ borderRadius: this.props.borderRadius } };
    }

    if (this.props.bgStyle) {
      attrs.className += " " + ClassNames[this.props.bgStyle];
    }

    if (this.props.elevation) {
      attrs.className += " " + ClassNames.elevation + this.props.elevation;
    }

    return attrs;
  },

  _getContent() {
    let message =  this.getChildren() || this.getDefault().content;

    let errorData;

    if (this.props.errorData && !this.props.moreInfo) {
      errorData = (
        <div className={this.getClassName("preWrapper")} key="errorData">
          <pre className={this.getClassName("pre")}>
            {JSON.stringify(this.props.errorData, null, 2)}
          </pre>
        </div>
      );
    }

    return errorData ? [message, errorData] : message;
  },

  _setErrorRef(ref) {
    this._errorElement = ref;
  },

  _getMessageString(message) {
    if (message.props && message.props.lsi) {
      if (typeof message.props.lsi === "object") {
        let language = Object.keys(message.props.lsi).find(language => language.match(/^en/));
        if (!language) {
          language = Object.keys(message.props.lsi)[0];
        }

        message = message.props.lsi[language];
      }

      if (message.props && message.props.children) {
        while (message && message.props && message.props.children) {
          message = message.props.children;
        }
      }
    }

    return message.toString();
  },

  _getMoreInfoContent(message) {
    let content = this._getErrorDetailContent(message);
    let className = this.getClassName("errorDetails");
    this.props.silent && (className += ' ' + this.getClassName("silent"))

    return (
      <div className={className} key="errorDetails">
        <a className={this.getClassName("errorDetailsButton")} onClick={this._errorDetailsToggle}>
          {this.getLsiComponent(this.state.errorDetails ? 'hideErrorDetails' : 'showErrorDetails')}
          {this.state.errorDetails ?
            <span className={"mdi mdi-menu-up " + this.getClassName("icon")} /> :
            <span className={"mdi mdi-menu-down " + this.getClassName("icon")} />
          }
        </a>

        <div id={this.getId() + "-error"} className={this.getClassName("errorDetailsBody")}
             style={{ visibility: this.state.errorDetails ? '' : 'hidden' }}
             ref={this._setErrorRef}
        >
          {
            this.props.errorInfo ?
            <Div
              className={this.getClassName("errorInfo")}
              content={this.props.errorInfo}
            /> : null

          }
          <div className={this.getClassName("preWrapper")}>
            <UU5.Bricks.Button className={this.getClassName("copyButton")} content={this.getLsiComponent("copyButton")} onClick={() => UU5.Common.Tools.copyToClipboard(JSON.stringify(content, null, 2))} />
            <pre className={this.getClassName("pre")}>
              {JSON.stringify(content, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    );
  },

  _getErrorDetailContent(message) {
    let session = Environment.getSession();
    let navigator = window.navigator || {};

    let errorMessage = this._getMessageString(message);
    this.props.error && this.props.error.message && (errorMessage = this.props.error.message);

    let stackTrace;
    if (this.props.error) {
      stackTrace = this.props.error.stack;
    } else {
      stackTrace = new window.Error().stack;
      if (!stackTrace) {
        try {
          throw new Error();
        } catch (e) {
          stackTrace = e.stack;
        }
      }
    }

    return {
      message: errorMessage,
      data: this.props.errorData,
      stackTrace: stackTrace && process.env.NODE_ENV !== "test" ? stackTrace.split('\n') : [],
      uuIdentity: session ? session.uuIdentity : null,
      url: window.location.href.replace(/([?&](?:access_token|uuAT)=)[^&#]*/g, "$1..."),
      time: process.env.NODE_ENV !== "test" ? new Date().toISOString() : null,
      navigator: {
        appCodeName: navigator.appCodeName,
        appName: navigator.appName,
        appVersion: navigator.appVersion,
        connection: navigator.connection,
        cookieEnabled: navigator.cookieEnabled,
        doNotTrack: navigator.doNotTrack,
        hardwareConcurrency: navigator.hardwareConcurrency,
        language: navigator.language,
        languages: navigator.languages,
        maxTouchPoints: navigator.maxTouchPoints,
        onLine: navigator.onLine,
        platform: navigator.platform,
        product: navigator.product,
        productSub: navigator.productSub,
        userAgent: navigator.userAgent,
        vendor: navigator.vendor,
        vendorSub: navigator.vendorSub
      },
      libs: this._getRuntimeLibraries()
    };
  },

  _getRuntimeLibraries() {
    let libraries = {};
    libraries[Environment.name] = Environment.version;

    let runtimeLibraries = Environment.getRuntimeLibraries();
    Object.keys(runtimeLibraries).forEach((key) => {
      libraries[key] = runtimeLibraries[key].version;
    });

    return libraries;
  },

  _errorDetailsToggle() {
    this.setState((state) => {
      return { errorDetails: !state.errorDetails }
    });
    return this;
  },
  //@@viewOff:componentSpecificHelpers

  //@@viewOn:render
  render: function () {
    let component;
    switch (this.props.inline ? "inline" : this.getNestingLevel()) {
      case 'smallBox':
        component = (
          <div {...this._getMainAttrs()} >
            <div className={this.getClassName("mainWrapper")}>
              <div className={this.getClassName("iconWrapper")}>
                <span className={"mdi mdi-alert-circle " + this.getClassName("icon")} />
              </div>
              <div className={this.getClassName().content}>
                {this._getContent()}
              </div>

            </div>
            {this.props.moreInfo && (this._getMoreInfoContent(this.props.content || this.props.children || this.getDefault().content))}


            {this.getDisabledCover()}
          </div>
        );
        break;
      case 'inline':
        component = (
          <span {...this._getMainAttrs()} >
            {this._getContent()}
            {this.getDisabledCover()}
          </span>
        );
        break;
      default:
        component = null;
    }
    return component;

  }
  //@@viewOff:render
});

export default Error;
