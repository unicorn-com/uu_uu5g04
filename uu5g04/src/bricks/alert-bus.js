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

import Alert from './alert.js';

import './alert-bus.less';

export const AlertBus = createReactClass({

  //@@viewOn:mixins
  mixins: [
    UU5.Common.BaseMixin,
    UU5.Common.ElementaryMixin,
    UU5.Common.NestingLevelMixin,
    UU5.Common.CcrWriterMixin,
    UU5.Common.PureRenderMixin
  ],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("AlertBus"),
    nestingLevelList: UU5.Environment.getNestingLevelList('bigBoxCollection', 'box'),
    classNames: {
      main: ns.css("alert-bus")
    },
    warnings: {
      noMessage: 'Alert "%s" is not set.'
    },
    opt: {
      nestingLevelWrapper: true
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    // has not color schema because color schema css class is added automatically to all alerts,
    // but we just need to set color schema of added alert
    colorSchema: PropTypes.oneOf(UU5.Environment.colorSchema),
    position: PropTypes.string,
    closeTimer: PropTypes.number,
    closeDisabled: PropTypes.bool,
    block: PropTypes.bool,
    forceRender: PropTypes.bool,
    onClose: PropTypes.func
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps: function () {
    return {
      colorSchema: null,
      position: 'center',
      closeTimer: 10000,
      closeDisabled: false,
      block: false,
      forceRender: false,
      onClose: null
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:standardComponentLifeCycle
  getInitialState: function () {
    return {
      alertStack: []
    };
  },
  //@@viewOff:standardComponentLifeCycle

  //@@viewOn:interface
  addAlert: function (alertProps, setStateCallback) {
    if (alertProps.content) {
      let messageProps = this._getMessageProps(null, alertProps);
      let page = this.getCcrComponentByKey(UU5.Environment.CCRKEY_PAGE);
      if (!this.props.forceRender && page && page.getAlertBus() && page.getAlertBus().getId() !== this.getId()) {
        page.getAlertBus().addAlert(messageProps, setStateCallback);
      } else {
        this.setState(function (state) {
          let alertStack = state.alertStack.slice();
          if (alertProps.priority) {
            alertStack.splice(0, 0, messageProps);
          } else {
            alertStack.push(messageProps);
          }
          return { alertStack: alertStack };
        }, setStateCallback);
      }
    } else {
      this.showWarning('noMessage', alertProps.content, { alertProps: alertProps });
    }
    return this;
  },

  addAlertToPosition: function (alertIndex, alertProps, setStateCallback) {
    if (alertProps.content) {
      let messageProps = this._getMessageProps(null, alertProps);
      let page = this.getCcrComponentByKey(UU5.Environment.CCRKEY_PAGE);
      if (!this.props.forceRender && page && page.getAlertBus() && page.getAlertBus().getId() !== this.getId()) {
        page.getAlertBus().addAlertToPosition(alertIndex, messageProps, setStateCallback);
      } else {
        this.setState(function (state) {
          let alertStack = state.alertStack.slice();
          alertStack.splice(alertIndex, 0, messageProps);
          return { alertStack: alertStack };
        }, setStateCallback);
      }
    } else {
      this.showWarning('noMessage', alertProps.content, { alertProps: alertProps });
    }

    return this;
  },

  setAlert: function (alertProps, setStateCallback) {
    if (alertProps.content) {
      let messageProps = this._getMessageProps(null, alertProps);
      let page = this.getCcrComponentByKey(UU5.Environment.CCRKEY_PAGE);
      if (!this.props.forceRender && page && page.getAlertBus() && page.getAlertBus().getId() !== this.getId()) {
        page.getAlertBus().setAlert(messageProps, setStateCallback);
      } else {
        this.setState({ alertStack: [messageProps] }, setStateCallback);
      }
    } else {
      this.showWarning('noMessage', alertProps.content, { alertProps: alertProps });
    }
    return this;
  },

  setAlerts: function (alertStack, setStateCallback) {
    let stateAlertStack = alertStack.slice();
    let page = this.getCcrComponentByKey(UU5.Environment.CCRKEY_PAGE);
    if (!this.props.forceRender && page && page.getAlertBus() && page.getAlertBus().getId() !== this.getId()) {
      page.getAlertBus().setAlerts(stateAlertStack, setStateCallback);
    } else {
      this.setState({ alertStack: stateAlertStack }, setStateCallback);
    }
    return this;
  },

  removeAlert: function (alertId, setStateCallback) {
    let page = this.getCcrComponentByKey(UU5.Environment.CCRKEY_PAGE);
    if (!this.props.forceRender && page && page.getAlertBus() && page.getAlertBus().getId() !== this.getId()) {
      page.getAlertBus().removeAlert(alertId, setStateCallback);
    } else {
      this.setState(function (state) {
        let alertStack = state.alertStack.slice();
        let index = null;

        for (let i = 0; i < alertStack.length; i++) {
          if (alertStack[i].id === alertId) {
            index = i;
            break;
          }
        }

        index !== null && alertStack.splice(index, 1);
        return { alertStack: alertStack };
      }, setStateCallback);
    }

    return this;
  },

  clearAlerts: function (setStateCallback) {
    let page = this.getCcrComponentByKey(UU5.Environment.CCRKEY_PAGE);
    if (!this.props.forceRender && page && page.getAlertBus() && page.getAlertBus().getId() !== this.getId()) {
      page.getAlertBus().clearAlerts(setStateCallback);
    } else {
      let props = this.getAlerts()[0];
      if (props) {
        props.hidden = true;

        this.setState({
            alertStack: [props]
          },
          () => {
            setTimeout(
              () => {
                this.setAsyncState({ alertStack: [] }, setStateCallback)
              },
              Alert.defaults.transitionDuration
            )
          }
        );
      } else {
        typeof setStateCallback === 'function' && setStateCallback();
      }
    }
    return this;
  },

  getAlerts: function () {
    let result = this.state.alertStack;

    let page = this.getCcrComponentByKey(UU5.Environment.CCRKEY_PAGE);
    if (!this.props.forceRender && page && page.getAlertBus() && page.getAlertBus().getId() !== this.getId()) {
      result = page.getAlertBus().getAlerts();
    }

    return result;
  },
  //@@viewOff:interface

  //@@viewOn:overridingMethods
  //@@viewOff:overridingMethods

  //@@viewOn:componentSpecificHelpers
  _getMessageProps: function (message, alertProps) {
    alertProps = alertProps || {};
    var alertBus = this;
    var messageId = alertProps.id || UU5.Common.Tools.generateUUID();

    return {
      id: messageId,
      hidden: false,

      content: alertProps.content,
      header: alertProps.header,
      colorSchema: typeof alertProps.colorSchema === 'string' ? alertProps.colorSchema : this.props.colorSchema,
      closeTimer: typeof alertProps.closeTimer === 'number' ? alertProps.closeTimer : this.props.closeTimer,
      closeDisabled: alertProps.closeDisabled === undefined ? this.props.closeDisabled : alertProps.closeDisabled,
      key: messageId,
      onClose: alert => {
        var onClose;
        if (typeof alertProps.onClose === 'function') {
          onClose = function () {
            alertProps.onClose(alert);
          }
        } else if (typeof alertBus.props.onClose === 'function') {
          onClose = function () {
            alertBus.props.onClose(alert);
          }
        }

        alertBus.removeAlert(messageId, onClose);
      }
    };
  },
  //@@viewOff:componentSpecificHelpers

  // Render
  _getProps: function () {
    // use only local alert stack - do not use alert stack from page. It leads to show alerts from page alert bus.
    const alertStack = this.state.alertStack;

    let alertProps = this.getMainPropsToPass();
    const hidden = alertStack.length === 0;
    alertProps.hidden = hidden;

    if (!hidden) {
      alertProps = UU5.Common.Tools.merge({}, alertProps, alertStack[0]);
    }

    alertProps.id = this.getId() + '-alert';
    alertProps.position = this.props.position;
    alertProps.block = this.props.block;

    return alertProps;
  },

  //@@viewOn:render
  render: function () {
    return (this.getNestingLevel() ? <Alert {...this._getProps()} /> : null)
  }
  //@@viewOff:render
});

export default AlertBus;
