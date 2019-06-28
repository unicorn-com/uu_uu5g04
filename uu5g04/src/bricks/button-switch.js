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

import './button-switch.less';

export const ButtonSwitch = createReactClass({

  //@@viewOn:mixins
  mixins: [
    UU5.Common.BaseMixin,
    UU5.Common.ElementaryMixin,
    UU5.Common.NestingLevelMixin,
    UU5.Common.ContentMixin,
    UU5.Common.PureRenderMixin
  ],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("ButtonSwitch"),
    nestingLevel: 'smallBox',
    classNames: {
      main: ns.css("button-switch")
    },
    opt: {
      nestingLevelWrapper: true
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    onProps: PropTypes.object,
    offProps: PropTypes.object,
    switchedOn: PropTypes.bool,
    props: PropTypes.object
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps: function () {
    return {
      onProps: null,
      offProps: null,
      switchedOn: false,
      props: null
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:standardComponentLifeCycle
  getInitialState: function () {
    return {
      switchedOn: this.props.switchedOn
    };
  },

  componentWillMount() {
    if (this.props.bgStyle) {
      UU5.Common.Tools.warning('Property "bgStyle" is deprecated! Use "props" property instead.');
    }

    if (this.props.size) {
      UU5.Common.Tools.warning('Property "size" is deprecated! Use "props" property instead.');
    }
  },

  componentWillReceiveProps: function (nextProps) {
    if (nextProps.controlled) {
      this.setState({ switchedOn: nextProps.switchedOn });
    }
  },
  //@@viewOff:standardComponentLifeCycle

  //@@viewOn:interface
  switchOn: function (setStateCallback) {
    this.setState({ switchedOn: true }, setStateCallback);
    return this;
  },

  switchOff: function (setStateCallback) {
    this.setState({ switchedOn: false }, setStateCallback);
    return this;
  },

  toggle: function (setStateCallback) {
    this.setState(function (state) {
      return { switchedOn: !state.switchedOn }
    }, setStateCallback);
    return this;
  },

  isSwitchOn: function () {
    return this.state.switchedOn;
  },

  isSwitchOff: function () {
    return !this.isSwitchOn();
  },
  //@@viewOff:interface

  //@@viewOn:overridingMethods
  //@@viewOff:overridingMethods

  //@@viewOn:componentSpecificHelpers
  //@@viewOff:componentSpecificHelpers

  //@@viewOn:render
  render: function () {
    return (
      <Button
        {...this.getMainPropsToPass()}
        size={this.props.size}
        bgStyle={this.props.bgStyle}
        {...this.isSwitchOn() ? this.props.onProps : this.props.offProps}
        {...this.props.props}
      >
        {this.getChildren()}
      </Button>
    );
  }
  //@@viewOff:render
});

export default ButtonSwitch;
