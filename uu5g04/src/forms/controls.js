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
import ns from "./forms-ns.js";
import "uu5g04-bricks";

import ControlsMixin from './mixins/controls-mixin.js';
import './controls.less';

const buttonPropTypes = PropTypes.shape({
  size: PropTypes.oneOf(['s', 'm', 'l', 'xl']),
  content: PropTypes.any,
  colorSchema: PropTypes.oneOf(UU5.Environment.colorSchema),
  bgStyle: PropTypes.oneOf(['filled', 'outline', 'transparent', 'underline'])
});

export const Controls = createReactClass({

  //@@viewOn:mixins
  mixins: [ControlsMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("Controls"),
    classNames: {
      main: ns.css("controls")
    },
    lsi: () => (UU5.Environment.Lsi.Forms.controls),
    defaults: {
      reset: { bgStyle: "transparent" },
      validate: { bgStyle: "transparent" },
      submit: { colorSchema: "primary" },
      cancel: { }
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    buttonSubmitProps: buttonPropTypes,
    buttonCancelProps: buttonPropTypes,
    buttonResetProps: buttonPropTypes,
    buttonValidateProps: buttonPropTypes,
    buttonReset: PropTypes.bool,
    buttonValidate: PropTypes.bool
  },
 //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps () {
    return {
      buttonReset: false,
      buttonValidate: false,
      buttonSubmitProps:null,
      buttonCancelProps:null,
      buttonValidateProps:null,
      buttonResetProps:null
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:standardComponentLifeCycle
  getInitialState(){
    return this._mergeButtonsState();
  },
  componentWillReceiveProps(nextProps){
    if(this.props.controlled){
      this.setState(this._mergeButtonsState(nextProps));
    }
  },
  //@@viewOff:standardComponentLifeCycle

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:overridingMethods
  //@@viewOff:overridingMethods

  //@@viewOn:componentSpecificHelpers
  _save() {
    let form = this.getForm();
    form.save();

    return this;
  },

  _getMainPropsToPass() {
    let props = this.getMainPropsToPass();
    props.disabled = false;

    return props;
  },
  _mergeButtonsState(props = this.props) {
    let newState = {
      buttonResetProps: UU5.Common.Tools.merge({}, this.getDefault("reset"), props.buttonResetProps),
      buttonValidateProps: UU5.Common.Tools.merge({}, this.getDefault("validate"), props.buttonValidateProps),
      buttonSubmitProps: UU5.Common.Tools.merge({}, this.getDefault("submit"), props.buttonSubmitProps),
      buttonCancelProps: UU5.Common.Tools.merge({}, this.getDefault("cancel"), props.buttonCancelProps)
    };
    newState.buttonResetProps.content = newState.buttonResetProps.content || this.getLsiComponent("reset");
    newState.buttonValidateProps.content = newState.buttonValidateProps.content ||  this.getLsiComponent("validate");
    newState.buttonCancelProps.content = newState.buttonCancelProps.content ||  this.getLsiComponent("cancel");
    newState.buttonSubmitProps.content = newState.buttonSubmitProps.content ||  this.getLsiComponent("ok");


    return newState;
  },
  //@@viewOff:componentSpecificHelpers

  //@@viewOn:render
  render() {
    return (
      <UU5.Common.Div {...this._getMainPropsToPass()}>
        {(this.props.buttonReset) && 
          <UU5.Bricks.Button
            {...this.state.buttonResetProps}
            onClick={() => this.getForm().reset()}
            disabled={this.isDisabled()}
          />
        }

        {(this.props.buttonValidate) && <UU5.Bricks.Button
          {...this.state.buttonValidateProps}
            onClick={() => this.getForm().validate()}
            disabled={this.isDisabled()}
        />}
        <UU5.Bricks.Button
          {...this.state.buttonCancelProps}
          onClick={() => this.getForm().cancel()}
          disabled={this.isDisabled()}
        />
        <UU5.Bricks.Button
          {...this.state.buttonSubmitProps}
          onClick={this._save}
          disabled={this.isDisabled()}
        />
      </UU5.Common.Div>
    );
  }
  //@@viewOff:render
});

export default Controls;
